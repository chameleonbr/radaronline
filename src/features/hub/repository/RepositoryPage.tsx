import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  FileText,
  Video,
  HelpCircle,
  FileCheck,
  BookOpen,
  Search,
  Plus,
  ExternalLink,
  Calendar,
  User,
  X,
  Upload,
  Tag,
} from 'lucide-react';
import { useRepository } from '../../../hooks/useRepository';
import type { Material, MaterialType, MaterialCategory } from '../../../types/repository.types';
import { MATERIAL_TYPE_CONFIG, MATERIAL_CATEGORIES } from '../../../types/repository.types';

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const overlay = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

const TypeIcon: React.FC<{ type: MaterialType; size?: number }> = ({ type, size = 18 }) => {
  const map: Record<MaterialType, React.ElementType> = { video: Video, manual: FileText, faq: HelpCircle, template: FileCheck, legislacao: BookOpen };
  const Icon = map[type] || FileText;
  const config = MATERIAL_TYPE_CONFIG[type];
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
      <Icon size={size} className={config.color} />
    </div>
  );
};

// =====================================================
// Material Card
// =====================================================

const MaterialCard: React.FC<{ material: Material }> = React.memo(({ material }) => {
  const config = MATERIAL_TYPE_CONFIG[material.type];

  return (
    <motion.div
      variants={fadeIn}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all group"
    >
      <div className="flex items-start gap-4">
        <TypeIcon type={material.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
              {config.label}
            </span>
            {material.category && (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {material.category}
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {material.title}
          </h3>
          {material.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{material.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
            {material.author && (
              <span className="flex items-center gap-1"><User size={12} /> {material.author}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {new Date(material.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {material.fileUrl && (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-teal-100 hover:text-teal-600 dark:hover:bg-teal-800 dark:hover:text-teal-400 transition-all"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// =====================================================
// Add Material Modal
// =====================================================

interface AddMaterialModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; type: MaterialType; category: MaterialCategory; url: string; author: string }) => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MaterialType>('video');
  const [category, setCategory] = useState<MaterialCategory>(MATERIAL_CATEGORIES[0]);
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, type, category, url, author: '' });
    setTitle(''); setDescription(''); setUrl('');
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div {...overlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload size={20} className="text-teal-500" /> Adicionar Material
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Título *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="Nome do material"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Descrição</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                placeholder="Breve descrição do material"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Tipo</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as MaterialType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {(Object.keys(MATERIAL_TYPE_CONFIG) as MaterialType[]).map(t => (
                    <option key={t} value={t}>{MATERIAL_TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Categoria</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as MaterialCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {MATERIAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">URL / Link</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={!title.trim()} className="px-6 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Adicionar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =====================================================
// Main Repository Page
// =====================================================

interface RepositoryPageProps {
  userId?: string;
}

export const RepositoryPage: React.FC<RepositoryPageProps> = React.memo(({ userId: _userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<MaterialType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const { materials, loading, stats, addMaterial } = useRepository();

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = !searchTerm || m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [materials, searchTerm, typeFilter, categoryFilter]);

  const handleAddMaterial = useCallback(async (data: { title: string; description: string; type: MaterialType; category: MaterialCategory; url: string; author: string }) => {
    await addMaterial({ ...data, author: data.author || 'Anônimo' });
  }, [addMaterial]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div {...fadeIn} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Repositório de Materiais</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Documentos, vídeos, links e recursos da comunidade</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
          </div>
          {(Object.keys(MATERIAL_TYPE_CONFIG) as MaterialType[]).map(type => {
            const config = MATERIAL_TYPE_CONFIG[type];
            return (
              <div key={type} className={`rounded-xl border p-4 text-center ${config.bg} border-transparent`}>
                <p className={`text-2xl font-bold ${config.color}`}>{stats.byType[type]}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{config.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar materiais..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${typeFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              Todos
            </button>
            {(Object.keys(MATERIAL_TYPE_CONFIG) as MaterialType[]).map(t => {
              const config = MATERIAL_TYPE_CONFIG[t];
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${typeFilter === t ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <Tag size={14} className="text-slate-400 mt-1" />
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${categoryFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
          >
            Todas
          </button>
          {MATERIAL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${categoryFilter === cat ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Material List */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <FolderOpen size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum material encontrado</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Adicionar primeiro material
            </button>
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
            {filteredMaterials.map(material => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </motion.div>
        )}
      </motion.div>

      <AddMaterialModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMaterial}
      />
    </div>
  );
});
