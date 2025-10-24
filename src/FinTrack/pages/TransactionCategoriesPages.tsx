import { useState, useMemo } from "react";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { CategoryTypeTabs } from "../components/Category/CategoryTypeTabs";
import { CategoryList } from "../components/Category/CategoryList";
import { CategoryModal } from "../components/Category/CategoryModal";
import { useCategory } from "../hooks/useCategory";
import { FaPlus } from "react-icons/fa"

export const TransactionCategoriesPages = () => {
  const [activeType, setActiveType] = useState<"expense" | "income">("expense");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
    type: 'income' | 'expense';
  } | null>(null);

  const { 
    categories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategory();

  const currentCategories = useMemo(() => {
    return categories.filter(cat => cat.type === activeType);
  }, [categories, activeType]);

  // Handler para abrir modal en modo creación
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Handler para cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Handler para abrir modal en modo edición
  const handleEditCategory = (id: string, name: string, type: 'income' | 'expense') => {
    setSelectedCategory({ id, name, type });
    setIsModalOpen(true);
  };

  // Handler para eliminar categoría
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };

  // Handler para guardar (crear o actualizar)
  const handleSave = async (name: string, type: 'income' | 'expense') => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, name, type);
      } else {
        await createCategory(name, type);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-background min-h-screen">
        <PageHeader
          title="Administrar categorías"
          buttonText="Nueva Categoría"
          onButtonClick={handleAddCategory}
          icon={<FaPlus />}
        />
        <CategoryTypeTabs
          activeType={activeType}
          onTypeChange={setActiveType}
        />
        <CategoryList
          categories={currentCategories}
          onEdit={handleEditCategory}
          onDelete={handleDelete}
        />
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          category={selectedCategory}
        />
      </div>
    </>
  );
};