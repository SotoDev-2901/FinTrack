import type { DashboardState, DashboardAction } from './dashboardReducersInterface';

export const initialDashboardState: DashboardState = {
  stats: {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    last30DaysIncome: 0,
    last30DaysExpense: 0
  },
  expensesByCategory: [],
  incomeByCategory: [],
  balanceHistory: [],
  loading: false
};

export const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };

    case 'SET_EXPENSES_BY_CATEGORY':
      return {
        ...state,
        expensesByCategory: action.payload
      };

    case 'SET_INCOME_BY_CATEGORY':
      return {
        ...state,
        incomeByCategory: action.payload
      };

    case 'SET_BALANCE_HISTORY':
      return {
        ...state,
        balanceHistory: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'RESET':
      return initialDashboardState;

    default:
      return state;
  }
};