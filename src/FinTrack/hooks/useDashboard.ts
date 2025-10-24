import { useReducer, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../authentication/hooks/useAuth';
import { dashboardReducer, initialDashboardState } from '../reducers/dashboard/dashboardReducers';
import type { Transaction, CategoryStats, BalanceHistory } from '../reducers/dashboard/dashboardReducersInterface';

export const useDashboard = () => {
  const { authState } = useAuth();
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

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

  const calculateStats = (transactions: Transaction[]) => {
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
      last30DaysExpense: 0
    });

    stats.totalBalance = stats.totalIncome - stats.totalExpense;

    return stats;
  };

  const groupByCategory = (transactions: Transaction[], type: 'income' | 'expense'): CategoryStats[] => {
    const filtered = transactions.filter(t => t.type === type);

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

  const calculateBalanceHistory = (transactions: Transaction[]): BalanceHistory[] => {
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
        balance: previousBalance + balance
      });
    }

    return history;
  };

  const loadDashboardData = useCallback(async () => {
    if (!authState.user?.uid) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const transactions = await fetchTransactions();

      const stats = calculateStats(transactions);
      dispatch({ type: 'SET_STATS', payload: stats });

      const expensesByCategory = groupByCategory(transactions, 'expense');
      dispatch({ type: 'SET_EXPENSES_BY_CATEGORY', payload: expensesByCategory });

      const incomeByCategory = groupByCategory(transactions, 'income');
      dispatch({ type: 'SET_INCOME_BY_CATEGORY', payload: incomeByCategory });

      const balanceHistory = calculateBalanceHistory(transactions);
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

  return {
    stats: state.stats,
    expensesByCategory: state.expensesByCategory,
    incomeByCategory: state.incomeByCategory,
    balanceHistory: state.balanceHistory,
    loading: state.loading,
    refetch: loadDashboardData
  };
};