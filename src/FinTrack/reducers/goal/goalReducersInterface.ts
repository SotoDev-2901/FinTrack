export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdBy: {
    id: string;
    email: string;
  }
  createdAt: string;
  updatedAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  userId: string;
  userEmail: string;
  amount: number;
  note?: string;
  date: string;
  createdAt: string;
}

export interface GoalCollaborator {
  id: string;
  goalId: string;
  userId: string;
  email: string;
  name: string;
  addedAt: string;
  totalContribution: number;
}

export interface GoalState {
  goals: Goal[];
}

export type GoalsAction =
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'UPDATE_GOAL_AMOUNT'; payload: { goalId: string; amount: number } }
  | { type: 'RESET' };