import { useReducer, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../authentication/hooks/useAuth';
import type { Goal, GoalContribution, GoalCollaborator } from '../reducers/goal/goalReducersInterface';
import { goalsReducer, initialGoalsState } from '../reducers/goal/goalReducers';

export const useGoal = () => {
  const { authState } = useAuth();
  const [state, dispatch] = useReducer(goalsReducer, initialGoalsState);

  const fetchGoals = useCallback(async () => {
    if (!authState.user?.uid || !authState.user?.email) return;

    const goalsRef = collection(db, 'goals');
    const ownGoalsQuery = query(
      goalsRef, 
      where('userId', '==', authState.user.uid)
    );
    
    const ownGoalsSnapshot = await getDocs(ownGoalsQuery);
    const ownGoals = ownGoalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Goal[];

    const collaboratorsRef = collection(db, 'goalCollaborators');
    const collaboratorQuery = query(
      collaboratorsRef,
      where('email', '==', authState.user.email)
    );
    
    const collaboratorSnapshot = await getDocs(collaboratorQuery);
    const sharedGoalIds = collaboratorSnapshot.docs.map(doc => doc.data().goalId);

    let sharedGoals: Goal[] = [];
    if (sharedGoalIds.length > 0) {
      const sharedGoalsPromises = sharedGoalIds.map(async goalId => {
        const goalDoc = await getDocs(query(goalsRef, where('__name__', '==', goalId)));
        return goalDoc.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Goal[];
      });
      
      const sharedGoalsArrays = await Promise.all(sharedGoalsPromises);
      sharedGoals = sharedGoalsArrays.flat();
    }

    const allGoalsMap = new Map<string, Goal>();
    [...ownGoals, ...sharedGoals].forEach(goal => {
      allGoalsMap.set(goal.id, goal);
    });
    
    let allGoals = Array.from(allGoalsMap.values());
    
    allGoals = allGoals.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    dispatch({ type: 'SET_GOALS', payload: allGoals });
  }, [authState.user?.uid, authState.user?.email]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = async (goalData: {
    title: string;
    targetAmount: number;
    targetDate: string;
    description?: string;
  }) => {
    if (!authState.user?.uid) return;

    const now = Timestamp.now().toDate().toISOString();
    const newGoal = {
      userId: authState.user.uid,
      title: goalData.title,
      description: goalData.description || '',
      targetAmount: goalData.targetAmount,
      currentAmount: 0,
      targetDate: goalData.targetDate,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await addDoc(collection(db, 'goals'), newGoal);
    
    const createdGoal: Goal = {
      id: docRef.id,
      ...newGoal
    };

    dispatch({ type: 'ADD_GOAL', payload: createdGoal });
    return createdGoal;
  };

  const addContribution = async (
    goalId: string,
    amount: number,
    note: string,
    date: string
  ) => {
    if (!authState.user?.uid) return;

    const contribution = {
      goalId,
      userId: authState.user.uid,
      userEmail: authState.user.email || 'Sin email',
      amount,
      note: note || '',
      date,
      createdAt: Timestamp.now().toDate().toISOString()
    };

    await addDoc(collection(db, 'goalContributions'), contribution);

    const goal = state.goals.find(g => g.id === goalId);
    if (goal) {
      const goalRef = doc(db, 'goals', goalId);
      const newAmount = goal.currentAmount + amount;
      
      await updateDoc(goalRef, {
        currentAmount: newAmount,
        updatedAt: Timestamp.now().toDate().toISOString()
      });

      dispatch({ 
        type: 'UPDATE_GOAL_AMOUNT', 
        payload: { goalId, amount: newAmount } 
      });
      
      await fetchGoals();
    }
  };

  const getContributions = async (goalId: string): Promise<GoalContribution[]> => {
    const contributionsRef = collection(db, 'goalContributions');
    const q = query(
      contributionsRef,
      where('goalId', '==', goalId)
    );

    const snapshot = await getDocs(q);
    
    let contributions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GoalContribution[];
    
    contributions = contributions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return contributions;
  };

  const addCollaborator = async (goalId: string, email: string) => {
    if (!authState.user?.uid) return;

    if (email === authState.user.email) return;

    const existingCollaborators = await getCollaborators(goalId);
    if (existingCollaborators.some(c => c.email === email)) return;

    const collaborator = {
      goalId,
      userId: '',
      email,
      name: email.split('@')[0],
      addedAt: Timestamp.now().toDate().toISOString(),
      totalContribution: 0
    };

    await addDoc(collection(db, 'goalCollaborators'), collaborator);
    await fetchGoals();
  };

  const getCollaborators = async (goalId: string): Promise<GoalCollaborator[]> => {
    const collaboratorsRef = collection(db, 'goalCollaborators');
    const q = query(
      collaboratorsRef,
      where('goalId', '==', goalId)
    );

    const snapshot = await getDocs(q);
    const collaborators = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GoalCollaborator[];

    const contributionsRef = collection(db, 'goalContributions');
    const contributionsQuery = query(
      contributionsRef,
      where('goalId', '==', goalId)
    );
    
    const contributionsSnapshot = await getDocs(contributionsQuery);
    const contributions = contributionsSnapshot.docs.map(doc => doc.data());

    const contributionsByEmail = contributions.reduce((acc, contribution) => {
      const email = contribution.userEmail;
      if (!acc[email]) {
        acc[email] = 0;
      }
      acc[email] += contribution.amount;
      return acc;
    }, {} as Record<string, number>);

    return collaborators.map(collaborator => ({
      ...collaborator,
      totalContribution: contributionsByEmail[collaborator.email] || 0
    }));
  };

  const removeCollaborator = async (collaboratorId: string) => {
    await deleteDoc(doc(db, 'goalCollaborators', collaboratorId));
  };

  const deleteGoal = async (goalId: string) => {
    await deleteDoc(doc(db, 'goals', goalId));
    dispatch({ type: 'DELETE_GOAL', payload: goalId });
  };

  return {
    goals: state.goals,
    createGoal,
    addContribution,
    getContributions,
    addCollaborator,
    getCollaborators,
    removeCollaborator,
    deleteGoal,
    refetch: fetchGoals
  };
};