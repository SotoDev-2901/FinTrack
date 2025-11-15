import type { GoalContribution } from '../../reducers/goal/goalReducersInterface';
import { Modal } from '../Modal'
import { CiCirclePlus } from "react-icons/ci"


interface HistoryModalProps {
  isOpen: boolean;
  onClose : () => void;
  goalTitle: string;
  history: GoalContribution[];
}

export const HistoryModal = ({ isOpen, onClose, goalTitle, history }: HistoryModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const footerButtons = (
    <>
      <button 
        onClick={onClose}
        className="px-6 py-3 bg-secondary hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
      >
        Cerrar
      </button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Historial de contribuciones: ${goalTitle}`}
      maxWidth='max-w-2xl'
      showFooter={true}
      footerButtons={footerButtons}
    >
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CiCirclePlus className="text-6xl mx-auto mb-4 opacity-50" strokeWidth={0.5} />
            <p className="text-lg">No hay aportaciones registradas todavía</p>
            <p className="text-sm mt-2">Comienza añadiendo tu primer ahorro a este objetivo</p>
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between p-4 bg-[#242F3A] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CiCirclePlus className="text-2xl text-white" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-white mb-1">
                    +{formatCurrency(entry.amount)}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    Aportado por: <span className="text-white">{entry.userEmail}</span>
                  </p>
                  {entry.note && (
                    <p className="text-sm text-gray-400 italic">
                      "{entry.note}"
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm whitespace-nowrap ml-4">
                {formatDate(entry.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Total de aportaciones:</p>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(history.reduce((sum, entry) => sum + entry.amount, 0))}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
