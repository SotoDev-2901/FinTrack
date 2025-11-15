import { useReducer, useCallback, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../authentication/hooks/useAuth';
import { transactionReducer, initialTransactionState } from '../reducers/transaction/transactionReducers';
import type { Transaction } from '../reducers/transaction/transactionReducersInterface';

export const useTransaction = () => {
  const { authState } = useAuth();
  const [state, dispatch] = useReducer(transactionReducer, initialTransactionState);

  const fetchTransactions = useCallback(async () => {
    if (!authState.user?.uid) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", authState.user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      const transactionsData = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let categoryName = 'Sin categoría';
          
          const categoryId = data.categoryId || data.category;
          
          if (categoryId) {
            try {
              const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
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
            categoryId: categoryId || '',
            categoryName: categoryName,
            description: data.description || ''
          } as Transaction;
        })
      );

      const sortedTransactions = transactionsData.sort((a, b) => {
        const getTimestamp = (createAt: any) => {
          if (createAt?.toDate) {
            return createAt.toDate().getTime();
          }
          if (createAt?.seconds) {
            return createAt.seconds * 1000;
          }
          if (createAt instanceof Date) {
            return createAt.getTime();
          }
          return 0;
        };

        return getTimestamp(b.createAt) - getTimestamp(a.createAt);
      });

      dispatch({ type: 'SET_TRANSACTIONS', payload: sortedTransactions });
    } catch (error: any) {
      console.error("Error cargando transacciones:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error cargando transacciones' });
    }
  }, [authState.user?.uid]);

  const createTransaction = useCallback(async (
    formData: {
      type: 'expense' | 'income';
      amount: number;
      date: string;
      description?: string;
    }, 
    categoryId: string
  ) => {
    if (!authState.user?.uid) {
      const error = "Usuario no autenticado";
      dispatch({ type: 'SET_ERROR', payload: error });
      throw new Error(error);
    }

    try {
      const transactionData = {
        type: formData.type,
        amount: Math.abs(formData.amount),
        categoryId: categoryId,
        date: formData.date,
        description: formData.description || '',
        userId: authState.user.uid,
        createAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, "transactions"), transactionData);

      let categoryName = 'Sin categoría';
      if (categoryId) {
        try {
          const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
          if (categoryDoc.exists()) {
            categoryName = categoryDoc.data().name || 'Sin categoría';
          }
        } catch (error) {
          console.error('Error obteniendo categoría para nueva transacción:', error);
        }
      }

      const newTransaction: Transaction = {
        id: docRef.id,
        ...transactionData,
        categoryName: categoryName
      };

      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      
      return newTransaction;
    } catch (error: any) {
      console.error("Error creando transacción:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error creando transacción' });
      throw error;
    }
  }, [authState.user?.uid]);

  const updateTransaction = useCallback(async (
    transactionId: string, 
    formData: {
      type: 'expense' | 'income';
      amount: number;
      date: string;
      description?: string;
    }, 
    categoryId: string
  ) => {
    try {
      const updatePayload = {
        type: formData.type,
        amount: Math.abs(formData.amount),
        categoryId: categoryId,
        date: formData.date,
        description: formData.description || ''
      };

      await updateDoc(doc(db, "transactions", transactionId), updatePayload);

      let categoryName = 'Sin categoría';
      if (categoryId) {
        try {
          const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
          if (categoryDoc.exists()) {
            categoryName = categoryDoc.data().name || 'Sin categoría';
          }
        } catch (error) {
          console.error('Error obteniendo categoría para transacción actualizada:', error);
        }
      }

      dispatch({ 
        type: 'UPDATE_TRANSACTION', 
        payload: { 
          id: transactionId, 
          transaction: {
            ...updatePayload,
            categoryName: categoryName
          }
        } 
      });

      return updatePayload;
    } catch (error: any) {
      console.error("Error actualizando transacción:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error actualizando transacción' });
      throw error;
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      dispatch({ type: 'DELETE_TRANSACTION', payload: transactionId });
    } catch (error: any) {
      console.error("Error eliminando transacción:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error eliminando transacción' });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const refetch = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    totalCount: state.totalCount,
    
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
    refetch,
    clearError,
    resetState
  };
};