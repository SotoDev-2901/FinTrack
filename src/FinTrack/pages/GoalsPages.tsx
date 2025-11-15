import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { GoalsItem } from "../components/Goals/GoalsItem";
import { FaPlus } from "react-icons/fa";
import { CreateGoalModal } from "../components/Goals/CreateGoalModal";
import { AddSavingModal } from "../components/Goals/AddSavingModal";
import { CollaboratorsModal } from "../components/Goals/CollaboratorsModal";
import { HistoryModal } from "../components/Goals/HistoryModal";
import { useGoal } from "../hooks/useGoal";
import { useAuth } from "../../authentication/hooks/useAuth";
import type { Goal, GoalContribution, GoalCollaborator } from "../reducers/goal/goalReducersInterface";

export const GoalsPages = () => {
  const { authState } = useAuth();
  const { 
    goals, 
    createGoal, 
    addContribution, 
    getContributions,
    addCollaborator,
    getCollaborators,
    removeCollaborator,
    refetch
  } = useGoal();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false);
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [collaborators, setCollaborators] = useState<GoalCollaborator[]>([]);

  // Abrir modal de añadir ahorro
  const handleOpenAddSaving = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddSavingModalOpen(true);
  };

  // Abrir modal de colaboradores
  const handleOpenCollaborators = async (goal: Goal) => {
    setSelectedGoal(goal);
    const collabs = await getCollaborators(goal.id);
    setCollaborators(collabs);
    setIsCollaboratorsModalOpen(true);
  };

  // Abrir modal de historial
  const handleOpenHistory = async (goal: Goal) => {
    setSelectedGoal(goal);
    const history = await getContributions(goal.id);
    setContributions(history);
    setIsHistoryModalOpen(true);
  };

  // Crear nuevo objetivo
  const handleCreateGoal = async (goalData: {
    title: string;
    targetAmount: number;
    targetDate: string;
    description?: string;
  }) => {
    await createGoal(goalData);
  };

  // Añadir ahorro
  const handleAddSaving = async (amount: number, note: string, date: string) => {
    if (!selectedGoal) return;
    await addContribution(selectedGoal.id, amount, note, date);
    
    // Recargar el historial
    const updatedHistory = await getContributions(selectedGoal.id);
    setContributions(updatedHistory);
    await refetch();
  };

  // Añadir colaborador
  const handleAddCollaborator = async (email: string) => {
    if (!selectedGoal) return;
    await addCollaborator(selectedGoal.id, email);
    const updatedCollabs = await getCollaborators(selectedGoal.id);
    setCollaborators(updatedCollabs);
  };


  const handleRemoveCollaborator = async (collaboratorId: string) => {
    await removeCollaborator(collaboratorId);
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
        <PageHeader
          title="Tus Objetivos de ahorro"
          description="Establece metas financieras y realiza un seguimiento de tu progreso de forma divertida."
          buttonText="Crear nuevo objetivo"
          onButtonClick={() => setIsCreateModalOpen(true)}
          icon={<FaPlus />}
        />
        
        {goals.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg mb-4">
              No tienes objetivos de ahorro todavía
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-secondary hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
            >
              Crear tu primer objetivo
            </button>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalsItem
              key={goal.id}
              title={goal.title}
              targetAmount={goal.targetAmount}
              currentAmount={goal.currentAmount}
              targetDate={goal.targetDate}
              onAddGoal={() => handleOpenAddSaving(goal)}
              onViewHistory={() => handleOpenHistory(goal)}
              onViewCollaborators={() => handleOpenCollaborators(goal)}
            />
          ))
        )}
      </div>

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />

      {selectedGoal && (
        <>
          <AddSavingModal
            isOpen={isAddSavingModalOpen}
            onClose={() => {
              setIsAddSavingModalOpen(false);
              setSelectedGoal(null);
            }}
            goalTitle={selectedGoal.title}
            currentAmount={selectedGoal.currentAmount}
            targetAmount={selectedGoal.targetAmount}
            onAddSaving={handleAddSaving}
          />

          <CollaboratorsModal 
            isOpen={isCollaboratorsModalOpen}
            onClose={() => {
              setIsCollaboratorsModalOpen(false);
              setSelectedGoal(null);
            }}
            goalTitle={selectedGoal.title}
            collaborators={collaborators}
            isOwner={selectedGoal.userId === authState.user?.uid}
            createdBy={selectedGoal.createdBy}
            onAddCollaborator={handleAddCollaborator}
            onRemoveCollaborator={handleRemoveCollaborator}
          />

          <HistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => {
              setIsHistoryModalOpen(false);
              setSelectedGoal(null);
            }}
            goalTitle={selectedGoal.title}
            history={contributions}
          />
        </>
      )}
    </>
  );
};