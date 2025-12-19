import { useMemo, useState } from 'react';
import { Activity, Filter, Search, MapPin, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { MICROREGIOES } from '../../../data/microregioes';

type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'user_created' 
  | 'user_updated' 
  | 'user_deactivated'
  | 'lgpd_accepted'
  | 'action_created'
  | 'action_updated'
  | 'action_deleted'
  | 'view_micro';

export type ActivityItem = {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  description: string;
  details?: string;
  timestamp: Date;
  microregiaoId?: string;
  microregiaoNome?: string;
};

// Mock básico — em produção virá da API
const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'login', userId: 'usr_001', userName: 'Administrador', description: 'Login', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
  { id: '2', type: 'action_updated', userId: 'usr_002', userName: 'Maria Silva', description: 'Atualizou ação', details: 'Mapear o ambiente de informação - 100%', timestamp: new Date(Date.now() - 15 * 60 * 1000), microregiaoId: 'MR009', microregiaoNome: 'Poços de Caldas' },
  { id: '3', type: 'user_created', userId: 'usr_001', userName: 'Administrador', description: 'Criou usuário', details: 'João Santos', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: '4', type: 'lgpd_accepted', userId: 'usr_003', userName: 'João Santos', description: 'Aceitou LGPD', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: '5', type: 'action_created', userId: 'usr_002', userName: 'Maria Silva', description: 'Criou ação', details: 'Capacitação técnica', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), microregiaoId: 'MR009', microregiaoNome: 'Poços de Caldas' },
  { id: '6', type: 'view_micro', userId: 'usr_001', userName: 'Administrador', description: 'Visualizou microrregião', details: 'Belo Horizonte', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), microregiaoId: 'MR001', microregiaoNome: 'Belo Horizonte' },
  { id: '7', type: 'user_deactivated', userId: 'usr_001', userName: 'Administrador', description: 'Desativou usuário', details: 'Usuário Inativo', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '8', type: 'action_deleted', userId: 'usr_004', userName: 'Ana Oliveira', description: 'Removeu ação', details: 'Ação duplicada', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), microregiaoId: 'MR010', microregiaoNome: 'Varginha' },
  { id: '9', type: 'action_updated', userId: 'usr_005', userName: 'Carlos Lima', description: 'Atualizou ação', details: 'Cronograma antecipado', timestamp: new Date(Date.now() - 50 * 60 * 1000), microregiaoId: 'MR015', microregiaoNome: 'Diamantina' },
];

const activityLabels: Record<ActivityType, string> = {
  login: 'Login',
  logout: 'Logout',
  user_created: 'Usuário criado',
  user_updated: 'Usuário atualizado',
  user_deactivated: 'Usuário desativado',
  lgpd_accepted: 'LGPD aceito',
  action_created: 'Ação criada',
  action_updated: 'Ação atualizada',
  action_deleted: 'Ação removida',
  view_micro: 'Visualizou microrregião',
};

const activityColors: Record<ActivityType, string> = {
  login: 'bg-blue-100 text-blue-700 border-blue-200',
  logout: 'bg-blue-100 text-blue-700 border-blue-200',
  user_created: 'bg-green-100 text-green-700 border-green-200',
  user_updated: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  user_deactivated: 'bg-red-100 text-red-700 border-red-200',
  lgpd_accepted: 'bg-purple-100 text-purple-700 border-purple-200',
  action_created: 'bg-teal-100 text-teal-700 border-teal-200',
  action_updated: 'bg-amber-100 text-amber-700 border-amber-200',
  action_deleted: 'bg-red-100 text-red-700 border-red-200',
  view_micro: 'bg-slate-100 text-slate-700 border-slate-200',
};

const timePresets = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: 'all', label: 'Tudo' },
] as const;

type TimePreset = typeof timePresets[number]['id'];

const activityTypes = Object.keys(activityLabels) as ActivityType[];

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const matchesPreset = (date: Date, preset: TimePreset) => {
  if (preset === 'all') return true;
  const now = new Date().getTime();
  const diff = now - date.getTime();
  if (preset === '24h') return diff <= 24 * 60 * 60 * 1000;
  if (preset === '7d') return diff <= 7 * 24 * 60 * 60 * 1000;
  if (preset === '30d') return diff <= 30 * 24 * 60 * 60 * 1000;
  return true;
};

