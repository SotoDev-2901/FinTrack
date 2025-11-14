import { useState } from "react";
import { FaPlus } from "react-icons/fa"; 
import { Modal } from "./Modal";
import { CurrencyInput } from "../CurrencyInput";

interface AddSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
  currentAmount: number;
  targetAmount: number;
  onAddSaving: (amount: number, note: string, date: string) => void;
}

export const AddSavingModal = ({ isOpen, onClose, goalTitle, currentAmount, targetAmount, onAddSaving }: AddSavingModalProps) => {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      onAddSaving(amount, note, date);
      setAmount(0);
      setNote("");
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    }
  };

  const formattedCurrent = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(currentAmount);

  const formattedTarget = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(targetAmount);

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
        type={"submit"}
        form="add-saving-form"
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
      >
        <FaPlus />
        Añadir
      </button>
    </>
  )
  
  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={`Añadir ahorro a: ${goalTitle}`}
      maxWidth="max-w-lg"
      showFooter={true}
      footerButtons={footerButtons}
    >
      <p className="text-gray-400 mb-6">
        Llevas {formattedCurrent} de tu meta de {formattedTarget}
      </p>

      <form onSubmit={handleSubmit} id="add-saving-form">
        <div className="mb-6">
          <label htmlFor="amount" className="block text-white font-semibold mb-2">
            Cantidad
          </label>
          <CurrencyInput
            id="amount"
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full px-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none pl-8"
            required
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-white font-semibold mb-2">
            Nota (Opcional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Aporte extra de este mes"
            rows={4}
            className="w-full px-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none resize-none"
          />
        </div>
      </form>
    </Modal>
  )
}
