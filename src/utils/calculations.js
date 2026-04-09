export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export function sumByAmount(records) {
  return records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

export function farmName(farms, farmId) {
  return farms.find((farm) => farm.id === farmId)?.name || 'Unassigned';
}

export function filterTransactions(records, filters) {
  return records.filter((item) => {
    const afterStart = !filters.start || item.date >= filters.start;
    const beforeEnd = !filters.end || item.date <= filters.end;
    const matchesFarm = filters.farmId === 'all' || item.farmId === filters.farmId;
    return afterStart && beforeEnd && matchesFarm;
  });
}

export function groupSum(records, key) {
  return records.reduce((acc, item) => {
    const label = item[key] || 'Other';
    acc[label] = (acc[label] || 0) + Number(item.amount || 0);
    return acc;
  }, {});
}

export function monthlyProfit(income, expenses) {
  const months = new Set([...income, ...expenses].map((item) => item.date?.slice(0, 7)).filter(Boolean));
  return [...months].sort().map((month) => {
    const totalIncome = sumByAmount(income.filter((item) => item.date?.startsWith(month)));
    const totalExpenses = sumByAmount(expenses.filter((item) => item.date?.startsWith(month)));
    return { month, profit: totalIncome - totalExpenses };
  });
}
