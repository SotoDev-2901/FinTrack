import type { TransactionState, TransactionAction } from './transactionReducersInterface';

export const initialTransactionState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  totalCount: 0
};

export const transactionReducer = (
  state: TransactionState,
  action: TransactionAction
): TransactionState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        totalCount: action.payload.length,
        loading: false,
        error: null
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        totalCount: state.totalCount + 1,
        error: null
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.transaction }
            : transaction
        ),
        error: null
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        ),
        totalCount: state.totalCount - 1,
        error: null
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'RESET_STATE':
      return initialTransactionState;

    default:
      return state;
  }
};