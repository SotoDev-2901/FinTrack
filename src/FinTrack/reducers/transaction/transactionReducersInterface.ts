export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string; // Solo el ID de la categoría
  categoryName?: string; // Opcional, solo para cuando se resuelve el nombre
  date: string;
  description: string;
  userId: string;
  createAt: any; // Firebase Timestamp
}

export interface TransactionFormData {
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  date: string;
  description?: string; // Mantener opcional en el formulario
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export type TransactionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; transaction: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };