import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Shield, MapPin, ChevronDown, Lock, Eye, EyeOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { User, UserRole } from '../../types/auth.types';
import { MICROREGIOES, getMacrorregioes } from '../../data/microregioes';
import { log, logError } from '../../lib/logger';

type UserFormModalProps = {
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => Promise<void>;
  isSaving?: boolean;
};

export function UserFormModal({ user, onClose, onSave, isSaving = false }: UserFormModalProps) {
  const isEditing = user !== null;
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    senha: '',
    role: user?.role || 'usuario' as UserRole,
    microregiaoId: user?.microregiaoId || '',
    ativo: user?.ativo ?? true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterMacro, setFilterMacro] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmGenerate, setShowConfirmGenerate] = useState(false);
  const saving = isSaving || isLoading;

  const filteredMicroregioes = MICROREGIOES.filter(m => 
    filterMacro === 'all' || m.macrorregiao === filterMacro
  );

  // Gerador de senha automático
  const generatePassword = () => {
    const palavras = [
      'radar', 'micro', 'gestao', 'saude', 'relatorio', 'acao', 'equipe',
      'projeto', 'objetivo', 'metrica', 'indicador', 'dashboard', 'painel',
      'sistema', 'usuario', 'admin', 'monitor', 'controle', 'planejamento',
      'execucao', 'resultado', 'impacto', 'eficiencia', 'qualidade', 'atencao',
      'prevencao', 'promocao', 'vigilancia', 'epidemiologia', 'assistencia',
      'regulacao', 'gestor', 'coordenador', 'supervisor', 'tecnico', 'analista'
    ];
    
    const palavraAleatoria = palavras[Math.floor(Math.random() * palavras.length)];
    const numeroAleatorio = Math.floor(Math.random() * 99) + 1;
    const numeroFormatado = numeroAleatorio.toString().padStart(2, '0');
    
    return `${palavraAleatoria}@${numeroFormatado}`;
  };

  const handleGeneratePassword = () => {
    setShowConfirmGenerate(true);
  };

  const confirmGeneratePassword = () => {
    const novaSenha = generatePassword();
    setFormData(prev => ({ ...prev, senha: novaSenha }));
    setShowConfirmGenerate(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    // Validações
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
 
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    // ✅ CORREÇÃO: Validar formato de email no frontend (fail-fast)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Formato de email inválido');
      return;
    }

    // ✅ CORREÇÃO: Validar senha apenas na criação
    if (!isEditing && !formData.senha.trim()) {
      setError('Senha é obrigatória para novos usuários');
      return;
    }
 
    // ✅ CORREÇÃO: Validar microrregião para não-admins
    if (formData.role !== 'admin' && !formData.microregiaoId) {
      setError('Microrregião é obrigatória para usuários não-admin');
      return;
    }
    setError('');
    setIsLoading(true);
 
    try {
      const userData: any = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        role: formData.role,
        microregiaoId: formData.role === 'admin' ? 'all' : formData.microregiaoId,
        ativo: formData.ativo,
        lgpdConsentimento: user?.lgpdConsentimento ?? false,
      };
     
      // ✅ CORREÇÃO: Incluir senha apenas se foi preenchida
      if (formData.senha.trim()) {
        userData.senha = formData.senha.trim();
      }
     
      log('[UserFormModal]', 'Chamando onSave...');
      await onSave(userData);
      log('[UserFormModal]', 'onSave concluído');
      // ✅ Fechar modal apenas se não houver erro (o AdminPanel já fecha)
    } catch (err: any) {
      logError('[UserFormModal]', 'Erro capturado:', err);
      setError(err?.message || 'Erro desconhecido. Tente novamente ou contate o suporte.');
      // ✅ Não fechar modal em caso de erro
    } finally {
      setIsLoading(false);
      log('[UserFormModal]', 'Loading resetado');
    }
  };

  return (
    <React.Fragment>
      {/* Modal de confirmação para gerar senha */}
      {showConfirmGenerate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Gerar nova senha?
                  </h3>
                  <p className="text-sm text-slate-600 mb-1">
                    {isEditing ? (
                      <span>
                        Você está prestes a <span className="font-semibold text-amber-600">alterar a senha</span> deste usuário.
                        <br />
                        <br />
                        A senha atual será <span className="font-semibold">substituída</span> por uma nova senha gerada automaticamente.
                        <br />
                        <br />
                        Tem certeza que deseja continuar?
                      </span>
                    ) : (
                      <span>
                        Uma nova senha será gerada automaticamente para este usuário.
                        <br />
                        <br />
                        A senha seguirá o formato: <span className="font-mono text-teal-600 font-semibold">palavra@número</span>
                        <br />
                        <br />
                        Deseja continuar?
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowConfirmGenerate(false)}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmGeneratePassword}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Sim, gerar senha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal principal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          </div>

          {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Nome completo *
              </span>
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do usuário"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@gov.mg.br"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Senha */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha {!isEditing && '*'}
                </span>
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                title="Gerar senha automática"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Gerar senha
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.senha}
                onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                placeholder={isEditing ? "Deixe em branco para manter a senha atual" : "Defina uma senha para o usuário"}
                className="w-full px-4 py-2.5 pr-20 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {isEditing && (
              <p className="mt-1.5 text-xs text-slate-500">
                Deixe em branco para manter a senha atual
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Nível de acesso *
              </span>
            </label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                className="w-full appearance-none px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="usuario">Usuário</option>
                <option value="gestor">Gestor</option>
                <option value="admin">Administrador</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {formData.role === 'admin' && 'Acesso total a todas as microrregiões e configurações'}
              {formData.role === 'gestor' && 'Pode criar e gerenciar ações na sua microrregião'}
              {formData.role === 'usuario' && 'Acesso limitado baseado no papel RACI'}
            </p>
          </div>

          {/* Microrregião (não aparece para admin) */}
          {formData.role !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Microrregião *
                </span>
              </label>
              
              {/* Filtro por macrorregião */}
              <div className="mb-2">
                <select
                  value={filterMacro}
                  onChange={(e) => setFilterMacro(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">Filtrar por macrorregião...</option>
                  {getMacrorregioes().map(macro => (
                    <option key={macro} value={macro}>{macro}</option>
                  ))}
                </select>
              </div>
              
              {/* Lista de microrregiões */}
              <div className="relative">
                <select
                  value={formData.microregiaoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, microregiaoId: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecione uma microrregião</option>
                  {filteredMicroregioes.map(micro => (
                    <option key={micro.id} value={micro.id}>
                      {micro.nome} ({micro.macrorregiao})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Status (apenas para edição) */}
          {isEditing && (
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Usuário ativo
                </span>
              </label>
              <p className="mt-1 text-xs text-slate-500 ml-8">
                Usuários inativos não conseguem fazer login
              </p>
            </div>
          )}
        </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors disabled:opacity-50"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              isEditing ? 'Salvar alterações' : 'Criar usuário'
            )}
          </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}



