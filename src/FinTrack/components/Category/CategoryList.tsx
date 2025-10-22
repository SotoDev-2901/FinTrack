import { CategoryItem } from './CategoryItem';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (id: string, name: string, type: 'income' | 'expense') => void;
  onDelete: (id: string) => void;
}

export const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          id={category.id}
          name={category.name}
          type={category.type}
          onEdit={onEdit}
          onDelete={() => onDelete(category.id)}
        />
      ))}
    </div>
  );
};