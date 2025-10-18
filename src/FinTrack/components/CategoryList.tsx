import { CategoryItem } from './CategoryItem';

interface Category {
  id: string;
  icon: string;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          icon={category.icon}
          name={category.name}
          onEdit={() => onEdit(category.id)}
          onDelete={() => onDelete(category.id)}
        />
      ))}
    </div>
  );
};