import { describe, expect, it } from 'vitest';
import { categoryReducer, initialState } from './categoryReducers';
import type { Category } from './categoryReducersInterface';

const category: Category = {
  id: 'c1',
  name: 'Food',
  type: 'expense',
  userId: 'u1',
  createdAt: new Date('2026-04-21'),
  updatedAt: new Date('2026-04-21'),
};

describe('categoryReducer', () => {
  it('gestiona CRUD de categorías', () => {
    expect(categoryReducer(initialState, { type: 'SET_CATEGORIES', payload: [category] }).categories).toHaveLength(1);

    const added = categoryReducer(initialState, { type: 'ADD_CATEGORY', payload: category });
    expect(added.categories).toContainEqual(category);

    const updated = categoryReducer(added, {
      type: 'UPDATE_CATEGORY',
      payload: { id: 'c1', data: { name: 'Comida' } },
    });
    expect(updated.categories[0].name).toBe('Comida');

    const deleted = categoryReducer(updated, { type: 'DELETE_CATEGORY', payload: 'c1' });
    expect(deleted.categories).toHaveLength(0);
    expect(categoryReducer(updated, { type: 'RESET' })).toEqual(initialState);
  });
});