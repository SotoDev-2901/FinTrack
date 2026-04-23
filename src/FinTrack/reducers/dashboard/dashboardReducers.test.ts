import { describe, expect, it } from 'vitest';
import { dashboardReducer, initialDashboardState } from './dashboardReducers';

describe('dashboardReducer', () => {
  it('maneja estadísticas, gráficos, loading y reset', () => {
    const stats = {
      totalBalance: 100,
      totalIncome: 200,
      totalExpense: 100,
      last30DaysIncome: 150,
      last30DaysExpense: 50,
    };

    const expenses = [{ name: 'Food', amount: 80 }];
    const income = [{ name: 'Salary', amount: 200 }];
    const history = [{ month: 'Abr', balance: 100 }];

    const withStats = dashboardReducer(initialDashboardState, { type: 'SET_STATS', payload: stats });
    expect(withStats.stats).toEqual(stats);

    expect(dashboardReducer(withStats, { type: 'SET_EXPENSES_BY_CATEGORY', payload: expenses }).expensesByCategory).toEqual(expenses);
    expect(dashboardReducer(withStats, { type: 'SET_INCOME_BY_CATEGORY', payload: income }).incomeByCategory).toEqual(income);
    expect(dashboardReducer(withStats, { type: 'SET_BALANCE_HISTORY', payload: history }).balanceHistory).toEqual(history);
    expect(dashboardReducer(withStats, { type: 'SET_LOADING', payload: true }).loading).toBe(true);
    expect(dashboardReducer(withStats, { type: 'RESET' })).toEqual(initialDashboardState);
  });
});