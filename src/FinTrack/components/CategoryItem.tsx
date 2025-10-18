import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface CategoryItemProps {
  icon: string;
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryItem = ({ icon, name, onEdit, onDelete }: CategoryItemProps) => {
  return (
    <div className="bg-[#242F3A] rounded-xl p-4 flex items-center justify-between hover:bg-slate-700 transition-all mb-3">
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-white font-medium">{name}</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-secondary transition-colors"
        >
          <MdOutlineEdit />
        </button>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <RiDeleteBin6Line /> 
        </button>
      </div>
    </div>
  );
};