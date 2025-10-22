import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface CategoryItemProps {
  id: string;
  name: string;
  type: 'income' | 'expense';
  onEdit: (id: string, name: string, type: 'income' | 'expense') => void;
  onDelete: () => void;
}

export const CategoryItem = ({ id, name, type, onEdit, onDelete }: CategoryItemProps) => {
  return (
    <div className="bg-[#242F3A] rounded-xl p-4 flex items-center justify-between hover:bg-slate-700 transition-all mb-3">
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">{name}</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(id, name, type)}
          className="text-slate-400 hover:text-secondary transition-colors text-xl"
        >
          <MdOutlineEdit />
        </button>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors text-xl"
        >
          <RiDeleteBin6Line /> 
        </button>
      </div>
    </div>
  );
};