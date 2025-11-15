import { Navbar } from "../components/Navbar"
import { PageHeader } from "../components/PageHeader"
import { TransactionHistory } from "../components/transaction/TransactionHistory"
import { CreateTransactionModal } from "../components/transaction/CreateTransactionModal"
import { FaPlus } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useCategory } from "../hooks/useCategory"
import { useTransaction } from "../hooks/useTransaction"

type EditingTransactionType = {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
} | null;

export const TransactionsPages = () => {
  const { categories } = useCategory();
  const { 
    transactions, 
    loading, 
    error,
    createTransaction, 
    updateTransaction, 
    deleteTransaction,
    clearError
  } = useTransaction();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<EditingTransactionType>(null);

  useEffect(() => {
    if (error) {
      console.error('Error en transacciones:', error);
    }
  }, [error]);

  const handleCreateTransaction = async (
    newTransactionData: {
      type: 'expense' | 'income';
      amount: number;
      date: string;
      description?: string;
    },
    categoryId: string 
  ) => {
    try {
      clearError();
      
      await createTransaction(newTransactionData, categoryId); 
    } catch (error: any) {
      alert('❌ Error al guardar la transacción: ' + error.message);
    }
  };


  const handleUpdateTransaction = async (
    transactionId: string, 
    updatedData: {
      type: 'expense' | 'income';
      amount: number;
      date: string;
      description?: string;
    },
    categoryId: string 
  ) => {
    try {
      clearError(); 
      
      await updateTransaction(transactionId, updatedData, categoryId); 
      setEditingTransaction(null);
    } catch (error: any) {
      alert('❌ Error al actualizar la transacción: ' + error.message);
    }
  };

  const handleEditTransaction = (transaction: any) => {
  

  const editData: EditingTransactionType = {
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount) || 0,
    categoryId: transaction.categoryId || '', 
    date: transaction.date,
    description: transaction.description || ''
  };
  
  setEditingTransaction(editData);
  setIsCreateModalOpen(true);
};

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      return;
    }

    try {
      clearError();
      await deleteTransaction(transactionId);
    } catch (error: any) {
      alert('❌ Error al eliminar la transacción: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingTransaction(null);
  };


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8 bg-background min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Cargando transacciones...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-8 bg-background min-h-screen">
        <PageHeader 
          title="Historial de Transacciones"
          description="Consulta y gestiona todos tus ingresos y gastos"
          buttonText="Nueva Transacción"
          onButtonClick={() => setIsCreateModalOpen(true)}
          icon={<FaPlus />}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            Error: {error}
            <button 
              onClick={clearError}
              className="ml-2 underline hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="mt-8">
          <TransactionHistory
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>

      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onCreateTransaction={handleCreateTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
      />
    </>
  )
}