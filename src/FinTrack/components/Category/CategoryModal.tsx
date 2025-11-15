import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: 'income' | 'expense') => void;
  category?: {
    id: string;
    name: string;
    type: 'income' | 'expense';
  } | null;
}

export const CategoryModal = ({ isOpen, onClose, onSave, category }: CategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setCategoryType(category.type);
    } else {
      setCategoryName("");
      setCategoryType('expense');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSave(categoryName, categoryType);
      setCategoryName("");
      setCategoryType('expense');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-blend-hue bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 border p-2 sm:p-4">
      <div className="bg-background border border-secondary rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2 font-semibold text-sm sm:text-base">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#242F3A] text-white border border-gray-600 focus:outline-none focus:border-secondary text-sm sm:text-base"
              placeholder="Ej: Alimentación, Salario..."
              required
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-white mb-2 font-semibold text-sm sm:text-base">
              Tipo de categoría
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="expense"
                  checked={categoryType === 'expense'}
                  onChange={(e) => setCategoryType(e.target.value as 'expense')}
                  className="mr-2"
                />
                <span className="text-white text-sm sm:text-base">Gasto</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="income"
                  checked={categoryType === 'income'}
                  onChange={(e) => setCategoryType(e.target.value as 'income')}
                  className="mr-2"
                />
                <span className="text-white text-sm sm:text-base">Ingreso</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 rounded-lg bg-[#242F3A] text-white hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 rounded-lg bg-secondary text-white hover:bg-sky-600 transition-colors text-sm sm:text-base"
            >
              {category ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};