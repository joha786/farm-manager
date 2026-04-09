import { defaultState } from '../data/defaultState';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const STATE_ID = 'current';
const LEGACY_DB_NAME = 'farm-manager-db';
const LEGACY_KEY_PREFIX = 'farm-manager-state-v1';

export function emptyState() {
  return mergeState(defaultState);
}

export async function saveState(state, userId) {
  const now = new Date().toISOString();
  const nextState = {
    ...state,
    updatedAt: now,
    settings: { ...state.settings, storageDriver: 'supabase', lastSyncedAt: now }
  };
  await saveStateToSupabase(nextState, userId);
  return nextState;
}

export async function loadStateFromSupabase(userId) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
  }
  const { data, error } = await supabase
    .from('farm_manager_state')
    .select('state')
    .eq('id', userId || STATE_ID)
    .maybeSingle();
  if (error) throw error;
  return data?.state ? mergeState(data.state) : null;
}

export async function saveStateToSupabase(state, userId) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
  }
  const { error } = await supabase
    .from('farm_manager_state')
    .upsert({
      id: userId || STATE_ID,
      user_id: userId || null,
      state,
      updated_at: new Date().toISOString()
    });
  if (error) throw error;
}

export function clearLegacyBrowserFarmData() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(LEGACY_KEY_PREFIX))
    .forEach((key) => localStorage.removeItem(key));

  if ('indexedDB' in window) {
    indexedDB.deleteDatabase(LEGACY_DB_NAME);
  }
}

export function mergeState(state) {
  return {
    ...defaultState,
    ...state,
    farms: Array.isArray(state?.farms) ? state.farms : [],
    inventory: Array.isArray(state?.inventory) ? state.inventory : [],
    expenses: Array.isArray(state?.expenses) ? state.expenses : [],
    income: Array.isArray(state?.income) ? state.income : [],
    production: Array.isArray(state?.production) ? state.production : [],
    animals: Array.isArray(state?.animals) ? state.animals : [],
    crops: Array.isArray(state?.crops) ? state.crops : [],
    reminders: Array.isArray(state?.reminders) ? state.reminders : [],
    settings: { ...defaultState.settings, ...state?.settings }
  };
}
