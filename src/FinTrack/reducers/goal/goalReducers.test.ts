import { describe, expect, it } from 'vitest';
import { goalsReducer, initialGoalsState } from './goalReducers';
import type { Goal } from './goalReducersInterface';

const goal: Goal = {
  id: 'g1',
  userId: 'u1',
  title: 'Travel',
  targetAmount: 1000,
  currentAmount: 200,
  targetDate: '2026-12-31',
  createdBy: { id: 'u1', email: 'user@example.com' },
  createdAt: '2026-04-21',
  updatedAt: '2026-04-21',
};

describe('goalsReducer', () => {
  it('gestiona metas y abonos', () => {
    const setState = goalsReducer(initialGoalsState, { type: 'SET_GOALS', payload: [goal] });
    expect(setState.goals).toHaveLength(1);

    const added = goalsReducer(initialGoalsState, { type: 'ADD_GOAL', payload: goal });
    expect(added.goals[0].id).toBe('g1');

    const updated = goalsReducer(added, { type: 'UPDATE_GOAL_AMOUNT', payload: { goalId: 'g1', amount: 500 } });
    expect(updated.goals[0].currentAmount).toBe(500);

    const replaced = goalsReducer(added, { type: 'UPDATE_GOAL', payload: { ...goal, title: 'Updated' } });
    expect(replaced.goals[0].title).toBe('Updated');

    const deleted = goalsReducer(added, { type: 'DELETE_GOAL', payload: 'g1' });
    expect(deleted.goals).toHaveLength(0);

    expect(goalsReducer(added, { type: 'RESET' })).toEqual(initialGoalsState);
  });
});