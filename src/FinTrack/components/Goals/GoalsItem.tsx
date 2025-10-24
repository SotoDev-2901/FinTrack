import { CiCirclePlus } from "react-icons/ci";
import { MdGroup } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";

interface GoalsItemProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  onAddGoal: () => void;
  onViewHistory: () => void;
  onViewCollaborators: () => void;
}

export const GoalsItem = ({
  title,
  targetAmount,
  currentAmount,
  targetDate,
  onAddGoal,
  onViewHistory,
  onViewCollaborators
}: GoalsItemProps) => {
  // Calcular porcentaje (limitado a 100%)
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const isCompleted = currentAmount >= targetAmount;
  
  const formattedTarget = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'COP'
  }).format(targetAmount);
  
  const formattedCurrent = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'COP'
  }).format(currentAmount);

  return (
    <div className="bg-background rounded-3xl p-8 border border-secondary mb-6 shadow-lg">
      <h1 className="text-4xl font-sans text-white mb-2">{title}</h1>
      <p className="text-gray-400 text-lg mb-8">
        Meta: {formattedTarget} para el {targetDate}
      </p>

      <div className="mb-2">
        <div className="flex justify-between items-baseline mb-4">
          <span className={`text-2xl font-semibold ${isCompleted ? 'text-green-400' : 'text-secondary'}`}>
            {formattedCurrent}
          </span>
          <span className={`text-2xl font-semibold ${isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="relative h-5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-secondary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {isCompleted && (
          <p className="text-green-400 text-lg font-semibold mt-3 text-center">
            ¡Meta completada! 🎉
          </p>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <div className="flex gap-4">
          <button
            onClick={onViewHistory}
            className="flex items-center gap-2 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-xl transition-colors"
          >
            <FaClipboardList className="text-2xl" />
            Ver historial
          </button>

          <button
            onClick={onViewCollaborators}
            className="flex items-center gap-2 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-xl transition-colors"
          >
            <MdGroup className="text-2xl" />
            Colaboradores
          </button>
        </div>

        <button
          onClick={onAddGoal}
          className="flex items-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-xl transition-colors"
        >
          <CiCirclePlus className="text-2xl" strokeWidth={1} />
          Añadir Ahorro
        </button>
      </div>
    </div>
  );
};