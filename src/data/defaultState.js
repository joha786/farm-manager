const today = new Date().toISOString().slice(0, 10);

export const defaultState = {
  farms: [],
  inventory: [],
  expenses: [],
  income: [],
  production: [],
  animals: [],
  crops: [],
  reminders: [],
  settings: {
    theme: 'light',
    lastBackupAt: null,
    storageDriver: 'supabase',
    lastSyncedAt: null
  },
  updatedAt: today
};
