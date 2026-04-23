import type {
  BalanceHistory,
  CategoryStats,
  DashboardStats,
  Transaction,
} from '../reducers/dashboard/dashboardReducersInterface';

export interface MonthOption {
  value: string;
  label: string;
}

export const calculateStats = (transactions: Transaction[]): DashboardStats => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = transactions.reduce((acc, transaction) => {
    const amount = transaction.amount;
    const transactionDate = new Date(transaction.date);

    if (transaction.type === 'income') {
      acc.totalIncome += amount;
      if (transactionDate >= thirtyDaysAgo) {
        acc.last30DaysIncome += amount;
      }
    } else if (transaction.type === 'expense') {
      acc.totalExpense += amount;
      if (transactionDate >= thirtyDaysAgo) {
        acc.last30DaysExpense += amount;
      }
    }

    return acc;
  }, {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    last30DaysIncome: 0,
    last30DaysExpense: 0,
  });

  stats.totalBalance = stats.totalIncome - stats.totalExpense;

  return stats;
};

export const groupByCategory = (
  transactions: Transaction[],
  type: 'income' | 'expense',
  monthFilter?: string,
): CategoryStats[] => {
  let filtered = transactions.filter(t => t.type === type);

  if (monthFilter && monthFilter !== 'all') {
    filtered = filtered.filter(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === monthFilter;
    });
  }

  const grouped = filtered.reduce((acc, transaction) => {
    const categoryName = transaction.categoryName || 'Sin categoría';
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
};

export const calculateBalanceHistory = (transactions: Transaction[]): BalanceHistory[] => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const now = new Date();
  const history: BalanceHistory[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[date.getMonth()];
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= date && tDate < nextMonth;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    const previousBalance = i === 5 ? 0 : history[history.length - 1]?.balance || 0;
    history.push({
      month: monthName,
      balance: previousBalance + balance,
    });
  }

  return history;
};

export const calculateMonthlyAverages = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    return { monthlyExpenseAvg: 0, monthlyIncomeAvg: 0 };
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const recentTransactions = transactions.filter(t => new Date(t.date) >= sixMonthsAgo);

  const monthsWithData = new Set<string>();
  recentTransactions.forEach(t => {
    const date = new Date(t.date);
    monthsWithData.add(`${date.getFullYear()}-${date.getMonth()}`);
  });

  const numMonths = Math.max(monthsWithData.size, 1);

  const totals = recentTransactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc.expenses += t.amount;
    } else {
      acc.income += t.amount;
    }
    return acc;
  }, { expenses: 0, income: 0 });

  return {
    monthlyExpenseAvg: totals.expenses / numMonths,
    monthlyIncomeAvg: totals.income / numMonths,
  };
};

export const buildAvailableMonths = (): MonthOption[] => {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const options: MonthOption[] = [{ value: 'all', label: 'Total' }];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value: monthKey,
      label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
    });
  }

  return options;
};