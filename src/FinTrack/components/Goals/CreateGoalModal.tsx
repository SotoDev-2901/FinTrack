import { useState } from "react";
import { Modal } from "./Modal";
import { FaPlus } from "react-icons/fa"; 

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: {
    title: string;
    targetAmount: number;
    targetDate: string;
  }) => void;
}

export const CreateGoalModal = ({ isOpen, onClose, onCreateGoal }: CreateGoalModalProps) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(targetAmount);
    if (numAmount > 0 && title.trim() && targetDate) {
      onCreateGoal({
        title: title.trim(),
        targetAmount: numAmount,
        targetDate,
      });
      
      setTitle("");
      setTargetAmount("");
      setTargetDate("");
      onClose();
    }
  };

  const footerButtons = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
      >
        Cancelar
      </button>
      <button 
        type="submit"
        form="create-goal-form"
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
      >
        <FaPlus />
        Crear Objetivo
      </button>
    </>
  )

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title="Crear nuevo objetivo de ahorro"
      maxWidth="max-w-3xl"
      showFooter={true}
      footerButtons={footerButtons}
    >
      <form onSubmit={handleSubmit} id="create-goal-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nombre del Objetivo */}
          <div>
            <label htmlFor="title" className="block text-white font-semibold mb-2">
              Nombre del Objetivo
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Vacaciones en la playa"
              className="w-full px-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none"
              required
            />
          </div>

          {/* Cantidad Meta */}
          <div>
            <label htmlFor="targetAmount" className="block text-white font-semibold mb-2">
              Cantidad Meta
            </label>
            <input
              type="number"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="$1,500.00"
              className="w-full px-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        {/* Fecha Límite */}
        <div className="mb-6">
          <label htmlFor="targetDate" className="block text-white font-semibold mb-2">
            Fecha Límite
          </label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </form>
    </Modal>
  )
}
