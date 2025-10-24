import { Navbar } from "../components/Navbar";
import { StatCard } from "../components/dashboard/StatCard";
import { CategoryBarChart } from "../components/dashboard/CategoryBarChart";
import { BalanceAreaChart } from "../components/dashboard/BalanceAreaChart";
import { useDashboard } from "../hooks/useDashboard";

export const HomePages = () => {
  const {
    stats,
    expensesByCategory,
    incomeByCategory,
    balanceHistory,
    loading
  } = useDashboard();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8 bg-background min-h-screen flex items-center justify-center">
          <p className="text-white text-xl">Cargando datos...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-8 bg-background min-h-screen">
        <h1 className="text-4xl font-bold text-white mb-8">Resumen Financiero</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Dinero total" 
            amount={stats.totalBalance} 
            type="default" 
          />
          <StatCard 
            label="Ingresos (Últimos 30 días)" 
            amount={stats.last30DaysIncome} 
            type="income" 
          />
          <StatCard 
            label="Gastos (Últimos 30 días)" 
            amount={stats.last30DaysExpense} 
            type="expense" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBarChart 
            expenseData={expensesByCategory} 
            incomeData={incomeByCategory} 
          />
          <BalanceAreaChart data={balanceHistory} />
        </div>
      </div>
    </>
  );
};