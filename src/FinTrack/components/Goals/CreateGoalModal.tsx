import { useState } from "react";
import { Modal } from "../Modal";
import { FaPlus } from "react-icons/fa"; 
import { CurrencyInput } from "../CurrencyInput";

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
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetDate, setTargetDate] = useState("");

  const handleAmountChange = (value: number) => {
    setTargetAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (targetAmount > 0 && title.trim() && targetDate) {
      onCreateGoal({
        title: title.trim(),
        targetAmount: targetAmount,
        targetDate,
      });
      
      setTitle("");
      setTargetAmount(0);
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

          <div>
            <label htmlFor="targetAmount" className="block text-white font-semibold mb-2">
              Cantidad Meta
            </label>
            <CurrencyInput
              id="targetAmount"
              name="targetAmount"
              value={targetAmount}
              onChange={handleAmountChange} 
              placeholder="0"
              className="w-full px-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none pl-8"
              required
            />
          </div>
        </div>

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