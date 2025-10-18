import { FaPlus } from "react-icons/fa";

export const CategoryHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white">Administrar categorías</h1>
      <button className="bg-secondary hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center gap-2">
        <FaPlus />
        <span className="text-xl">Nueva Categoría</span>
      </button>
    </div>
  )
}
