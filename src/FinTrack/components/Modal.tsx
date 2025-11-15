import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  showFooter?: boolean;
  footerButtons?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', showFooter = false, footerButtons }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-background border border-secondary rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24}/>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>

        {showFooter && footerButtons && (
          <div className="flex justify-end gap-4 p-6 border-t border-gray-700">
            {footerButtons}
          </div>
        )}
      </div>
    </div>
  );
};