import { describe, expect, it } from 'vitest';
import { initialTransactionState, transactionReducer } from './transactionReducers';
import type { Transaction } from './transactionReducersInterface';

const transaction: Transaction = {
  id: 't1',
  type: 'income',
  amount: 100,
  categoryId: 'c1',
  date: '2026-04-21',
  description: 'Salary',
  userId: 'u1',
  createAt: '2026-04-21',
};

describe('transactionReducer', () => {
  it('actualiza listas, agrega, edita y elimina transacciones', () => {
    const state = transactionReducer(initialTransactionState, { type: 'SET_TRANSACTIONS', payload: [transaction] });
    expect(state.totalCount).toBe(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    const added = transactionReducer(state, { type: 'ADD_TRANSACTION', payload: { ...transaction, id: 't2' } });
    expect(added.transactions[0].id).toBe('t2');
    expect(added.totalCount).toBe(2);

    const updated = transactionReducer(added, {
      type: 'UPDATE_TRANSACTION',
      payload: { id: 't2', transaction: { amount: 250 } },
    });
    expect(updated.transactions[0].amount).toBe(250);

    const deleted = transactionReducer(updated, { type: 'DELETE_TRANSACTION', payload: 't1' });
    expect(deleted.transactions).toHaveLength(1);
    expect(deleted.totalCount).toBe(1);
  });

  it('maneja loading, error y reset', () => {
    expect(transactionReducer(initialTransactionState, { type: 'SET_LOADING', payload: true }).loading).toBe(true);

    const errorState = transactionReducer(initialTransactionState, { type: 'SET_ERROR', payload: 'boom' });
    expect(errorState.loading).toBe(false);
    expect(errorState.error).toBe('boom');

    expect(transactionReducer({ ...errorState, loading: true }, { type: 'RESET_STATE' })).toEqual(initialTransactionState);
  });
});