interface CategoryTypeTabsProps {
  activeType: 'expense' | 'income';
  onTypeChange: (type: 'expense' | 'income') => void;
}

export const CategoryTypeTabs = ({ activeType, onTypeChange }: CategoryTypeTabsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button
        onClick={() => onTypeChange('expense')}
        className={`py-3 rounded-xl font-semibold transition-all ${
          activeType === 'expense'
            ? 'bg-secondary text-white shadow-lg'
            : 'bg-[#242F3A] text-slate-400 hover:bg-slate-700'
        }`}
      >
        Gastos
      </button>
      <button
        onClick={() => onTypeChange('income')}
        className={`py-3 rounded-xl font-semibold transition-all ${
          activeType === 'income'
            ? 'bg-secondary text-white shadow-lg'
            : 'bg-[#242F3A] text-slate-400 hover:bg-slate-700'
        }`}
      >
        Ingresos
      </button>
    </div>
  );
};