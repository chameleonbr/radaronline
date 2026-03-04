import { MICROREGIOES } from '../../data/microregioes';

interface CreateActionMicroModalProps {
  isOpen: boolean;
  microId: string;
  onMicroIdChange: (microId: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function CreateActionMicroModal({
  isOpen,
  microId,
  onMicroIdChange,
  onClose,
  onConfirm,
}: CreateActionMicroModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Criar ação</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Escolha a microrregião onde a nova ação será criada.
            </p>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Microrregião
          </label>
          <select
            value={microId}
            onChange={event => onMicroIdChange(event.target.value)}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
          >
            {MICROREGIOES.map(micro => (
              <option key={micro.id} value={micro.id}>
                {micro.nome} ({micro.id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            onClick={onConfirm}
          >
            Criar ação
          </button>
        </div>
      </div>
    </div>
  );
}
