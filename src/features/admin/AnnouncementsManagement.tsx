import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Plus, Calendar, Trash2, Eye, EyeOff, Link as LinkIcon, Edit,
    AlertTriangle, X, Search, Globe, MapPin, Image as ImageIcon,
    Clock, CheckCircle, LayoutGrid, List as ListIcon, Filter,
    ChevronDown, ChevronRight
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import {
    loadAllAnnouncementsForAdmin,
    createAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    updateAnnouncement
} from '../../services/dataService';
import { Announcement, AnnouncementType, AnnouncementPriority } from '../../types/announcement.types';
import { MICROREGIOES } from '../../data/microregioes';
import { ANALYSTS } from '../../data/analysts';
import { useAuth } from '../../auth/AuthContext';

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

    // Form State
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        type: AnnouncementType;
        priority: AnnouncementPriority;
        displayDate: string;
        targetMicros: string[];
        linkUrl: string;
        imageUrl: string;
        expirationDate: string;
    }>({
        title: '',
        content: '',
        type: 'news',
        priority: 'normal',
        displayDate: new Date().toISOString().split('T')[0],
        targetMicros: ['all'],
        linkUrl: '',
        imageUrl: '',
        expirationDate: ''
    });

    const [validityMode, setValidityMode] = useState<'forever' | 'scheduled'>('forever');
    const [destinationSearch, setDestinationSearch] = useState('');
    const [expandedMacros, setExpandedMacros] = useState<string[]>([]);

    const isSuperAdmin = user?.role === 'superadmin';

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
        loadData();
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
            setEditingId(null);
            setFormData({
                title: '',
                content: '',
                type: 'news',
                priority: 'normal',
                displayDate: new Date().toISOString().split('T')[0],
                targetMicros: ['all'],
                linkUrl: '',
                imageUrl: '',
                expirationDate: ''
            });
            setValidityMode('forever');
            loadData();
        } catch {
            showToast(editingId ? 'Erro ao atualizar comunicado' : 'Erro ao publicar comunicado', 'error');
        }
    };

    const handleEdit = (item: Announcement) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            content: item.content,
            type: item.type,
            priority: item.priority,
            displayDate: item.displayDate.split('T')[0], // Ensure date format
            targetMicros: item.targetMicros,
            linkUrl: item.linkUrl || '',
            imageUrl: item.imageUrl || '',
            expirationDate: item.expirationDate ? item.expirationDate.split('T')[0] : ''
        });
        setValidityMode(item.expirationDate ? 'scheduled' : 'forever');
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAnnouncement(id);
            showToast('Comunicado excluído', 'success');
            setDeleteConfirmId(null);
            loadData();
        } catch {
            showToast('Erro ao excluir', 'error');
        }
    };

    const handleToggleStatus = async (item: Announcement) => {
        try {
            await toggleAnnouncementActive(item.id, item.isActive);
            showToast(item.isActive ? 'Comunicado arquivado' : 'Comunicado ativado', 'success');
            loadData();
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

    const getTypeDetails = (type: string) => {
        const map: Record<string, { label: string, color: string, icon: any }> = {
            news: { label: 'Novidade', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', icon: Megaphone },
            alert: { label: 'Alerta', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300', icon: AlertTriangle },
            maintenance: { label: 'Manutenção', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', icon: Clock },
            tutorial: { label: 'Tutorial', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300', icon: CheckCircle },
        };
        return map[type] || map.news;
    };

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
                                setEditingId(null);
                                setFormData({
                                    title: '',
                                    content: '',
                                    type: 'news',
                                    priority: 'normal',
                                    displayDate: new Date().toISOString().split('T')[0],
                                    targetMicros: ['all'],
                                    linkUrl: '',
                                    imageUrl: '',
                                    expirationDate: ''
                                });
                                setValidityMode('forever');
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
                        <div className="flex justify-center flex-col items-center py-20 opacity-50">
                            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Carregando mural...</p>
                        </div>
                    ) : filteredList.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
                        >
                            {filteredList.map(item => {
                                const typeInfo = getTypeDetails(item.type);
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

            {/* Premium Create Modal with Glassmorphism */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
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
                                    onClick={() => setShowModal(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <form id="announcement-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Título da Mensagem</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ex: Manutenção Programada"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Data de Exibição</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        required
                                                        type="date"
                                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500"
                                                        value={formData.displayDate}
                                                        onChange={e => setFormData({ ...formData, displayDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    Validade
                                                </label>
                                                <select
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none"
                                                    value={validityMode}
                                                    onChange={(e) => {
                                                        const mode = e.target.value as 'forever' | 'scheduled';
                                                        setValidityMode(mode);
                                                        if (mode === 'forever') {
                                                            setFormData({ ...formData, expirationDate: '' });
                                                        }
                                                    }}
                                                >
                                                    <option value="forever">Indeterminado</option>
                                                    <option value="scheduled">Agendado até...</option>
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
                                                            <Clock size={16} /> Data de Expiração
                                                        </label>
                                                        <input
                                                            required
                                                            type="date"
                                                            min={formData.displayDate}
                                                            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border-none ring-1 ring-amber-200 dark:ring-amber-800 rounded-lg focus:ring-2 focus:ring-amber-500"
                                                            value={formData.expirationDate || ''}
                                                            onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
                                                        />
                                                        <p className="text-xs text-amber-600 mt-2 font-medium">A mensagem desaparecerá automaticamente após esta data.</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Conteúdo</label>
                                            <textarea
                                                required
                                                rows={4}
                                                placeholder="Digite o conteúdo da mensagem..."
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none transition-all"
                                                value={formData.content}
                                                onChange={e => setFormData({ ...formData, content: e.target.value })}
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
                                                        onChange={e => setFormData({ ...formData, type: e.target.value as AnnouncementType })}
                                                    >
                                                        <option value="news">Novidade</option>
                                                        <option value="alert">Alerta</option>
                                                        <option value="maintenance">Manutenção</option>
                                                        <option value="tutorial">Tutorial</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prioridade</label>
                                                <select
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none"
                                                    value={formData.priority}
                                                    onChange={e => setFormData({ ...formData, priority: e.target.value as AnnouncementPriority })}
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="high">Alta</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Destino (Microrregiões)
                                            </label>
                                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex flex-col h-[500px]">
                                                {/* Search Header */}
                                                <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10 space-y-3">
                                                    {/* Analyst Quick Select */}
                                                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                                        {ANALYSTS.map(analyst => {
                                                            // Calculate if this analyst is fully selected
                                                            const analystMacros = analyst.macros.map(m => m.toUpperCase());
                                                            const analystMicros = MICROREGIOES.filter(m => analystMacros.includes(m.macrorregiao.toUpperCase()));
                                                            const allAnalystMicrosSelected = analystMicros.every(m => formData.targetMicros.includes(m.id));

                                                            return (
                                                                <button
                                                                    key={analyst.name}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const microIds = analystMicros.map(m => m.id);
                                                                        const macroNames = analyst.macros.map(m => m.toUpperCase());

                                                                        if (allAnalystMicrosSelected) {
                                                                            // Deselect all for this analyst
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                targetMicros: prev.targetMicros.filter(id => !microIds.includes(id))
                                                                            }));
                                                                        } else {
                                                                            // Select all for this analyst AND expand their macros
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                targetMicros: [...new Set([...prev.targetMicros, ...microIds])]
                                                                            }));
                                                                            // Add analyst macros to expanded list
                                                                            setExpandedMacros(prev => [...new Set([...prev, ...macroNames])]);
                                                                        }
                                                                    }}
                                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${allAnalystMicrosSelected
                                                                        ? `bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/20`
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
                                                            placeholder="Buscar microrregião..."
                                                            value={destinationSearch}
                                                            onChange={e => {
                                                                setDestinationSearch(e.target.value);
                                                                if (e.target.value) {
                                                                    // Auto expand all when searching
                                                                    setExpandedMacros([...new Set(MICROREGIOES.map(m => m.macrorregiao))]);
                                                                }
                                                            }}
                                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                    <label className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors border border-dashed border-slate-300 dark:border-slate-600">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targetMicros.includes('all')}
                                                            onChange={e => {
                                                                if (e.target.checked) setFormData({ ...formData, targetMicros: ['all'] });
                                                                else setFormData({ ...formData, targetMicros: [] });
                                                            }}
                                                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                                                        />
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                            <Globe size={14} className="text-teal-600" />
                                                            Todas as Microrregiões (Global)
                                                        </span>
                                                    </label>
                                                </div>


                                                {/* Grouped List */}
                                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                                    {!formData.targetMicros.includes('all') && (
                                                        Object.entries(
                                                            MICROREGIOES
                                                                .filter(m => m.nome.toLowerCase().includes(destinationSearch.toLowerCase()))
                                                                .reduce((acc, micro) => {
                                                                    if (!acc[micro.macrorregiao]) acc[micro.macrorregiao] = [];
                                                                    acc[micro.macrorregiao].push(micro);
                                                                    return acc;
                                                                }, {} as Record<string, typeof MICROREGIOES>)
                                                        ).map(([macroName, micros]) => {
                                                            const isExpanded = expandedMacros.includes(macroName) || destinationSearch.length > 0;
                                                            const allSelected = micros.every(m => formData.targetMicros.includes(m.id));

                                                            return (
                                                                <div key={macroName} className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                                                                    <div
                                                                        className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                                                        onClick={() => {
                                                                            if (expandedMacros.includes(macroName)) {
                                                                                setExpandedMacros(prev => prev.filter(m => m !== macroName));
                                                                            } else {
                                                                                setExpandedMacros(prev => [...prev, macroName]);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                                                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{macroName}</span>
                                                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full">
                                                                                {micros.length}
                                                                            </span>
                                                                        </div>
                                                                        <div onClick={e => e.stopPropagation()}>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const microIds = micros.map(m => m.id);
                                                                                    if (allSelected) {
                                                                                        setFormData(prev => ({
                                                                                            ...prev,
                                                                                            targetMicros: prev.targetMicros.filter(id => !microIds.includes(id))
                                                                                        }));
                                                                                    } else {
                                                                                        setFormData(prev => ({
                                                                                            ...prev,
                                                                                            targetMicros: [...new Set([...prev.targetMicros, ...microIds])]
                                                                                        }));
                                                                                    }
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
                                                                                    {micros.map(micro => (
                                                                                        <label key={micro.id} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${formData.targetMicros.includes(micro.id)
                                                                                            ? 'bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-100 dark:ring-teal-900/30'
                                                                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                                                            }`}>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={formData.targetMicros.includes(micro.id)}
                                                                                                onChange={e => {
                                                                                                    const current = formData.targetMicros;
                                                                                                    if (e.target.checked) {
                                                                                                        setFormData({ ...formData, targetMicros: [...current, micro.id] });
                                                                                                    } else {
                                                                                                        setFormData({ ...formData, targetMicros: current.filter(id => id !== micro.id) });
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
                                                        })
                                                    )}
                                                    {formData.targetMicros.includes('all') && (
                                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                            <Globe size={32} className="mb-2 opacity-50" />
                                                            <p className="text-sm">Todas as microrregiões receberão esta mensagem.</p>
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
                                                        onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
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
                                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
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
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    form="announcement-form"
                                    className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
                                >
                                    {editingId ? 'Salvar Alterações' : 'Publicar Mensagem'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirmId(null)}
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
                                    Essa ação não pode ser desfeita. A mensagem será removida permanentemente.
                                </p>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="px-6 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteConfirmId)}
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
        </div >
    );
}
