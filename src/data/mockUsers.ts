import { User } from '../types/auth.types';

// =====================================
// USUÁRIOS MOCK PARA DESENVOLVIMENTO
// Senha padrão para todos: "teste123"
// =====================================

export const MOCK_USERS: User[] = [
  {
    id: 'usr_001',
    email: 'admin@saude.mg.gov.br',
    nome: 'Administrador Sistema',
    role: 'admin',
    microregiaoId: 'all', // Admin pode ver todas
    ativo: true,
    lgpdConsentimento: true,
    lgpdConsentimentoData: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatarId: 'p22',
  },
  {
    id: 'usr_002',
    email: 'gestor.pocos@saude.mg.gov.br',
    nome: 'Maria Silva',
    role: 'gestor',
    microregiaoId: 'MR009', // Poços de Caldas
    ativo: true,
    lgpdConsentimento: true,
    lgpdConsentimentoData: '2024-06-15T10:30:00Z',
    createdAt: '2024-06-15T10:30:00Z',
    createdBy: 'usr_001',
    avatarId: 'p1',
  },
  {
    id: 'usr_003',
    email: 'usuario.pocos@saude.mg.gov.br',
    nome: 'João Santos',
    role: 'usuario',
    microregiaoId: 'MR009', // Poços de Caldas
    ativo: true,
    lgpdConsentimento: true,
    lgpdConsentimentoData: '2024-07-20T14:00:00Z',
    createdAt: '2024-07-20T14:00:00Z',
    createdBy: 'usr_001',
    avatarId: 'p2',
  },
  {
    id: 'usr_004',
    email: 'gestor.varginha@saude.mg.gov.br',
    nome: 'Ana Oliveira',
    role: 'gestor',
    microregiaoId: 'MR010', // Varginha
    ativo: true,
    lgpdConsentimento: false, // Precisa aceitar LGPD
    createdAt: '2024-08-01T09:00:00Z',
    createdBy: 'usr_001',
    avatarId: 'p3',
  },
  {
    id: 'usr_005',
    email: 'usuario.bh@saude.mg.gov.br',
    nome: 'Carlos Pereira',
    role: 'usuario',
    microregiaoId: 'MR001', // Belo Horizonte
    ativo: true,
    lgpdConsentimento: true,
    lgpdConsentimentoData: '2024-09-10T11:00:00Z',
    createdAt: '2024-09-10T11:00:00Z',
    createdBy: 'usr_001',
    avatarId: 'p4',
  },
  {
    id: 'usr_006',
    email: 'inativo@saude.mg.gov.br',
    nome: 'Usuário Inativo',
    role: 'usuario',
    microregiaoId: 'MR020', // Uberlândia
    ativo: false, // Conta desativada
    lgpdConsentimento: true,
    lgpdConsentimentoData: '2024-05-01T08:00:00Z',
    createdAt: '2024-05-01T08:00:00Z',
    createdBy: 'usr_001',
    avatarId: 'p5',
  },
];

// Senha padrão para testes
export const MOCK_PASSWORD = 'teste123';

// Mapa de senhas por ID de usuário (mock - em produção usar hash no banco)
export const USER_PASSWORDS: Record<string, string> = {
  'usr_001': MOCK_PASSWORD,
  'usr_002': MOCK_PASSWORD,
  'usr_003': MOCK_PASSWORD,
  'usr_004': MOCK_PASSWORD,
  'usr_005': MOCK_PASSWORD,
  'usr_006': MOCK_PASSWORD,
};

// Helper: definir senha de usuário
export function setUserPassword(userId: string, senha: string): void {
  USER_PASSWORDS[userId] = senha;
}

// Helper: obter senha de usuário
export function getUserPassword(userId: string): string | undefined {
  return USER_PASSWORDS[userId];
}

// Helper: buscar usuário por email
export function findUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Helper: validar credenciais (mock)
export function validateCredentials(email: string, senha: string): { success: boolean; user?: User; error?: string } {
  const user = findUserByEmail(email);

  if (!user) {
    // Mensagem genérica por segurança
    return { success: false, error: 'Email ou senha incorretos' };
  }

  const userPassword = USER_PASSWORDS[user.id] || MOCK_PASSWORD;

  if (senha !== userPassword) {
    return { success: false, error: 'Email ou senha incorretos' };
  }

  if (!user.ativo) {
    return { success: false, error: 'Conta desativada. Entre em contato com o administrador.' };
  }

  return { success: true, user };
}




