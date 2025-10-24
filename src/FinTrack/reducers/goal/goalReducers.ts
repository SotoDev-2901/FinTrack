import type { GoalState, GoalsAction } from './goalReducersInterface';

export const initialGoalsState: GoalState = {
  goals: []
};

export const goalsReducer = (state: GoalState, action: GoalsAction): GoalState => {
  switch (action.type) {
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload
      };

    case 'ADD_GOAL':
      return {
        ...state,
        goals: [action.payload, ...state.goals]
      };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id 
            ? action.payload
            : goal
        )
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };

    case 'UPDATE_GOAL_AMOUNT':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.goalId
            ? { ...goal, currentAmount: action.payload.amount }
            : goal
        )
      };

    case 'RESET':
      return initialGoalsState;

    default:
      return state;
  }
};