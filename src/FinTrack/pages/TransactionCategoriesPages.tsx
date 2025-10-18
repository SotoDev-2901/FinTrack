import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CategoryHeader } from "../components/CategoryHeader";
import { CategoryTypeTabs } from "../components/CategoryTypeTabs";
import { CategoryList } from "../components/CategoryList";

export const TransactionCategoriesPages = () => {
  const [activeType, setActiveType] = useState<"expense" | "income">("expense");

  const expenseCategories = [
    { id: "1", icon: "🍴", name: "Comida" },
    { id: "2", icon: "🚗", name: "Transporte" },
    { id: "3", icon: "🏠", name: "Vivienda" },
    { id: "4", icon: "🎉", name: "Entretenimiento" },
    { id: "5", icon: "🛡️", name: "Salud" },
    { id: "6", icon: "🛍️", name: "Compras" },
  ];

  const incomeCategories = [
    { id: "7", icon: "💼", name: "Salario" },
    { id: "8", icon: "💻", name: "Freelance" },
    { id: "9", icon: "📈", name: "Inversiones" },
  ];

  const currentCategories =
    activeType === "expense" ? expenseCategories : incomeCategories;

  const handleEdit = (id: string) => {
    console.log("Edit category:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete category:", id);
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-background min-h-screen">
        <CategoryHeader />
        <CategoryTypeTabs
          activeType={activeType}
          onTypeChange={setActiveType}
        />
        <CategoryList
          categories={currentCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};
