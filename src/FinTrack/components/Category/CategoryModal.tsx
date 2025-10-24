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
    <div className="fixed inset-0 bg-blend-hue bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 border">
      <div className="bg-background border border-secondary rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2 font-semibold">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#242F3A] text-white border border-gray-600 focus:outline-none focus:border-secondary"
              placeholder="Ej: Alimentación, Salario..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2 font-semibold">
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
                <span className="text-white">Gasto</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="income"
                  checked={categoryType === 'income'}
                  onChange={(e) => setCategoryType(e.target.value as 'income')}
                  className="mr-2"
                />
                <span className="text-white">Ingreso</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#242F3A] text-white hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-secondary text-white hover:bg-sky-600 transition-colors"
            >
              {category ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};