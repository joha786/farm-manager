import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import ChartPanel from './ChartPanel';
import { COLOR_SET } from '../constants';
import { farmName, groupSum, monthlyProfit, sumByAmount } from '../utils/calculations';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  }
};

export default function BusinessCharts({ farms, income, expenses }) {
  const incomeTotal = sumByAmount(income);
  const expenseTotal = sumByAmount(expenses);
  const expenseByCategory = groupSum(expenses, 'category');
  const profitSeries = monthlyProfit(income, expenses);
  const farmContribution = farms.reduce((acc, farm) => {
    const farmIncome = sumByAmount(income.filter((item) => item.farmId === farm.id));
    if (farmIncome > 0) acc[farmName(farms, farm.id)] = farmIncome;
    return acc;
  }, {});

  return (
    <div className="charts-grid">
      <ChartPanel title="Income vs Expense">
        <Bar
          options={options}
          data={{
            labels: ['Income', 'Expenses'],
            datasets: [{ label: 'Amount', data: [incomeTotal, expenseTotal], backgroundColor: ['#2f7d5c', '#b44f64'] }]
          }}
        />
      </ChartPanel>
      <ChartPanel title="Expense Distribution">
        <Pie
          options={options}
          data={{
            labels: Object.keys(expenseByCategory),
            datasets: [{ data: Object.values(expenseByCategory), backgroundColor: COLOR_SET }]
          }}
        />
      </ChartPanel>
      <ChartPanel title="Profit Over Time">
        <Line
          options={options}
          data={{
            labels: profitSeries.map((item) => item.month),
            datasets: [
              {
                label: 'Profit',
                data: profitSeries.map((item) => item.profit),
                borderColor: '#2f7d5c',
                backgroundColor: '#2f7d5c',
                tension: 0.35
              }
            ]
          }}
        />
      </ChartPanel>
      <ChartPanel title="Farm Contribution">
        <Doughnut
          options={options}
          data={{
            labels: Object.keys(farmContribution),
            datasets: [{ data: Object.values(farmContribution), backgroundColor: COLOR_SET }]
          }}
        />
      </ChartPanel>
    </div>
  );
}
