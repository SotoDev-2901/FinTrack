import { useState } from "react"
import { Navbar } from "../components/Navbar"
import { TransactionForm } from "../components/TransactionForm"
import { useAuth } from "../../authentication/hooks/useAuth"
import { useCategory } from "../hooks/useCategory"
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

interface TransactionsFormData {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export const TransactionsPages = () => {
  const { authState } = useAuth();
  const { categories } = useCategory();

  const [formData, setFormData] = useState<TransactionsFormData>({
    type: 'expense',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      alert("El monto debe ser mayor a cero");
      return;
    }

    try {
      const transactionsData = {
        type: formData.type,
        amount: formData.amount,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        userId: authState.user?.uid,
        createAt: Timestamp.now()
      };

      await addDoc(collection(db, "transactions"), transactionsData);

      setFormData({
        type: 'expense',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });

      alert('✅ Transacción guardada exitosamente');
    } catch (error: any) {
      alert('❌ Error al guardar la transacción: ' + error.message);
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  }

  const handleTypeChange = (type: 'expense' | 'income') => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: '',
    }));
  }

  return (
    <>
      <Navbar />
      <TransactionForm
        formData={formData}
        categories={categories}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onTypeChange={handleTypeChange}
      />
    </>
  )
}
