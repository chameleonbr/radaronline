import { motion } from 'framer-motion';
import { ChevronLeft, Lightbulb, ShieldCheck } from 'lucide-react';

interface UserSettingsSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function UserSettingsSuggestionModal({
  isOpen,
  onClose,
  onSubmit,
}: UserSettingsSuggestionModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={24} />
            Sugerir Melhoria
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ChevronLeft className="rotate-180" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-900 dark:text-blue-200 flex gap-3 border border-blue-100 dark:border-blue-900/30">
            <ShieldCheck className="shrink-0 text-blue-600 dark:text-blue-400" size={20} />
            <p className="leading-snug">Para manter a qualidade, sua sugestao sera revisada por nossa equipe antes de ir para votacao.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Titulo da Sugestao</label>
              <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" placeholder="Ex: Exportar relatorio em Excel..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Descricao Detalhada</label>
              <textarea className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white h-24 resize-none" placeholder="Explique por que isso seria util..." />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">
            Cancelar
          </button>
          <button onClick={onSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all">
            Enviar Sugestao
          </button>
        </div>
      </motion.div>
    </div>
  );
}
