import { useState, useEffect } from "react";
import { Modal } from "../Modal"
import { CurrencyInput } from "../CurrencyInput";
import { FaPlus, FaEdit, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTransaction: (transaction: {
    type: 'expense' | 'income';
    amount: number;
    date: string;
    description?: string;
  }, categoryId: string) => void;
  onUpdateTransaction?: (transactionId: string, transaction: {
    type: 'expense' | 'income';
    amount: number;
    date: string;
    description?: string;
  }, categoryId: string) => void;
  categories: Array<{ id: string; name: string; type: 'expense' | 'income' }>;
  editingTransaction?: {
    id: string;
    type: 'expense' | 'income';
    amount: number;
    categoryId: string;
    date: string;
    description?: string;
  } | null;
}

export const CreateTransactionModal = ({ 
  isOpen, 
  onClose, 
  onCreateTransaction,
  onUpdateTransaction,
  categories,
  editingTransaction = null
}: CreateTransactionModalProps) => {
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: 0,
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const isEditMode = !!editingTransaction;

  useEffect(() => {
    
    if (editingTransaction) {
      const newFormData = {
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        categoryId: editingTransaction.categoryId,
        date: editingTransaction.date,
        description: editingTransaction.description || ''
      };

      setFormData(newFormData);
    } else {
      setFormData({
        type: 'expense',
        amount: 0,
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [editingTransaction, categories]);

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { categoryId, ...transactionData } = formData;
    
    if (isEditMode && onUpdateTransaction && editingTransaction) {
      onUpdateTransaction(editingTransaction.id, transactionData, categoryId);
    } else {
      onCreateTransaction(transactionData, categoryId);
    }
    
    onClose();
    if (!isEditMode) {
      setFormData({
        type: 'expense',
        amount: 0,
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type: 'expense' | 'income') => {
    setFormData(prev => ({
      ...prev,
      type,
      categoryId: ''
    }));
  };

  const handleAmountChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      amount: value
    }));
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
        form="create-transaction-form"
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
      >
        {isEditMode ? <FaEdit /> : <FaPlus />}
        {isEditMode ? 'Actualizar Transacción' : 'Crear Transacción'}
      </button>
    </>
  )

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar Transacción" : "Nueva Transacción"}
      maxWidth="max-w-3xl"
      showFooter={true}
      footerButtons={footerButtons}
    >
      <form 
        id="create-transaction-form"
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-4 rounded-xl font-semibold transition-all duration-200 ${
              formData.type === 'expense'
                ? 'bg-secondary text-white shadow-lg shadow-cyan-500/50 scale-105'
                : 'bg-[#242F3A] text-slate-300 hover:bg-slate-700'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-4 rounded-xl font-semibold transition-all duration-200 ${
              formData.type === 'income'
                ? 'bg-secondary text-white shadow-lg shadow-cyan-500/50 scale-105'
                : 'bg-[#242F3A] text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ingreso
          </button>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">
            $
          </span>
          <CurrencyInput
            id="amount"
            name="amount"
            value={formData.amount || 0}
            onChange={handleAmountChange}
            placeholder="0"
            required
            className="w-full pl-10 pr-4 py-4 bg-[#242F3A] border border-gray-400 text-gray-400 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
          />
        </div>

        <div className="flex gap-3">
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="flex-1 bg-[#242F3A] text-slate-300 px-4 py-4 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
          >
            <option value="">Selecciona una categoría</option>
            {filteredCategories.length === 0 ? (
              <option value="" disabled>
                No hay categorías de {formData.type === 'expense' ? 'gastos' : 'ingresos'}
              </option>
            ) : (
              filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          
          <Link
            to="/transactions/categories"
            onClick={onClose}
            className="flex items-center justify-center px-4 py-4 bg-[#242F3A] text-slate-300 rounded-xl hover:bg-slate-700 transition-all border border-gray-400 hover:border-secondary group"
            title="Administrar Categorías"
          >
            <FaCog className="text-lg group-hover:text-secondary transition-colors" />
          </Link>
        </div>

        <div>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full py-4 px-4 bg-[#242F3A] border border-gray-400 text-gray-400 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>

        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descripción (opcional)"
            rows={4}
            className="w-full bg-[#242F3A] text-gray-400 px-4 py-3 rounded-xl border border-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none transition-all placeholder-gray-400"
          ></textarea>
        </div>
      </form>
    </Modal>
  )
}