import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Activity,
  Target,
  BarChart3
} from 'lucide-react';
import { Action, TeamMember } from '../../../types';
import { User } from '../../../types/auth.types';
import { MICROREGIOES } from '../../../data/microregioes';

interface AdminOverviewProps {
  actions: Action[];
  users: User[];
  teams: Record<string, TeamMember[]>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: 'teal' | 'blue' | 'purple' | 'amber' | 'red' | 'green';
}

function MetricCard({ title, value, subtitle, icon, trend, color }: MetricCardProps) {
  const colorStyles = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className="text-sm font-medium text-slate-600 mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function AdminOverview({ actions, users, teams }: AdminOverviewProps) {
  // Calcular métricas
  const metrics = useMemo(() => {
    const totalMicros = MICROREGIOES.length;
    const microsComAcoes = new Set(actions.map(a => a.microregiaoId)).size;
    const microsAtivas = (microsComAcoes / totalMicros) * 100;
    
    const totalAcoes = actions.length;
    const acoesConcluidas = actions.filter(a => a.status === 'Concluído').length;
    const acoesAndamento = actions.filter(a => a.status === 'Em Andamento').length;
    const acoesAtrasadas = actions.filter(a => {
      if (a.status === 'Concluído') return false;
      const hoje = new Date();
      const prazo = new Date(a.plannedEndDate);
      return prazo < hoje;
    }).length;
    const acoesNaoIniciadas = actions.filter(a => a.status === 'Não Iniciado').length;
    
    const progressoMedio = totalAcoes > 0 
      ? Math.round(actions.reduce((sum, a) => sum + a.progress, 0) / totalAcoes)
      : 0;
    
    const usuariosAtivos = users.filter(u => u.ativo).length;
    const usuariosPendentesLgpd = users.filter(u => !u.lgpdConsentimento && u.ativo).length;
    
    const totalEquipe = Object.values(teams).flat().length;

    return {
      totalMicros,
      microsComAcoes,
      microsAtivas: Math.round(microsAtivas),
      totalAcoes,
      acoesConcluidas,
      acoesAndamento,
      acoesAtrasadas,
      acoesNaoIniciadas,
      progressoMedio,
      usuariosAtivos,
      usuariosPendentesLgpd,
      totalEquipe,
    };
  }, [actions, users, teams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Visão Geral do Sistema</h2>
          <p className="text-sm text-slate-500">Métricas em tempo real de todas as microrregiões</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Microrregiões"
          value={metrics.totalMicros}
          subtitle={`${metrics.microsComAcoes} com ações (${metrics.microsAtivas}%)`}
          icon={<MapPin className="w-5 h-5" />}
          color="teal"
        />
        <MetricCard
          title="Total de Ações"
          value={metrics.totalAcoes}
          subtitle={`${metrics.acoesConcluidas} concluídas`}
          icon={<Target className="w-5 h-5" />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Usuários Ativos"
          value={metrics.usuariosAtivos}
          subtitle={metrics.usuariosPendentesLgpd > 0 ? `${metrics.usuariosPendentesLgpd} pendente(s) LGPD` : 'Todos com LGPD'}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Progresso Médio"
          value={`${metrics.progressoMedio}%`}
          subtitle="Todas as ações"
          icon={<BarChart3 className="w-5 h-5" />}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Status das Ações */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700">{metrics.acoesConcluidas}</p>
              <p className="text-sm font-medium text-green-600">Concluídas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{metrics.acoesAndamento}</p>
              <p className="text-sm font-medium text-blue-600">Em Andamento</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-700">{metrics.acoesNaoIniciadas}</p>
              <p className="text-sm font-medium text-amber-600">Não Iniciadas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-700">{metrics.acoesAtrasadas}</p>
              <p className="text-sm font-medium text-red-600">Atrasadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso Visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Distribuição do Status das Ações</h3>
        <div className="h-8 rounded-full overflow-hidden flex bg-slate-100">
          {metrics.totalAcoes > 0 && (
            <>
              <div 
                className="bg-green-500 h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${(metrics.acoesConcluidas / metrics.totalAcoes) * 100}%` }}
              >
                {metrics.acoesConcluidas > 0 && (
                  <span className="text-xs font-bold text-white">{metrics.acoesConcluidas}</span>
                )}
              </div>
              <div 
                className="bg-blue-500 h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${(metrics.acoesAndamento / metrics.totalAcoes) * 100}%` }}
              >
                {metrics.acoesAndamento > 0 && (
                  <span className="text-xs font-bold text-white">{metrics.acoesAndamento}</span>
                )}
              </div>
              <div 
                className="bg-amber-500 h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${(metrics.acoesNaoIniciadas / metrics.totalAcoes) * 100}%` }}
              >
                {metrics.acoesNaoIniciadas > 0 && (
                  <span className="text-xs font-bold text-white">{metrics.acoesNaoIniciadas}</span>
                )}
              </div>
              <div 
                className="bg-red-500 h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${(metrics.acoesAtrasadas / metrics.totalAcoes) * 100}%` }}
              >
                {metrics.acoesAtrasadas > 0 && (
                  <span className="text-xs font-bold text-white">{metrics.acoesAtrasadas}</span>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-600">Concluídas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-600">Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-600">Não Iniciadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">Atrasadas</span>
          </div>
        </div>
      </div>
    </div>
  );
}




