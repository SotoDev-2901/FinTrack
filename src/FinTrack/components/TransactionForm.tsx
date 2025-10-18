import { useState } from "react";
import { Link } from "react-router-dom";

interface TransactionFormData {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export const TransactionForm = () => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

    const handleSubmit = async (e: any) => {
    e.preventDefault();
    
      console.log('Submitting transaction:', formData);

    setFormData({
      type: 'expense',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Nueva Transacción
        </h1>
        <p className="text-slate-400">
          Registra un ingreso o gasto de forma rápida
        </p>
      </div>

      <div className="w-full max-w-xl bg-background shadow-2xl rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Transacción */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
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
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`py-4 rounded-xl font-semibold transition-all duration-200 ${
                formData.type === 'income'
                  ? 'bg-secondary text-white shadow-lg shadow-cyan-500/50 scale-105'
                  : 'bg-[#242F3A] text-slate-300 hover:bg-slate-700'
              }`}
            >
              Ingreso
            </button>
          </div>

          {/* Monto */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">
              $
            </span>
            <input
              type="number"
              name="amount"
              value={formData.amount || ''}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              required
              className="w-full pl-10 pr-4 py-4 bg-[#242F3A] border border-gray-400 text-gray-400 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
          </div>

          {/* Categoría */}
          <div className="grid grid-cols-5 gap-3">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="col-span-3 bg-[#242F3A] text-slate-300 px-4 py-4 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
            >
              <option value="">Selecciona una categoría</option>
              <option value="alimentacion">🍔 Alimentación</option>
              <option value="transporte">🚗 Transporte</option>
              <option value="entretenimiento">🎮 Entretenimiento</option>
              <option value="salud">🏥 Salud</option>
              <option value="educacion">📚 Educación</option>
              <option value="servicios">💡 Servicios</option>
              <option value="compras">🛍️ Compras</option>
              <option value="otros">📦 Otros</option>
            </select>
            <Link
              to="/transactions/categories"
              className="col-span-2 bg-[#242F3A] text-slate-300 rounded-xl hover:bg-slate-700 transition-all text-sm font-medium flex items-center justify-center"
            >
              Administrar Categorias
            </Link>
          </div>

          {/* Fecha */}
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

          {/* Descripción */}
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

          {/* Botón de Guardar */}
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-sky-600 text-white font-semibold py-4 rounded-xl shadow transition-all"
          >
            Guardar Transacción
          </button>
        </form>
      </div>
    </div>
  );
};
