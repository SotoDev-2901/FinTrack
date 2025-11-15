import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryData {
  name: string;
  amount: number;
}

interface CategoryBarChartProps {
  expenseData: CategoryData[];
  incomeData: CategoryData[];
}

export const CategoryBarChart = ({ expenseData, incomeData }: CategoryBarChartProps) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value}`;
    }
  };

  const formatXAxisTick = (tickItem: string) => {
    if (tickItem.length > 10) {
      return tickItem.substring(0, 8) + '...';
    }
    return tickItem;
  };

  const currentData = activeTab === 'expenses' ? expenseData : incomeData;

  return (
    <div className="bg-[#1A2C3D] rounded-2xl p-4 sm:p-6 border border-secondary/30">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
          Gasto/Ingreso por Categoría
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'expenses'
                ? 'bg-secondary text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'income'
                ? 'bg-secondary text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            Ingresos
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            fontSize={10}
            className="sm:text-xs"
            tickFormatter={formatXAxisTick}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tickFormatter={formatYAxisTick}
            fontSize={10}
            className="sm:text-xs"
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px'
            }}
            formatter={(value: number) => [formatCurrency(value), activeTab === 'expenses' ? 'Gasto' : 'Ingreso']}
            labelStyle={{ color: '#06B6D4' }}
          />
          <Bar dataKey="amount" fill="#06B6D4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};