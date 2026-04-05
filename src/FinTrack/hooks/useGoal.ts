import { useReducer, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../authentication/hooks/useAuth';
import type { Goal, GoalContribution, GoalCollaborator } from '../reducers/goal/goalReducersInterface';
import { goalsReducer, initialGoalsState } from '../reducers/goal/goalReducers';

export const useGoal = () => {
  const { authState } = useAuth();
  const [state, dispatch] = useReducer(goalsReducer, initialGoalsState);

  // Listener en tiempo real para goals
  useEffect(() => {
    if (!authState.user?.uid || !authState.user?.email) return;

    const goalsRef = collection(db, 'goals');
    const unsubscribers: (() => void)[] = [];
    const allGoalsMap = new Map<string, Goal>();

    // Función auxiliar para actualizar el estado
    const updateGoalsState = () => {
      let allGoals = Array.from(allGoalsMap.values());
      allGoals = allGoals.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      dispatch({ type: 'SET_GOALS', payload: allGoals });
    };

    // Listener para goals propias
    const ownGoalsQuery = query(
      goalsRef,
      where('userId', '==', authState.user.uid)
    );

    const unsubscribeOwnGoals = onSnapshot(ownGoalsQuery, (ownGoalsSnapshot) => {
      // Actualizar map con goals propias
      const currentOwnGoalIds = new Set<string>();

      ownGoalsSnapshot.docs.forEach(doc => {
        const goalId = doc.id;
        currentOwnGoalIds.add(goalId);
        allGoalsMap.set(goalId, {
          id: goalId,
          ...doc.data()
        } as Goal);
      });

      // Remover goals propias que ya no existen
      Array.from(allGoalsMap.keys()).forEach(id => {
        const goal = allGoalsMap.get(id);
        if (goal?.userId === authState.user.uid && !currentOwnGoalIds.has(id)) {
          allGoalsMap.delete(id);
        }
      });

      updateGoalsState();
    });

    unsubscribers.push(unsubscribeOwnGoals);

    // Listener para detectar cuando se agregan/eliminan colaboradores
    const collaboratorsRef = collection(db, 'goalCollaborators');
    const collaboratorQuery = query(
      collaboratorsRef,
      where('email', '==', authState.user.email)
    );

    let sharedGoalListeners = new Map<string, () => void>();

    const unsubscribeCollaborators = onSnapshot(collaboratorQuery, (collaboratorSnapshot) => {
      const currentSharedGoalIds = new Set(
        collaboratorSnapshot.docs.map(doc => doc.data().goalId)
      );

      // Eliminar listeners de goals que ya no son compartidas
      sharedGoalListeners.forEach((unsub, goalId) => {
        if (!currentSharedGoalIds.has(goalId)) {
          unsub();
          sharedGoalListeners.delete(goalId);
          allGoalsMap.delete(goalId);
        }
      });

      // Agregar listeners para nuevas goals compartidas
      currentSharedGoalIds.forEach(goalId => {
        if (!sharedGoalListeners.has(goalId)) {
          const goalDocRef = doc(db, 'goals', goalId);
          const unsubscribeSharedGoal = onSnapshot(goalDocRef, (goalDoc) => {
            if (goalDoc.exists()) {
              allGoalsMap.set(goalId, {
                id: goalDoc.id,
                ...goalDoc.data()
              } as Goal);
            } else {
              allGoalsMap.delete(goalId);
            }
            updateGoalsState();
          });

          sharedGoalListeners.set(goalId, unsubscribeSharedGoal);
          unsubscribers.push(unsubscribeSharedGoal);
        }
      });

      updateGoalsState();
    });

    unsubscribers.push(unsubscribeCollaborators);

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      unsubscribers.forEach(unsub => unsub());
      sharedGoalListeners.forEach(unsub => unsub());
    };
  }, [authState.user?.uid, authState.user?.email]);

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
      createdBy: {
        id: authState.user.uid,
        email: authState.user.email || ''
      },
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
    deleteGoal
  };
};