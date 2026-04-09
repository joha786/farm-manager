import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    setProfile(data || null);
  }

  async function signIn(identifier, password) {
    let email = identifier.trim();
    if (!email.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', email)
        .maybeSingle();
      if (error) throw error;
      if (!data?.email) throw new Error('Username not found.');
      email = data.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp({ name, username, email, password, address, phone }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, username, address, phone } }
    });
    if (error) throw error;

    if (data.user && data.session) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        username,
        email,
        address,
        phone,
        updated_at: new Date().toISOString()
      });
      if (profileError) throw profileError;
      await loadProfile(data.user.id);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = useMemo(
    () => ({
      user: session?.user || null,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
