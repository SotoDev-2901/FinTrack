interface StatCardProps {
  label: string;
  amount: number;
  type?: 'income' | 'expense' | 'default';
}

export const StatCard = ({ label, amount, type = 'default' }: StatCardProps) => {
  const getTextColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-400';
      case 'expense':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-[#1A2C3D] rounded-2xl p-4 sm:p-6 border border-secondary/30">
      <p className="text-gray-400 text-xs sm:text-sm mb-2">{label}</p>
      <p className={`${getTextColor()} text-2xl sm:text-3xl lg:text-4xl font-bold`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
};