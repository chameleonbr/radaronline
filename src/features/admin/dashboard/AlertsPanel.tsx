import { useMemo } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  UserX, 
  Shield,
  ChevronRight,
  Calendar,
  MapPin
} from 'lucide-react';
import { Action } from '../../../types';
import { User } from '../../../types/auth.types';
import { getMicroregiaoById } from '../../../data/microregioes';

interface AlertsPanelProps {
  actions: Action[];
  users: User[];
  onViewMicrorregiao: (microId: string) => void;
}

type AlertType = 'atrasada' | 'vencendo' | 'lgpd' | 'inativo';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  microregiaoId?: string;
  microregiaoNome?: string;
  date?: string;
  priority: 'high' | 'medium' | 'low';
}

export function AlertsPanel({ actions, users, onViewMicrorregiao }: AlertsPanelProps) {
  const alerts = useMemo(() => {
    const alertList: Alert[] = [];
    const hoje = new Date();
    const em7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Ações atrasadas
    actions.forEach(action => {
      if (action.status === 'Concluído') return;
      const prazo = new Date(action.plannedEndDate);
      const micro = getMicroregiaoById(action.microregiaoId);
      
      if (prazo < hoje) {
        const diasAtraso = Math.ceil((hoje.getTime() - prazo.getTime()) / (1000 * 60 * 60 * 24));
        alertList.push({
          id: `atrasada-${action.uid}`,
          type: 'atrasada',
          title: action.title,
          description: `${diasAtraso} dia${diasAtraso !== 1 ? 's' : ''} de atraso`,
          microregiaoId: action.microregiaoId,
          microregiaoNome: micro?.nome,
          date: action.plannedEndDate,
          priority: diasAtraso > 30 ? 'high' : diasAtraso > 7 ? 'medium' : 'low',
        });
      } else if (prazo <= em7Dias) {
        const diasRestantes = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        alertList.push({
          id: `vencendo-${action.uid}`,
          type: 'vencendo',
          title: action.title,
          description: `Vence em ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}`,
          microregiaoId: action.microregiaoId,
          microregiaoNome: micro?.nome,
          date: action.plannedEndDate,
          priority: diasRestantes <= 2 ? 'high' : 'medium',
        });
      }
    });

    // Usuários pendentes LGPD
    users.forEach(user => {
      if (user.ativo && !user.lgpdConsentimento) {
        const micro = getMicroregiaoById(user.microregiaoId);
        alertList.push({
          id: `lgpd-${user.id}`,
          type: 'lgpd',
          title: user.nome,
          description: 'LGPD não aceito',
          microregiaoId: user.microregiaoId,
          microregiaoNome: user.microregiaoId === 'all' ? 'Todas' : micro?.nome,
          priority: 'medium',
        });
      }
    });

    // Usuários inativos recentes
    users.forEach(user => {
      if (!user.ativo) {
        alertList.push({
          id: `inativo-${user.id}`,
          type: 'inativo',
          title: user.nome,
          description: 'Conta desativada',
          priority: 'low',
        });
      }
    });

    // Ordenar por prioridade
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return alertList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [actions, users]);

  const alertsByType = useMemo(() => ({
    atrasada: alerts.filter(a => a.type === 'atrasada'),
    vencendo: alerts.filter(a => a.type === 'vencendo'),
    lgpd: alerts.filter(a => a.type === 'lgpd'),
    inativo: alerts.filter(a => a.type === 'inativo'),
  }), [alerts]);

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'atrasada': return <AlertTriangle className="w-4 h-4" />;
      case 'vencendo': return <Clock className="w-4 h-4" />;
      case 'lgpd': return <Shield className="w-4 h-4" />;
      case 'inativo': return <UserX className="w-4 h-4" />;
    }
  };

  const getAlertStyle = (type: AlertType, priority: string) => {
    if (type === 'atrasada') {
      return priority === 'high' 
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-red-50 border-red-100 text-red-600';
    }
    if (type === 'vencendo') {
      return 'bg-amber-50 border-amber-200 text-amber-700';
    }
    if (type === 'lgpd') {
      return 'bg-purple-50 border-purple-200 text-purple-700';
    }
    return 'bg-slate-50 border-slate-200 text-slate-600';
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-800">Central de Alertas</h3>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
            {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-4 gap-3 border-b border-slate-100">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{alertsByType.atrasada.length}</p>
          <p className="text-xs text-red-500 font-medium">Atrasadas</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <p className="text-2xl font-bold text-amber-600">{alertsByType.vencendo.length}</p>
          <p className="text-xs text-amber-500 font-medium">Vencendo</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{alertsByType.lgpd.length}</p>
          <p className="text-xs text-purple-500 font-medium">LGPD</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-2xl font-bold text-slate-600">{alertsByType.inativo.length}</p>
          <p className="text-xs text-slate-500 font-medium">Inativos</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>Nenhum alerta no momento</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.slice(0, 15).map(alert => (
              <div 
                key={alert.id}
                className={`p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                  alert.priority === 'high' ? 'bg-red-50/50' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${getAlertStyle(alert.type, alert.priority)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate" title={alert.title}>
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className={`font-medium ${
                      alert.type === 'atrasada' ? 'text-red-600' :
                      alert.type === 'vencendo' ? 'text-amber-600' :
                      alert.type === 'lgpd' ? 'text-purple-600' : 'text-slate-500'
                    }`}>
                      {alert.description}
                    </span>
                    {alert.date && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(alert.date)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {alert.microregiaoId && alert.type !== 'inativo' && (
                  <button
                    onClick={() => onViewMicrorregiao(alert.microregiaoId!)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="hidden sm:inline">{alert.microregiaoNome}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {alerts.length > 15 && (
        <div className="p-3 border-t border-slate-100 text-center">
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            Ver todos os {alerts.length} alertas
          </button>
        </div>
      )}
    </div>
  );
}




