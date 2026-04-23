import { useReducer, useEffect, useCallback, useState, useMemo } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../authentication/hooks/useAuth';
import { dashboardReducer, initialDashboardState } from '../reducers/dashboard/dashboardReducers';
import type { Transaction, CategoryStats } from '../reducers/dashboard/dashboardReducersInterface';
import {
  buildAvailableMonths,
  calculateBalanceHistory,
  calculateMonthlyAverages,
  calculateStats,
  groupByCategory,
  type MonthOption,
} from './useDashboardUtils';

export const useDashboard = () => {
  const { authState } = useAuth();
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async (): Promise<Transaction[]> => {
    if (!authState.user?.uid) {
      return [];
    }

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', authState.user.uid)
    );

    const snapshot = await getDocs(q);
    
    const transactions = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let categoryName = 'Sin categoría';
        
        const catId = data.categoryId || data.category;
        if (catId) {
          try {
            const categoryDoc = await getDoc(doc(db, 'categories', catId));
            if (categoryDoc.exists()) {
              categoryName = categoryDoc.data().name || 'Sin categoría';
            }
          } catch (error) {
            console.error('Error obteniendo categoría:', error);
          }
        }
        
        return {
          id: docSnap.id,
          ...data,
          categoryName
        } as Transaction;
      })
    );

    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [authState.user?.uid]);

  const loadDashboardData = useCallback(async () => {
    if (!authState.user?.uid) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const fetchedTransactions = await fetchTransactions();
      setTransactions(fetchedTransactions);

      const stats = calculateStats(fetchedTransactions);
      dispatch({ type: 'SET_STATS', payload: stats });

      const expensesByCategory = groupByCategory(fetchedTransactions, 'expense');
      dispatch({ type: 'SET_EXPENSES_BY_CATEGORY', payload: expensesByCategory });

      const incomeByCategory = groupByCategory(fetchedTransactions, 'income');
      dispatch({ type: 'SET_INCOME_BY_CATEGORY', payload: incomeByCategory });

      const balanceHistory = calculateBalanceHistory(fetchedTransactions);
      dispatch({ type: 'SET_BALANCE_HISTORY', payload: balanceHistory });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [authState.user?.uid, fetchTransactions]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const availableMonths = useMemo((): MonthOption[] => buildAvailableMonths(), []);

  const getCategoryDataByMonth = useCallback((type: 'income' | 'expense', monthFilter: string): CategoryStats[] => {
    return groupByCategory(transactions, type, monthFilter);
  }, [transactions]);

  const monthlyAverages = useMemo(() => calculateMonthlyAverages(transactions), [transactions]);

  return {
    stats: state.stats,
    expensesByCategory: state.expensesByCategory,
    incomeByCategory: state.incomeByCategory,
    balanceHistory: state.balanceHistory,
    loading: state.loading,
    refetch: loadDashboardData,
    availableMonths,
    getCategoryDataByMonth,
    monthlyAverages
  };
};