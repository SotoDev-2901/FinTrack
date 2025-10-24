export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface CategoryStats {
  name: string;
  amount: number;
}

export interface BalanceHistory {
  month: string;
  balance: number;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  last30DaysIncome: number;
  last30DaysExpense: number;
}

export interface DashboardState {
  stats: DashboardStats;
  expensesByCategory: CategoryStats[];
  incomeByCategory: CategoryStats[];
  balanceHistory: BalanceHistory[];
  loading: boolean;
}

export type DashboardAction =
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_EXPENSES_BY_CATEGORY'; payload: CategoryStats[] }
  | { type: 'SET_INCOME_BY_CATEGORY'; payload: CategoryStats[] }
  | { type: 'SET_BALANCE_HISTORY'; payload: BalanceHistory[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };