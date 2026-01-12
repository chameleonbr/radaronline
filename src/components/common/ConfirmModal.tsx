import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { fadeIn, scaleIn } from '../../lib/motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'danger' | 'warning' | 'info';
  type?: 'danger' | 'warning' | 'info'; // Alias for confirmType
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void; // Alias for onCancel
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmType,
  type,
  onConfirm,
  onCancel,
  onClose
}) => {
  if (!isOpen) return null;

  // Suporta tanto confirmType quanto type
  const finalType = confirmType || type || 'warning';
  // Suporta tanto onCancel quanto onClose
  const handleCancel = onCancel || onClose || (() => { });

  const typeConfig = {
    danger: {
      icon: <AlertTriangle className="text-rose-500" size={24} />,
      btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
      headerClass: 'text-rose-600 dark:text-rose-400'
    },
    warning: {
      icon: <AlertTriangle className="text-amber-500" size={24} />,
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      headerClass: 'text-amber-600 dark:text-amber-400'
    },
    info: {
      icon: <AlertTriangle className="text-blue-500" size={24} />,
      btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      headerClass: 'text-blue-600 dark:text-blue-400'
    }
  };

  const config = typeConfig[finalType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="confirm-modal-backdrop"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleCancel}
        />

        {/* Modal */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-slate-50 dark:bg-slate-700/50 shrink-0`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${config.headerClass}`}>
                  {title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-bold rounded-lg shadow-sm transition-colors ${config.btnClass}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
