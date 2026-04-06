import { useState, useMemo } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  categoryName?: string;
  date: string;
  description?: string;
  createAt?: any;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export const TransactionHistory  = ({
  transactions,
  onEdit,
  onDelete
}: TransactionHistoryProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const availableMonths = useMemo(() => {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const options = [{ value: 'all', label: 'Todos los meses' }];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      options.push({
        value: monthKey,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      });
    }

    return options;
  }, []);

  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') {
      return transactions;
    }
    return transactions.filter(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-ES').format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-700">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-secondary cursor-pointer"
        >
          {availableMonths.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#242F3A]">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-white uppercase ">
                Fecha
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-white uppercase">
                Descripción
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-white uppercase ">
                Categoría
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-white uppercase ">
                Cantidad
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-white uppercase ">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-[#242F3A]">
                <td className="py-4 px-6 text-sm text-gray-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="py-4 px-6 text-sm text-white">
                  {transaction.description}
                </td>
                <td className="py-4 px-6">
                  <span className="py-4 px-6 text-sm text-white">
                    {transaction.categoryName}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-right">
                  <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatNumber(Math.abs(transaction.amount))}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {selectedMonth === 'all' ? (
            <>
              <p>No hay transacciones registradas</p>
              <p className="text-sm">Haz clic en "Nueva Transacción" para comenzar</p>
            </>
          ) : (
            <p>No hay transacciones para este mes</p>
          )}
        </div>
      )}
    </div>
  );
};