function ActivityCard({ activity }: { activity: ActivityItem }) {
  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className={`px-2 py-1 rounded-md text-[11px] font-semibold border ${activityColors[activity.type]}`}>
          {activityLabels[activity.type]}
        </div>
        <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatTimeAgo(activity.timestamp)}</span>
      </div>
      <div className="mt-2 text-sm text-slate-800">
        <span className="font-semibold">{activity.userName}</span> — {activity.description}
      </div>
      {activity.details && (
        <div className="text-xs text-slate-500 mt-1 line-clamp-2" title={activity.details}>
          {activity.details}
        </div>
      )}
      {activity.microregiaoNome && (
        <div className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded mt-2 w-fit">
          <MapPin size={12} />
          {activity.microregiaoNome}
        </div>
      )}
    </div>
  );
}

export function ActivityCenter() {
  const [microFilter, setMicroFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimePreset>('7d');
  const [expandedMicros, setExpandedMicros] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return MOCK_ACTIVITIES.filter(a => {
      const matchesMicro = microFilter === 'all' ? true : (microFilter === 'sem_micro' ? !a.microregiaoId : a.microregiaoId === microFilter);
      const matchesType = typeFilter === 'all' ? true : a.type === typeFilter;
      const matchesSearch = !search || `${a.userName} ${a.description} ${a.details || ''}`.toLowerCase().includes(search.toLowerCase());
      const matchesTime = matchesPreset(a.timestamp, timeFilter);
      return matchesMicro && matchesType && matchesSearch && matchesTime;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [microFilter, typeFilter, search, timeFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, ActivityItem[]>>((acc, item) => {
      const key = item.microregiaoId || 'sem_micro';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const microOptions = useMemo(() => [
    { id: 'all', label: 'Todas microrregiões' },
    ...MICROREGIOES.map(m => ({ id: m.id, label: m.nome })),
    { id: 'sem_micro', label: 'Sem microrregião' },
  ], []);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 font-semibold">
          <Filter size={14} />
          Filtros
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Microrregião</label>
            <select 
              value={microFilter}
              onChange={e => setMicroFilter(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-2 text-sm"
            >
              {microOptions.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Tipo</label>
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as ActivityType | 'all')}
              className="w-full mt-1 border border-slate-200 rounded-lg px-2 py-2 text-sm"
            >
              <option value="all">Todos</option>
              {activityTypes.map(t => (
                <option key={t} value={t}>{activityLabels[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Intervalo</label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {timePresets.map(p => (
                <button
                  key={p.id}
                  onClick={() => setTimeFilter(p.id)}
                  className={`px-2 py-1.5 text-xs rounded border ${timeFilter === p.id ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Busca</label>
            <div className="mt-1 relative">
              <input 
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Usuário, descrição..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm pl-9"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Geral */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-800">Geral</h3>
              <p className="text-xs text-slate-500">Todas as atividades após filtro</p>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum evento encontrado.</p>
            )}
            {filtered.map(item => (
              <ActivityCard key={item.id} activity={item} />
            ))}
          </div>
        </div>

        {/* Por microrregião */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-semibold text-slate-800">Por microrregião</h3>
              <p className="text-xs text-slate-500">Eventos agrupados</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {Object.keys(grouped).length === 0 && (
              <p className="p-4 text-sm text-slate-500">Nenhum evento encontrado.</p>
            )}
            {Object.entries(grouped).map(([microId, items]) => {
              const microNome = microId === 'sem_micro' ? 'Sem microrregião' : (MICROREGIOES.find(m => m.id === microId)?.nome || microId);
              const open = expandedMicros[microId] ?? true;
              return (
                <div key={microId}>
                  <button
                    onClick={() => setExpandedMicros(prev => ({ ...prev, [microId]: !open }))}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-teal-600" />
                      {microNome}
                      <span className="text-xs text-slate-400 font-normal">({items.length})</span>
                    </span>
                    {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>
                  {open && (
                    <div className="px-4 pb-3 space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="p-2 rounded-lg border border-slate-200 bg-white">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <User size={12} className="text-slate-400" />
                              {item.userName}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-slate-800 font-semibold">{activityLabels[item.type]}</div>
                          <div className="text-sm text-slate-600">{item.description}</div>
                          {item.details && (
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.details}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


