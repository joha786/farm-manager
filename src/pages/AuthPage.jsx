import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../utils/supabaseClient';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    identifier: '',
    name: '',
    username: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage('');
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'login') {
        await signIn(form.identifier, form.password);
      } else {
        await signUp(form);
        setMessage('Registration complete. If email confirmation is enabled in Supabase, check your inbox before logging in.');
        setMode('login');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <img src="/farm-logo.svg" alt="Farm Manager logo" />
        <span className="eyebrow">Farm Manager</span>
        <h1>Secure access for every farm user</h1>
        <p>Register, log in, and keep each user&apos;s farm records separated in Supabase.</p>
      </section>

      <section className="auth-panel">
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Register</button>
        </div>

        {!isSupabaseConfigured && (
          <div className="notice">
            Add Supabase URL and anon key to <strong>.env</strong> before using authentication.
          </div>
        )}

        <form className="form-grid auth-form" onSubmit={submit}>
          {mode === 'login' ? (
            <>
              <label className="wide">
                Username or email
                <input name="identifier" value={form.identifier} onChange={change} required />
              </label>
              <label className="wide">
                Password
                <input name="password" type="password" value={form.password} onChange={change} required />
              </label>
            </>
          ) : (
            <>
              <label>
                Full name
                <input name="name" value={form.name} onChange={change} required />
              </label>
              <label>
                Username
                <input name="username" value={form.username} onChange={change} required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={change} required />
              </label>
              <label>
                Password
                <input name="password" type="password" minLength="6" value={form.password} onChange={change} required />
              </label>
              <label className="wide">
                Address
                <input name="address" value={form.address} onChange={change} required />
              </label>
              <label className="wide">
                Phone
                <input name="phone" value={form.phone} onChange={change} />
              </label>
            </>
          )}

          {message && <p className="auth-message wide">{message}</p>}

          <div className="form-actions wide">
            <button className="primary-button" type="submit" disabled={busy || !isSupabaseConfigured}>
              {busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
