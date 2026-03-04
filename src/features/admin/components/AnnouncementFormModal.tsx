import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  X,
} from 'lucide-react';
import { ANALYSTS } from '../../../data/analysts';
import { MICROREGIOES } from '../../../data/microregioes';
import type { AnnouncementPriority, AnnouncementType } from '../../../types/announcement.types';
import type {
  AnnouncementFormData,
  AnnouncementValidityMode,
} from '../announcementsManagement.types';

interface AnnouncementFormModalProps {
  destinationSearch: string;
  editingId: string | null;
  expandedMacros: string[];
  formData: AnnouncementFormData;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  setDestinationSearch: Dispatch<SetStateAction<string>>;
  setExpandedMacros: Dispatch<SetStateAction<string[]>>;
  setFormData: Dispatch<SetStateAction<AnnouncementFormData>>;
  setValidityMode: Dispatch<SetStateAction<AnnouncementValidityMode>>;
  validityMode: AnnouncementValidityMode;
}

export function AnnouncementFormModal({
  destinationSearch,
  editingId,
  expandedMacros,
  formData,
  isOpen,
  onClose,
  onSubmit,
  setDestinationSearch,
  setExpandedMacros,
  setFormData,
  setValidityMode,
  validityMode,
}: AnnouncementFormModalProps) {
  const updateFormData = (patch: Partial<AnnouncementFormData>) => {
    setFormData((current) => ({ ...current, ...patch }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/20"
          >
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-teal-50/50 to-transparent dark:from-teal-900/10">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Editar Mensagem' : 'Nova Mensagem'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {editingId ? 'Atualize os dados do comunicado' : 'Preencha os dados para publicar no mural'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="announcement-form" onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Titulo da Mensagem</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Manutencao Programada"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                      value={formData.title}
                      onChange={(event) => updateFormData({ title: event.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Data de Exibicao</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          required
                          type="date"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500"
                          value={formData.displayDate}
                          onChange={(event) => updateFormData({ displayDate: event.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Validade</label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none"
                        value={validityMode}
                        onChange={(event) => {
                          const nextValidityMode = event.target.value as AnnouncementValidityMode;
                          setValidityMode(nextValidityMode);
                          if (nextValidityMode === 'forever') {
                            updateFormData({ expirationDate: '' });
                          }
                        }}
                      >
                        <option value="forever">Indeterminado</option>
                        <option value="scheduled">Agendado ate...</option>
                      </select>
                    </div>
                  </div>

                  <AnimatePresence>
                    {validityMode === 'scheduled' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                          <label className="block text-sm font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                            <Clock size={16} /> Data de Expiracao
                          </label>
                          <input
                            required
                            type="date"
                            min={formData.displayDate}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border-none ring-1 ring-amber-200 dark:ring-amber-800 rounded-lg focus:ring-2 focus:ring-amber-500"
                            value={formData.expirationDate || ''}
                            onChange={(event) => updateFormData({ expirationDate: event.target.value })}
                          />
                          <p className="text-xs text-amber-600 mt-2 font-medium">A mensagem desaparecera automaticamente apos esta data.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Conteudo</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Digite o conteudo da mensagem..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none transition-all"
                      value={formData.content}
                      onChange={(event) => updateFormData({ content: event.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tipo</label>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none"
                          value={formData.type}
                          onChange={(event) => updateFormData({ type: event.target.value as AnnouncementType })}
                        >
                          <option value="news">Novidade</option>
                          <option value="alert">Alerta</option>
                          <option value="maintenance">Manutencao</option>
                          <option value="tutorial">Tutorial</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prioridade</label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none"
                        value={formData.priority}
                        onChange={(event) => updateFormData({ priority: event.target.value as AnnouncementPriority })}
                      >
                        <option value="normal">Normal</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Destino (Microrregioes)</label>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex flex-col h-[500px]">
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10 space-y-3">
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {ANALYSTS.map((analyst) => {
                            const analystMacros = analyst.macros.map((macro) => macro.toUpperCase());
                            const analystMicros = MICROREGIOES.filter((micro) => analystMacros.includes(micro.macrorregiao.toUpperCase()));
                            const allAnalystMicrosSelected = analystMicros.every((micro) => formData.targetMicros.includes(micro.id));

                            return (
                              <button
                                key={analyst.name}
                                type="button"
                                onClick={() => {
                                  const microIds = analystMicros.map((micro) => micro.id);
                                  const macroNames = analyst.macros.map((macro) => macro.toUpperCase());
                                  const isExclusive = formData.targetMicros.length === microIds.length
                                    && microIds.every((id) => formData.targetMicros.includes(id));

                                  if (isExclusive) {
                                    updateFormData({ targetMicros: [] });
                                    return;
                                  }

                                  updateFormData({ targetMicros: microIds });
                                  setExpandedMacros((current) => [...new Set([...current, ...macroNames])]);
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${allAnalystMicrosSelected
                                  ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/20'
                                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${analyst.color}`}>
                                  {analyst.shortName.charAt(0)}
                                </div>
                                <span className="text-xs font-medium">{analyst.shortName}</span>
                                {allAnalystMicrosSelected && <CheckCircle size={12} className="text-teal-500" />}
                              </button>
                            );
                          })}
                        </div>

                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Buscar microrregiao..."
                            value={destinationSearch}
                            onChange={(event) => {
                              setDestinationSearch(event.target.value);
                              if (event.target.value) {
                                setExpandedMacros([...new Set(MICROREGIOES.map((micro) => micro.macrorregiao))]);
                              }
                            }}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <label className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors border border-dashed border-slate-300 dark:border-slate-600">
                          <input
                            type="checkbox"
                            checked={formData.targetMicros.includes('all')}
                            onChange={(event) => updateFormData({ targetMicros: event.target.checked ? ['all'] : [] })}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                          />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Globe size={14} className="text-teal-600" />
                            Todas as Microrregioes (Global)
                          </span>
                        </label>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {!formData.targetMicros.includes('all') && Object.entries(
                          MICROREGIOES
                            .filter((micro) => micro.nome.toLowerCase().includes(destinationSearch.toLowerCase()))
                            .reduce((accumulator, micro) => {
                              if (!accumulator[micro.macrorregiao]) accumulator[micro.macrorregiao] = [];
                              accumulator[micro.macrorregiao].push(micro);
                              return accumulator;
                            }, {} as Record<string, typeof MICROREGIOES>),
                        ).map(([macroName, micros]) => {
                          const isExpanded = expandedMacros.includes(macroName) || destinationSearch.length > 0;
                          const allSelected = micros.every((micro) => formData.targetMicros.includes(micro.id));

                          return (
                            <div
                              key={macroName}
                              className={`rounded-lg border overflow-hidden transition-all ${allSelected
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                                : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                                }`}
                            >
                              <div
                                className={`flex items-center justify-between p-2 transition-colors cursor-pointer ${allSelected
                                  ? 'bg-emerald-100/50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                                  : 'bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                  }`}
                                onClick={() => {
                                  if (expandedMacros.includes(macroName)) {
                                    setExpandedMacros((current) => current.filter((macro) => macro !== macroName));
                                  } else {
                                    setExpandedMacros((current) => [...current, macroName]);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {isExpanded
                                    ? <ChevronDown size={14} className={allSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                                    : <ChevronRight size={14} className={allSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />}
                                  <span className={`text-xs font-bold uppercase tracking-wider ${allSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {macroName}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${allSelected ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                                    {micros.length}
                                  </span>
                                </div>

                                <div onClick={(event) => event.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const microIds = micros.map((micro) => micro.id);
                                      if (allSelected) {
                                        setFormData((current) => ({
                                          ...current,
                                          targetMicros: current.targetMicros.filter((id) => !microIds.includes(id)),
                                        }));
                                        return;
                                      }

                                      setFormData((current) => ({
                                        ...current,
                                        targetMicros: [...new Set([...current.targetMicros, ...microIds])],
                                      }));
                                    }}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${allSelected ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-teal-600'}`}
                                  >
                                    {allSelected ? 'Remover Todos' : 'Selecionar Todos'}
                                  </button>
                                </div>
                              </div>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 bg-white dark:bg-slate-800">
                                      {micros.map((micro) => (
                                        <label
                                          key={micro.id}
                                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${formData.targetMicros.includes(micro.id)
                                            ? 'bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-100 dark:ring-teal-900/30'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                            }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={formData.targetMicros.includes(micro.id)}
                                            onChange={(event) => {
                                              const currentMicros = formData.targetMicros;
                                              if (event.target.checked) {
                                                updateFormData({ targetMicros: [...currentMicros, micro.id] });
                                              } else {
                                                updateFormData({ targetMicros: currentMicros.filter((id) => id !== micro.id) });
                                              }
                                            }}
                                            className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                                          />
                                          <span className={`text-xs ${formData.targetMicros.includes(micro.id) ? 'font-bold text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {micro.nome}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}

                        {formData.targetMicros.includes('all') && (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Globe size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">Todas as microrregioes receberao esta mensagem.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Link Externo</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500"
                          value={formData.linkUrl}
                          onChange={(event) => updateFormData({ linkUrl: event.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Imagem Capa</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500"
                          value={formData.imageUrl}
                          onChange={(event) => updateFormData({ imageUrl: event.target.value })}
                          placeholder="URL da imagem (opcional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="announcement-form"
                className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
              >
                {editingId ? 'Salvar Alteracoes' : 'Publicar Mensagem'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
