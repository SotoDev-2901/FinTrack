import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BalanceData {
  month: string;
  balance: number;
}

interface BalanceAreaChartProps {
  data: BalanceData[];
}

export const BalanceAreaChart = ({ data }: BalanceAreaChartProps) => {
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

  return (
    <div className="bg-[#1A2C3D] rounded-2xl p-6 border border-secondary/30">
      <h2 className="text-2xl font-semibold text-white mb-2">Evolución del Saldo</h2>
      <p className="text-gray-400 text-sm mb-6">Últimos 6 meses</p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tickFormatter={formatYAxisTick}
            fontSize={12}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [formatCurrency(value), 'Saldo']}
            labelStyle={{ color: '#06B6D4' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#06B6D4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};