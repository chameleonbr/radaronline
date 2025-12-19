import { useState } from 'react';
import { Shield, CheckCircle, FileText, Lock } from 'lucide-react';
import { useAuth } from '../../auth';

interface LgpdConsentProps {
  onAccepted?: () => void;
}

export function LgpdConsent(props: LgpdConsentProps) {
  const { onAccepted } = props;
  const { user, acceptLgpd, logout } = useAuth();
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = acceptedTerms && acceptedPrivacy;

  const handleAccept = async () => {
    if (!canContinue) return;
    
    setIsLoading(true);
    await acceptLgpd();
    setIsLoading(false);
    onAccepted?.();
  };

  const handleReject = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-4">
      {/* Padrão de fundo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Termos de Uso e Privacidade
          </h1>
          <p className="text-slate-400">
            Olá, <span className="text-teal-400 font-medium">{user?.nome}</span>! 
            Para continuar, leia e aceite os termos abaixo.
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Seção: Termos de Uso */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Termos de Uso</h3>
                <div className="text-sm text-slate-300 space-y-2 max-h-32 overflow-y-auto pr-2">
                  <p>
                    Ao utilizar o sistema RADAR 2.0, você concorda com as seguintes condições:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Utilizar o sistema apenas para fins profissionais relacionados às suas funções</li>
                    <li>Manter a confidencialidade das informações acessadas</li>
                    <li>Não compartilhar suas credenciais de acesso</li>
                    <li>Reportar qualquer uso indevido ou vulnerabilidade identificada</li>
                    <li>Estar ciente de que todas as ações são registradas para auditoria</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Checkbox */}
            <label className="flex items-center gap-3 mt-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center
                  ${acceptedTerms 
                    ? 'bg-teal-500 border-teal-500' 
                    : 'border-slate-500 group-hover:border-teal-400'
                  }`}
                >
                  {acceptedTerms && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                Li e aceito os <strong className="text-teal-400">Termos de Uso</strong>
              </span>
            </label>
          </div>

          {/* Seção: Política de Privacidade (LGPD) */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Política de Privacidade (LGPD)
                </h3>
                <div className="text-sm text-slate-300 space-y-2 max-h-32 overflow-y-auto pr-2">
                  <p>
                    Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Coletamos apenas os dados necessários para o funcionamento do sistema</li>
                    <li>Seus dados pessoais são protegidos e não são compartilhados com terceiros</li>
                    <li>Você tem direito de acessar, corrigir ou solicitar exclusão dos seus dados</li>
                    <li>Registramos logs de acesso para fins de segurança e auditoria</li>
                    <li>Os dados são armazenados em servidores seguros</li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-2">
                    Controlador de dados: Secretaria de Estado de Saúde de Minas Gerais
                  </p>
                </div>
              </div>
            </div>
            
            {/* Checkbox */}
            <label className="flex items-center gap-3 mt-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center
                  ${acceptedPrivacy 
                    ? 'bg-teal-500 border-teal-500' 
                    : 'border-slate-500 group-hover:border-teal-400'
                  }`}
                >
                  {acceptedPrivacy && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                Li e aceito a <strong className="text-purple-400">Política de Privacidade</strong>
              </span>
            </label>
          </div>

          {/* Botões */}
          <div className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
            <button
              onClick={handleReject}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
            >
              Não aceito
            </button>
            <button
              onClick={handleAccept}
              disabled={!canContinue || isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Aceitar e Continuar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <p className="mt-6 text-center text-slate-500 text-xs">
          Dúvidas? Entre em contato com o administrador do sistema.
        </p>
      </div>
    </div>
  );
}




