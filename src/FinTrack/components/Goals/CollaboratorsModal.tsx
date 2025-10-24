import { useState } from 'react'
import { Modal } from './Modal'
import { FaSearch, FaTrash, FaUserPlus } from "react-icons/fa";
import type { GoalCollaborator } from '../../reducers/goal/goalReducersInterface';

interface CollaboratorsModalProps {
  isOpen: boolean;
  onClose : () => void;
  goalTitle: string;
  collaborators: GoalCollaborator[];
  isOwner: boolean; // Nuevo prop
  onAddCollaborator: (email: string) => void;
  onRemoveCollaborator: (id: string) => void;
}

export const CollaboratorsModal = ({ 
  isOpen, 
  onClose, 
  goalTitle, 
  collaborators, 
  isOwner, // Nuevo
  onAddCollaborator, 
  onRemoveCollaborator 
}: CollaboratorsModalProps) => {
  const [searchEmail, setSearchEmail] = useState("");

  const handleAddCollaborator = () => {
    if (searchEmail.trim() && searchEmail.includes("@")) {
      onAddCollaborator(searchEmail.trim());
      setSearchEmail("");
    }
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    onRemoveCollaborator(collaboratorId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const footerButtons = (
    <button
      type="button"
      onClick={onClose}
      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
    >
      Cerrar
    </button>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isOwner ? 'Gestionar' : 'Ver'} Colaboradores: "${goalTitle}"`}
      maxWidth='max-w-2xl'
      showFooter={true}
      footerButtons={footerButtons}
    >
      {/* Solo mostrar si es dueño */}
      {isOwner && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Añadir Colaborador</h3>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator()}
                placeholder="Buscar por email o nombre de usuario"
                className="w-full pl-12 pr-4 py-3 bg-[#242F3A] text-white rounded-lg border border-gray-600 focus:border-secondary focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCollaborator}
              className="px-6 py-3 bg-secondary hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <FaUserPlus />
              Añadir
            </button>
          </div>
        </div>
      )}

      {/* Lista de Colaboradores Actuales */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Colaboradores {isOwner ? 'Actuales' : ''}
        </h3>

        {collaborators.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No hay colaboradores en este objetivo todavía
          </div>
        ) : (
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-4 bg-[#242F3A] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-semibold">{collaborator.email}</p>
                    <p className="text-sm text-gray-400">
                      Contribución: {formatCurrency(collaborator.totalContribution)}
                    </p>
                  </div>
                </div>

                {/* Solo mostrar botón eliminar si es dueño */}
                {isOwner && (
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar colaborador"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}