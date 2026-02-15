
// components/Modal.tsx
import React, { ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-gray-800 bg-opacity-90 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full p-6 text-gray-100 animate-fade-in-up">
        <h3 className="text-2xl font-extrabold text-emerald-400 mb-4 pb-2 border-b border-gray-700 flex justify-between items-center">
          {title}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </h3>
        <div className="modal-content mb-6 text-gray-300">
          {children}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
