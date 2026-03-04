import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface RequestDeleteModalProps {
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RequestDeleteModal({ saving, onClose, onConfirm }: RequestDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
      >
        <div className="bg-gradient-to-br from-red-500 to-rose-600 px-6 py-5 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <AlertTriangle size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
          <p className="text-sm text-red-100 mt-1">Esta ação não pode ser desfeita</p>
        </div>

        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 text-center text-sm leading-relaxed">
            Você está prestes a excluir permanentemente esta solicitação. Todos os dados associados serão removidos do sistema.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Sim, excluir
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
