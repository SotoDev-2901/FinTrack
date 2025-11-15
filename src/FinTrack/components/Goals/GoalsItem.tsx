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
    <div className="bg-background rounded-3xl p-4 sm:p-6 lg:p-8 border border-secondary mb-4 sm:mb-6 shadow-lg">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans text-white mb-2">
        {title}
      </h1>
      <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
        Meta: {formattedTarget} para el {targetDate}
      </p>

      <div className="mb-2">
        <div className="flex justify-between items-baseline mb-4">
          <span className={`text-lg sm:text-xl lg:text-2xl font-semibold ${isCompleted ? 'text-green-400' : 'text-secondary'}`}>
            {formattedCurrent}
          </span>
          <span className={`text-lg sm:text-xl lg:text-2xl font-semibold ${isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="relative h-4 sm:h-5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-secondary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {isCompleted && (
          <p className="text-green-400 text-base sm:text-lg font-semibold mt-3 text-center">
            ¡Meta completada! 🎉
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onViewHistory}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl transition-colors"
          >
            <FaClipboardList className="text-lg sm:text-xl lg:text-2xl" />
            <span className="hidden sm:inline">Ver historial</span>
            <span className="sm:hidden">Historial</span>
          </button>

          <button
            onClick={onViewCollaborators}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl transition-colors"
          >
            <MdGroup className="text-lg sm:text-xl lg:text-2xl" />
            <span className="hidden sm:inline">Colaboradores</span>
            <span className="sm:hidden">Colaborar</span>
          </button>
        </div>

        <button
          onClick={onAddGoal}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl transition-colors"
        >
          <CiCirclePlus className="text-lg sm:text-xl lg:text-2xl" strokeWidth={1} />
          <span className="hidden sm:inline">Añadir Ahorro</span>
          <span className="sm:hidden">Añadir</span>
        </button>
      </div>
    </div>
  );
};