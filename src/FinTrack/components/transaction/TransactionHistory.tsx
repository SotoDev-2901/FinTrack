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
  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-ES').format(amount);
  };

  const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES');
};

  return (
    <div className="bg-background rounded-lg shadow-sm">
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
            {transactions.map((transaction) => (
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
      
      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay transacciones registradas</p>
          <p className="text-sm">Haz clic en "Nueva Transacción" para comenzar</p>
        </div>
      )}
    </div>
  );
};