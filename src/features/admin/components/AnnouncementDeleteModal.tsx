import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface AnnouncementDeleteModalProps {
  announcementId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void | Promise<void>;
}

export function AnnouncementDeleteModal({
  announcementId,
  onCancel,
  onConfirm,
}: AnnouncementDeleteModalProps) {
  return (
    <AnimatePresence>
      {announcementId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Excluir Mensagem?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Essa acao nao pode ser desfeita. A mensagem sera removida permanentemente.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={onCancel}
                  className="px-6 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => void onConfirm(announcementId)}
                  className="px-6 py-2.5 text-white bg-rose-500 hover:bg-rose-600 rounded-xl font-bold shadow-lg shadow-rose-500/30 transition-all"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
