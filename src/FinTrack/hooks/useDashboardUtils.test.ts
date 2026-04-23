import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAvailableMonths,
  calculateBalanceHistory,
  calculateMonthlyAverages,
  calculateStats,
  groupByCategory,
} from './useDashboardUtils';
import type { Transaction } from '../reducers/dashboard/dashboardReducersInterface';

const transactions: Transaction[] = [
  {
    id: '1', userId: 'u1', categoryId: 'c1', categoryName: 'Salary', type: 'income', amount: 3000,
    description: 'salary', date: '2026-04-10', createdAt: '2026-04-10',
  },
  {
    id: '2', userId: 'u1', categoryId: 'c2', categoryName: 'Food', type: 'expense', amount: 500,
    description: 'food', date: '2026-04-15', createdAt: '2026-04-15',
  },
  {
    id: '3', userId: 'u1', categoryId: 'c2', categoryName: 'Food', type: 'expense', amount: 200,
    description: 'food', date: '2026-03-20', createdAt: '2026-03-20',
  },
  {
    id: '4', userId: 'u1', categoryId: 'c3', categoryName: 'Bonus', type: 'income', amount: 1000,
    description: 'bonus', date: '2025-12-10', createdAt: '2025-12-10',
  },
];

describe('useDashboardUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-21T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calcula estadísticas core', () => {
    expect(calculateStats(transactions)).toEqual({
      totalBalance: 3300,
      totalIncome: 4000,
      totalExpense: 700,
      last30DaysIncome: 3000,
      last30DaysExpense: 500,
    });
  });

  it('agrupa por categoría y limita a top 5', () => {
    expect(groupByCategory(transactions, 'expense')).toEqual([{ name: 'Food', amount: 700 }]);
    expect(groupByCategory(transactions, 'income')).toEqual([
      { name: 'Salary', amount: 3000 },
      { name: 'Bonus', amount: 1000 },
    ]);
  });

  it('construye el historial acumulado y el promedio mensual', () => {
    const history = calculateBalanceHistory(transactions);
    expect(history).toHaveLength(6);
    expect(history.at(-1)?.balance).toBeGreaterThan(0);

    expect(calculateMonthlyAverages(transactions)).toEqual({
      monthlyExpenseAvg: expect.any(Number),
      monthlyIncomeAvg: expect.any(Number),
    });
  });

  it('construye opciones de meses', () => {
    expect(buildAvailableMonths()[0]).toEqual({ value: 'all', label: 'Total' });
    expect(buildAvailableMonths()).toHaveLength(13);
  });
});