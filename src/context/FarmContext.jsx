import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  clearLegacyBrowserFarmData,
  emptyState,
  loadStateFromSupabase,
  saveState
} from '../utils/storage';

const FarmContext = createContext(null);

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'replace':
      return action.payload;
    case 'toggle-theme':
      return {
        ...state,
        settings: { ...state.settings, theme: state.settings.theme === 'dark' ? 'light' : 'dark' }
      };
    case 'add-farm':
      return { ...state, farms: [...state.farms, { ...action.payload, id: uid('farm') }] };
    case 'update-farm':
      return {
        ...state,
        farms: state.farms.map((farm) => (farm.id === action.payload.id ? action.payload : farm))
      };
    case 'delete-farm':
      return {
        ...state,
        farms: state.farms.filter((farm) => farm.id !== action.id),
        inventory: state.inventory.filter((item) => item.farmId !== action.id),
        expenses: state.expenses.filter((item) => item.farmId !== action.id),
        income: state.income.filter((item) => item.farmId !== action.id),
        production: state.production.filter((item) => item.farmId !== action.id),
        animals: state.animals.filter((item) => item.farmId !== action.id),
        crops: state.crops.filter((item) => item.farmId !== action.id)
      };
    case 'add-inventory':
      return { ...state, inventory: [...state.inventory, { ...action.payload, id: uid('inv') }] };
    case 'update-inventory':
      return {
        ...state,
        inventory: state.inventory.map((item) => (item.id === action.payload.id ? action.payload : item))
      };
    case 'delete-inventory':
      return { ...state, inventory: state.inventory.filter((item) => item.id !== action.id) };
    case 'add-expense':
      return { ...state, expenses: [...state.expenses, { ...action.payload, id: uid('exp') }] };
    case 'delete-expense':
      return { ...state, expenses: state.expenses.filter((item) => item.id !== action.id) };
    case 'add-income':
      return { ...state, income: [...state.income, { ...action.payload, id: uid('inc') }] };
    case 'delete-income':
      return { ...state, income: state.income.filter((item) => item.id !== action.id) };
    case 'add-production': {
      const production = { ...action.payload, id: uid('prod') };
      const incomeEntry = Number(production.value || 0) > 0
        ? {
            id: uid('inc'),
            farmId: production.farmId,
            category: ['Milk', 'Eggs', 'Meat', 'Fish'].includes(production.product) ? production.product : 'Crops',
            amount: Number(production.value),
            date: production.date,
            note: `Production sale: ${production.quantity} ${production.unit} ${production.product}`
          }
        : null;
      return {
        ...state,
        production: [...state.production, production],
        income: incomeEntry ? [...state.income, incomeEntry] : state.income
      };
    }
    case 'delete-production':
      return { ...state, production: state.production.filter((item) => item.id !== action.id) };
    case 'add-animal':
      return { ...state, animals: [...state.animals, { ...action.payload, id: uid('animal') }] };
    case 'delete-animal':
      return { ...state, animals: state.animals.filter((item) => item.id !== action.id) };
    case 'add-crop':
      return { ...state, crops: [...state.crops, { ...action.payload, id: uid('crop') }] };
    case 'delete-crop':
      return { ...state, crops: state.crops.filter((item) => item.id !== action.id) };
    case 'add-reminder':
      return { ...state, reminders: [...state.reminders, { ...action.payload, id: uid('rem') }] };
    case 'toggle-reminder':
      return {
        ...state,
        reminders: state.reminders.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item
        )
      };
    case 'delete-reminder':
      return { ...state, reminders: state.reminders.filter((item) => item.id !== action.id) };
    default:
      return state;
  }
}

export function FarmProvider({ children, userId }) {
  const [state, dispatch] = useReducer(reducer, undefined, emptyState);
  const [cloudReady, setCloudReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    clearLegacyBrowserFarmData();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  useEffect(() => {
    if (!userId) return;
    setCloudReady(false);
    loadStateFromSupabase(userId)
      .then((cloudState) => {
        setSyncError('');
        dispatch({ type: 'replace', payload: cloudState || emptyState() });
      })
      .catch((error) => {
        console.warn(error.message);
        setSyncError(error.message);
        dispatch({ type: 'replace', payload: emptyState() });
      })
      .finally(() => setCloudReady(true));
  }, [userId]);

  useEffect(() => {
    if (!cloudReady || !userId) return;
    saveState(state, userId)
      .then((saved) => {
        setSyncStatus(saved.settings.lastSyncedAt);
        setSyncError('');
      })
      .catch((error) => {
        console.warn(error.message);
        setSyncError(error.message);
      });
  }, [state, cloudReady, userId]);

  const value = useMemo(
    () => ({ state, dispatch, cloudReady, syncStatus, syncError }),
    [state, cloudReady, syncStatus, syncError]
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) throw new Error('useFarm must be used inside FarmProvider');
  return context;
}
