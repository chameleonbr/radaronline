import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Plus, Calendar, Trash2, Eye, EyeOff, Link as LinkIcon, Edit,
    Search, Globe, MapPin, Clock, LayoutGrid, List as ListIcon
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import {
    loadAllAnnouncementsForAdmin,
    createAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    updateAnnouncement
} from '../../services/announcementsService';
import { Announcement } from '../../types/announcement.types';
import { useAuth } from '../../auth/AuthContext';
import type { AnnouncementFormData, AnnouncementValidityMode } from './announcementsManagement.types';
import {
    createEmptyAnnouncementFormData,
    getAnnouncementTypeDetails,
    mapAnnouncementToFormData
} from './announcementsManagement.utils';
import { AnnouncementDeleteModal } from './components/AnnouncementDeleteModal';
import { AnnouncementFormModal } from './components/AnnouncementFormModal';

// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export function AnnouncementsManagement() {
    const { showToast } = useToast();
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<AnnouncementFormData>(createEmptyAnnouncementFormData);

    const [validityMode, setValidityMode] = useState<AnnouncementValidityMode>('forever');
    const [destinationSearch, setDestinationSearch] = useState('');
    const [expandedMacros, setExpandedMacros] = useState<string[]>([]);

    const isSuperAdmin = user?.role === 'superadmin';

    const resetFormState = () => {
        setEditingId(null);
        setFormData(createEmptyAnnouncementFormData());
        setValidityMode('forever');
        setDestinationSearch('');
        setExpandedMacros([]);
    };

    const loadData = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await loadAllAnnouncementsForAdmin();
            console.log('Admin Announcements Loaded:', data);
            setAnnouncements(data);
        } catch {
            showToast('Erro ao carregar comunicados', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateAnnouncement(editingId, {
                    ...formData,
                    isActive: true
                });
                showToast('Comunicado atualizado com sucesso!', 'success');
            } else {
                await createAnnouncement({
                    ...formData,
                    isActive: true
                });
                showToast('Comunicado publicado com sucesso!', 'success');
            }
            setShowModal(false);
            resetFormState();
            void loadData();
        } catch {
            showToast(editingId ? 'Erro ao atualizar comunicado' : 'Erro ao publicar comunicado', 'error');
        }
    };

    const handleEdit = (item: Announcement) => {
        setEditingId(item.id);
        setFormData(mapAnnouncementToFormData(item));
        setValidityMode(item.expirationDate ? 'scheduled' : 'forever');
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAnnouncement(id);
            showToast('Comunicado excluído', 'success');
            setDeleteConfirmId(null);
            void loadData();
        } catch {
            showToast('Erro ao excluir', 'error');
        }
    };

    const handleToggleStatus = async (item: Announcement) => {
        try {
            await toggleAnnouncementActive(item.id, item.isActive);
            showToast(item.isActive ? 'Comunicado arquivado' : 'Comunicado ativado', 'success');
            void loadData();
        } catch {
            showToast('Erro ao alterar status', 'error');
        }
    };

    const filteredList = announcements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'active' ? item.isActive : !item.isActive;
        return matchesSearch && matchesTab;
    });


    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
            {/* Header com Design Premium */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-teal-500/20 transform hover:scale-105 transition-transform duration-300">
                            <Megaphone size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Mural da Rede</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Gerencie a comunicação oficial
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                resetFormState();
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Nova Mensagem</span>
                        </button>
                    </div>
                </div>

                {/* Toolbar Moderno */}
                <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'active'
                                ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-teal-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            Ativos
                        </button>
                        <button
                            onClick={() => setActiveTab('archived')}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'archived'
                                ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-teal-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            Arquivados
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="relative max-w-sm w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar no mural..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm group-hover:shadow-md"
                            />
                        </div>

                        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center flex-col items-center py-20 opacity-50"
                        >
                            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Carregando mural...</p>
                        </motion.div>
                    ) : filteredList.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Megaphone size={40} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
                                Nenhum comunicado encontrado
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Não há mensagens {activeTab === 'active' ? 'ativas' : 'arquivadas'} no momento.
                                Clique em "Nova Mensagem" para começar.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`list-${activeTab}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
                        >
                            {filteredList.map(item => {
                                const typeInfo = getAnnouncementTypeDetails(item.type);
                                const TypeIcon = typeInfo.icon;

                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        className={`group relative bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!item.isActive
                                            ? 'opacity-75 border-slate-200 dark:border-slate-700 bg-slate-50/50'
                                            : 'border-slate-100 dark:border-slate-700 shadow-sm'
                                            } ${viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6 flex flex-col h-full'}`}
                                    >
                                        <div className={`flex items-start justify-between ${viewMode === 'list' ? 'w-full' : 'mb-4'}`}>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${typeInfo.color}`}>
                                                        <TypeIcon size={12} />
                                                        {typeInfo.label}
                                                    </span>
                                                    {item.priority === 'high' && (
                                                        <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-rose-500 text-white shadow-sm shadow-rose-500/20">
                                                            Alta Prioridade
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            {viewMode === 'list' && (
                                                <div className="flex items-center gap-6 ml-auto mr-8 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} />
                                                        {new Date(item.displayDate).toLocaleDateString('pt-BR')}
                                                    </div>
                                                    {item.expirationDate && (
                                                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded">
                                                            <Clock size={14} />
                                                            Expira: {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {item.content}
                                        </p>

                                        {viewMode === 'grid' && (
                                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg">
                                                    <Calendar size={12} />
                                                    {new Date(item.displayDate).toLocaleDateString('pt-BR')}
                                                </div>
                                                {item.expirationDate && (
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                                        <Clock size={12} />
                                                        Expira: {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg ml-auto">
                                                    {item.targetMicros.includes('all') ? (
                                                        <><Globe size={12} /> Global</>
                                                    ) : (
                                                        <><MapPin size={12} /> {item.targetMicros.length} regiões</>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between ${viewMode === 'list' ? 'border-none pt-0 pl-6 border-l w-auto' : ''}`}>
                                            {item.linkUrl ? (
                                                <a href={item.linkUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1.5">
                                                    <LinkIcon size={12} />
                                                    {item.linkUrl.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                                                </a>
                                            ) : <span></span>}

                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg hover:text-teal-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(item)}
                                                    className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg hover:text-slate-600 transition-colors"
                                                    title={item.isActive ? 'Arquivar' : 'Ativar'}
                                                >
                                                    {item.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                {isSuperAdmin && (
                                                    <button
                                                        onClick={() => setDeleteConfirmId(item.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnnouncementFormModal
                destinationSearch={destinationSearch}
                editingId={editingId}
                expandedMacros={expandedMacros}
                formData={formData}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                setDestinationSearch={setDestinationSearch}
                setExpandedMacros={setExpandedMacros}
                setFormData={setFormData}
                setValidityMode={setValidityMode}
                validityMode={validityMode}
            />

            <AnnouncementDeleteModal
                announcementId={deleteConfirmId}
                onCancel={() => setDeleteConfirmId(null)}
                onConfirm={handleDelete}
            />
        </div >
    );
}
