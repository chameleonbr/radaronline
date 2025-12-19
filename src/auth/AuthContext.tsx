import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthContextType, Microrregiao } from '../types/auth.types';
import { getMicroregiaoById } from '../data/microregioes';
import { supabase } from '../lib/supabase';
import * as authService from '../services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingMicroregiaoId, setViewingMicroregiaoId] = useState<string | null>(null);

  // ✅ FASE 1: Cache de perfis com TTL (1 minuto)
  const profileCache = new Map<string, { profile: User; timestamp: number }>();
  const CACHE_TTL = 60000; // 1 minuto
  let queryCount = 0; // Contador de queries para monitoramento

  /**
   * Carrega perfil do usuário do Supabase com cache
   * Retorna null se usuário não encontrado ou inativo
   * 
   * PADRÃO: Converte null do DB para 'all' no app (consistência)
   */
  const loadUserProfile = useCallback(async (userId: string, useCache = true): Promise<User | null> => {
    // ✅ FASE 1: Verificar cache primeiro
    if (useCache) {
      const cached = profileCache.get(userId);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[AuthContext] Cache HIT para userId: ${userId}`);
        return cached.profile;
      }
    }

    // ✅ FASE 1: Logging de queries
    queryCount++;
    console.log(`[AuthContext] Query #${queryCount} - loadUserProfile(${userId})${useCache ? ' [CACHE MISS]' : ' [FORCE REFRESH]'}`);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, role, microregiao_id, ativo, lgpd_consentimento, lgpd_consentimento_data, created_by, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthContext] Erro ao carregar perfil:', error);
        return null;
      }

      if (!data) {
        console.warn('[AuthContext] Perfil não encontrado para usuário:', userId);
        return null;
      }

      if (!data.ativo) {
        console.warn('[AuthContext] Usuário inativo:', userId);
        return null;
      }

      // Converter snake_case para camelCase
      // ✅ PADRÃO: null do DB vira 'all' no app
      const profile: User = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        role: data.role,
        microregiaoId: data.microregiao_id || 'all', // null → 'all'
        ativo: data.ativo,
        lgpdConsentimento: data.lgpd_consentimento,
        lgpdConsentimentoData: data.lgpd_consentimento_data || undefined,
        createdBy: data.created_by || undefined,
        createdAt: data.created_at,
      };

      // ✅ FASE 1: Salvar no cache
      if (useCache) {
        profileCache.set(userId, { profile, timestamp: Date.now() });
      }

      return profile;
    } catch (error) {
      console.error('[AuthContext] Erro inesperado ao carregar perfil:', error);
      return null;
    }
  }, []);

  // ✅ FASE 1: Função para invalidar cache (útil quando perfil é atualizado)
  // Exportada para uso futuro quando perfil for atualizado externamente
  // const invalidateProfileCache = useCallback((userId: string) => {
  //   profileCache.delete(userId);
  //   console.log(`[AuthContext] Cache invalidado para userId: ${userId}`);
  // }, []);

  // Inicializa sessão ao montar componente
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // ✅ CORREÇÃO: Helper para resetar loading e limpar timeout (DRY)
    const resetLoading = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mounted) setIsLoading(false);
    };

    // ✅ CORREÇÃO: Timeout de segurança para evitar loading infinito (10s)
    timeoutId = setTimeout(() => {
      console.warn('[AuthContext] Timeout ao carregar sessão - resetando loading');
      resetLoading();
    }, 10000);

    // Verifica sessão atual
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('[AuthContext] Erro ao obter sessão:', error);
        resetLoading();
        return;
      }

      if (session?.user) {
        const profile = await loadUserProfile(session.user.id);
        
        if (!mounted) {
          resetLoading();
          return;
        }
        
        // ✅ CORREÇÃO: Se perfil não encontrado ou inativo, fazer logout automático
        if (!profile || !profile.ativo) {
          console.warn('[AuthContext] Sessão encontrada mas perfil inválido/inativo - fazendo logout');
          await supabase.auth.signOut();
          setUser(null);
          setViewingMicroregiaoId(null);
          resetLoading();
          return;
        }
        
        setUser(profile);
        const microId = profile.microregiaoId === 'all' ? null : profile.microregiaoId;
        setViewingMicroregiaoId(microId);
        resetLoading();
      } else {
        resetLoading();
      }
    }).catch((error) => {
      // ✅ CORREÇÃO: Catch de erros não tratados
      console.error('[AuthContext] Erro inesperado ao obter sessão:', error);
      resetLoading();
    });

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await loadUserProfile(session.user.id);
        
        // Verifica se está ativo antes de permitir login
        if (!profile || !profile.ativo) {
          console.warn('[AuthContext] Tentativa de login com usuário inativo ou não encontrado');
          await supabase.auth.signOut();
          resetLoading(); // ✅ CORREÇÃO: Resetar loading após logout
          return;
        }

        setUser(profile);
        const microId = profile.microregiaoId === 'all' ? null : profile.microregiaoId;
        setViewingMicroregiaoId(microId);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setViewingMicroregiaoId(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Atualiza perfil se necessário (pode ter mudado enquanto estava logado)
        // ✅ FASE 1: Forçar refresh no TOKEN_REFRESHED para pegar mudanças
        const profile = await loadUserProfile(session.user.id, false);
        
        // ✅ CORREÇÃO: Se perfil não encontrado ou inativo após refresh, fazer logout
        if (!profile || !profile.ativo) {
          console.warn('[AuthContext] Perfil inválido após refresh - fazendo logout');
          await supabase.auth.signOut();
          setUser(null);
          setViewingMicroregiaoId(null);
        } else {
          setUser(profile);
        }
      }

      resetLoading(); // ✅ CORREÇÃO: Usa helper para consistência
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  // Login
  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error('[AuthContext] Erro no login:', error);
        return { 
          success: false, 
          error: error.message === 'Invalid login credentials' 
            ? 'Email ou senha incorretos' 
            : error.message 
        };
      }

      if (data.user) {
        const profile = await loadUserProfile(data.user.id);
        
        if (!profile) {
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'Conta desativada. Entre em contato com o administrador.' 
          };
        }

        setUser(profile);
        const microId = profile.microregiaoId === 'all' ? null : profile.microregiaoId;
        setViewingMicroregiaoId(microId);
        
        return { success: true };
      }

      return { success: false, error: 'Erro ao fazer login' };
    } catch (error: any) {
      console.error('[AuthContext] Erro inesperado no login:', error);
      return { success: false, error: error.message || 'Erro ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setViewingMicroregiaoId(null);
    } catch (error) {
      console.error('[AuthContext] Erro ao fazer logout:', error);
    }
  }, []);

  // Aceitar LGPD
  const acceptLgpd = useCallback(async () => {
    if (!user) {
      console.warn('[AuthContext] Tentativa de aceitar LGPD sem usuário logado');
      return;
    }
    
    try {
      await authService.acceptLgpd(user.id);
      setUser(prev => prev ? {
        ...prev,
        lgpdConsentimento: true,
        lgpdConsentimentoData: new Date().toISOString(),
      } : null);
    } catch (error) {
      console.error('[AuthContext] Erro ao aceitar LGPD:', error);
      throw error; // Propaga erro para o componente tratar
    }
  }, [user]);

  // Trocar microrregião visualizada (apenas admin)
  const setViewingMicrorregiao = useCallback((microregiaoId: string) => {
    if (user?.role !== 'admin') {
      console.warn('[AuthContext] Apenas admins podem trocar microrregião visualizada');
      return;
    }
    setViewingMicroregiaoId(microregiaoId === 'all' ? null : microregiaoId);
  }, [user]);

  // Computed values
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';
  
  // Microrregião atual (a que está sendo visualizada)
  // Verifica se existe no array de microrregiões antes de retornar
  const currentMicrorregiao: Microrregiao | null = viewingMicroregiaoId 
    ? getMicroregiaoById(viewingMicroregiaoId) || null
    : user?.microregiaoId && user.microregiaoId !== 'all'
      ? getMicroregiaoById(user.microregiaoId) || null
      : null;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    currentMicrorregiao,
    login,
    logout,
    acceptLgpd,
    setViewingMicrorregiao,
    viewingMicroregiaoId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

export { AuthContext };
