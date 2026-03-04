import type { Suggestion } from './userSettings.types';

export const USER_SETTINGS_CATEGORIES = [
  { id: 'zeGotinha', label: 'Ze Gotinha' },
  { id: 'pessoas', label: 'Pessoas' },
  { id: 'emojis', label: 'Emojis' },
  { id: 'robos', label: 'Robos' },
  { id: 'cores', label: 'Cores' },
  { id: 'abstrato', label: 'Abstrato' },
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    authorMunicipality: 'Itabirito',
    title: 'Botao de "Duplicar Acao"',
    description: 'Seria util poder duplicar uma acao existente para ganhar tempo entre unidades diferentes.',
    votes: 42,
    status: 'voting',
    category: 'usability',
    hasVoted: false,
  },
  {
    id: 's2',
    authorMunicipality: 'Ouro Preto',
    title: 'Relatorio PDF por UBS',
    description: 'Precisamos filtrar por unidade para levar nas reunioes locais.',
    votes: 38,
    status: 'under_review',
    category: 'feature',
    hasVoted: true,
  },
  {
    id: 's3',
    authorMunicipality: 'Mariana',
    title: 'Incluir curso de Rondon',
    description: 'O curso feito ano passado nao esta aparecendo no historico.',
    votes: 12,
    status: 'voting',
    category: 'content',
    hasVoted: false,
  },
];
