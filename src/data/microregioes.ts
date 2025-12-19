// =====================================
// DADOS OFICIAIS DE MINAS GERAIS
// 16 Macrorregiões, 89 Microrregiões, 853 Municípios
// =====================================

export interface Macrorregiao {
  id: string;
  codigo: string;
  nome: string;
}

export interface Microrregiao {
  id: string;
  codigo: string;
  nome: string;
  macrorregiao: string;
  macroId: string;
  urs: string;
}

export interface Municipio {
  codigo: string;
  nome: string;
  microregiaoId: string;
}

// =====================================
// 16 MACRORREGIÕES
// =====================================
export const MACRORREGIOES: Macrorregiao[] = [
  { id: 'MAC01', codigo: '3101', nome: 'Sul' },
  { id: 'MAC02', codigo: '3102', nome: 'Centro Sul' },
  { id: 'MAC03', codigo: '3103', nome: 'Centro' },
  { id: 'MAC04', codigo: '3104', nome: 'Jequitinhonha' },
  { id: 'MAC05', codigo: '3105', nome: 'Oeste' },
  { id: 'MAC06', codigo: '3106', nome: 'Leste' },
  { id: 'MAC07', codigo: '3107', nome: 'Sudeste' },
  { id: 'MAC08', codigo: '3108', nome: 'Norte' },
  { id: 'MAC09', codigo: '3109', nome: 'Noroeste' },
  { id: 'MAC10', codigo: '3110', nome: 'Leste do Sul' },
  { id: 'MAC11', codigo: '3111', nome: 'Nordeste' },
  { id: 'MAC12', codigo: '3112', nome: 'Triângulo do Sul' },
  { id: 'MAC13', codigo: '3113', nome: 'Triângulo do Norte' },
  { id: 'MAC14', codigo: '3114', nome: 'Vale do Aço' },
  { id: 'MAC15', codigo: '3115', nome: 'Extremo Sul' },
  { id: 'MAC16', codigo: '3116', nome: 'Sudoeste' },
];

// =====================================
// 89 MICRORREGIÕES
// =====================================
export const MICROREGIOES: Microrregiao[] = [
  // SUDOESTE (3116) - 6 microrregiões
  { id: 'MR001', codigo: '31001', nome: 'Alfenas/Machado', macrorregiao: 'Sudoeste', macroId: 'MAC16', urs: 'Alfenas' },
  { id: 'MR002', codigo: '31002', nome: 'Guaxupé', macrorregiao: 'Sudoeste', macroId: 'MAC16', urs: 'Alfenas' },
  { id: 'MR009', codigo: '31009', nome: 'São Sebastião do Paraíso', macrorregiao: 'Sudoeste', macroId: 'MAC16', urs: 'Passos' },
  { id: 'MR091', codigo: '31091', nome: 'Cássia', macrorregiao: 'Sudoeste', macroId: 'MAC16', urs: 'Passos' },
  { id: 'MR092', codigo: '31092', nome: 'Passos', macrorregiao: 'Sudoeste', macroId: 'MAC16', urs: 'Passos' },
  { id: 'MR093', codigo: '31093', nome: 'Piumhi', macrorregiao: 'Sudoeste', macroId: 'MAC16', urs: 'Passos' },
  
  // CENTRO SUL (3102) - 4 microrregiões
  { id: 'MR013', codigo: '31013', nome: 'Barbacena', macrorregiao: 'Centro Sul', macroId: 'MAC02', urs: 'Barbacena' },
  { id: 'MR015', codigo: '31015', nome: 'São João Del Rei', macrorregiao: 'Centro Sul', macroId: 'MAC02', urs: 'São João Del Rei' },
  { id: 'MR078', codigo: '31078', nome: 'Congonhas', macrorregiao: 'Centro Sul', macroId: 'MAC02', urs: 'Barbacena' },
  { id: 'MR079', codigo: '31079', nome: 'Conselheiro Lafaiete', macrorregiao: 'Centro Sul', macroId: 'MAC02', urs: 'Barbacena' },
  
  // CENTRO (3103) - 10 microrregiões
  { id: 'MR016', codigo: '31016', nome: 'Belo Horizonte/Nova Lima/Santa Luzia', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Belo Horizonte' },
  { id: 'MR017', codigo: '31017', nome: 'Betim', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Belo Horizonte' },
  { id: 'MR018', codigo: '31018', nome: 'Contagem', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Belo Horizonte' },
  { id: 'MR019', codigo: '31019', nome: 'Curvelo', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Sete Lagoas' },
  { id: 'MR020', codigo: '31020', nome: 'Guanhães', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Itabira' },
  { id: 'MR021', codigo: '31021', nome: 'Itabira', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Itabira' },
  { id: 'MR022', codigo: '31022', nome: 'Ouro Preto', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Belo Horizonte' },
  { id: 'MR023', codigo: '31023', nome: 'João Monlevade', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Itabira' },
  { id: 'MR024', codigo: '31024', nome: 'Sete Lagoas', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Sete Lagoas' },
  { id: 'MR025', codigo: '31025', nome: 'Vespasiano/Lagoa Santa', macrorregiao: 'Centro', macroId: 'MAC03', urs: 'Belo Horizonte' },
  
  // VALE DO AÇO (3114) - 3 microrregiões
  { id: 'MR034', codigo: '31034', nome: 'Caratinga', macrorregiao: 'Vale do Aço', macroId: 'MAC14', urs: 'Coronel Fabriciano' },
  { id: 'MR035', codigo: '31035', nome: 'Coronel Fabriciano/Timóteo', macrorregiao: 'Vale do Aço', macroId: 'MAC14', urs: 'Coronel Fabriciano' },
  { id: 'MR037', codigo: '31037', nome: 'Ipatinga', macrorregiao: 'Vale do Aço', macroId: 'MAC14', urs: 'Coronel Fabriciano' },
  
  // JEQUITINHONHA (3104) - 4 microrregiões
  { id: 'MR026', codigo: '31026', nome: 'Diamantina/Itamarandiba', macrorregiao: 'Jequitinhonha', macroId: 'MAC04', urs: 'Diamantina' },
  { id: 'MR027', codigo: '31027', nome: 'Turmalina/Minas Novas/Capelinha', macrorregiao: 'Jequitinhonha', macroId: 'MAC04', urs: 'Diamantina' },
  { id: 'MR064', codigo: '31064', nome: 'Araçuaí', macrorregiao: 'Jequitinhonha', macroId: 'MAC04', urs: 'Diamantina' },
  { id: 'MR095', codigo: '31095', nome: 'Serro', macrorregiao: 'Jequitinhonha', macroId: 'MAC04', urs: 'Diamantina' },
  
  // OESTE (3105) - 8 microrregiões
  { id: 'MR028', codigo: '31028', nome: 'Bom Despacho', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR030', codigo: '31030', nome: 'Formiga', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR031', codigo: '31031', nome: 'Itaúna', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR032', codigo: '31032', nome: 'Pará de Minas/Nova Serrana', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR086', codigo: '31086', nome: 'Divinópolis', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR087', codigo: '31087', nome: 'Lagoa da Prata/Santo Antônio do Monte', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR088', codigo: '31088', nome: 'Oliveira/Santo Antônio do Amparo', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  { id: 'MR089', codigo: '31089', nome: 'Campo Belo', macrorregiao: 'Oeste', macroId: 'MAC05', urs: 'Divinópolis' },
  
  // LESTE (3106) - 4 microrregiões
  { id: 'MR036', codigo: '31036', nome: 'Governador Valadares', macrorregiao: 'Leste', macroId: 'MAC06', urs: 'Governador Valadares' },
  { id: 'MR038', codigo: '31038', nome: 'Mantena', macrorregiao: 'Leste', macroId: 'MAC06', urs: 'Governador Valadares' },
  { id: 'MR040', codigo: '31040', nome: 'Resplendor', macrorregiao: 'Leste', macroId: 'MAC06', urs: 'Governador Valadares' },
  { id: 'MR102', codigo: '31102', nome: 'Peçanha/São João Evangelista/Santa Maria do Suaçuí', macrorregiao: 'Leste', macroId: 'MAC06', urs: 'Governador Valadares' },
  
  // TRIÂNGULO DO NORTE (3113) - 3 microrregiões
  { id: 'MR073', codigo: '31073', nome: 'Ituiutaba', macrorregiao: 'Triângulo do Norte', macroId: 'MAC13', urs: 'Ituiutaba' },
  { id: 'MR074', codigo: '31074', nome: 'Patrocínio/Monte Carmelo', macrorregiao: 'Triângulo do Norte', macroId: 'MAC13', urs: 'Uberlândia' },
  { id: 'MR075', codigo: '31075', nome: 'Uberlândia/Araguari', macrorregiao: 'Triângulo do Norte', macroId: 'MAC13', urs: 'Uberlândia' },
  
  // NORTE (3108) - 12 microrregiões
  { id: 'MR050', codigo: '31050', nome: 'Coração de Jesus', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR051', codigo: '31051', nome: 'Francisco Sá', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR052', codigo: '31052', nome: 'Janaúba/Monte Azul', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR053', codigo: '31053', nome: 'Januária', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Januária' },
  { id: 'MR055', codigo: '31055', nome: 'Pirapora', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Pirapora' },
  { id: 'MR076', codigo: '31076', nome: 'Manga', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Januária' },
  { id: 'MR083', codigo: '31083', nome: 'Bocaiúva', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR084', codigo: '31084', nome: 'Montes Claros', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR085', codigo: '31085', nome: 'Taiobeiras', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR098', codigo: '31098', nome: 'Salinas', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Montes Claros' },
  { id: 'MR100', codigo: '31100', nome: 'São Francisco', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Januária' },
  { id: 'MR101', codigo: '31101', nome: 'Brasília de Minas', macrorregiao: 'Norte', macroId: 'MAC08', urs: 'Januária' },
  
  // SUDESTE (3107) - 9 microrregiões
  { id: 'MR041', codigo: '31041', nome: 'Além Paraíba', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Leopoldina' },
  { id: 'MR042', codigo: '31042', nome: 'Carangola', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Manhuaçu' },
  { id: 'MR044', codigo: '31044', nome: 'Leopoldina/Cataguases', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Leopoldina' },
  { id: 'MR045', codigo: '31045', nome: 'Muriaé', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Ubá' },
  { id: 'MR046', codigo: '31046', nome: 'Santos Dumont', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Juiz de Fora' },
  { id: 'MR047', codigo: '31047', nome: 'São João Nepomuceno/Bicas', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Juiz de Fora' },
  { id: 'MR048', codigo: '31048', nome: 'Ubá', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Ubá' },
  { id: 'MR090', codigo: '31090', nome: 'Lima Duarte', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Juiz de Fora' },
  { id: 'MR097', codigo: '31097', nome: 'Juiz de Fora', macrorregiao: 'Sudeste', macroId: 'MAC07', urs: 'Juiz de Fora' },
  
  // LESTE DO SUL (3110) - 3 microrregiões
  { id: 'MR059', codigo: '31059', nome: 'Manhuaçu', macrorregiao: 'Leste do Sul', macroId: 'MAC10', urs: 'Manhuaçu' },
  { id: 'MR060', codigo: '31060', nome: 'Ponte Nova', macrorregiao: 'Leste do Sul', macroId: 'MAC10', urs: 'Ponte Nova' },
  { id: 'MR061', codigo: '31061', nome: 'Viçosa', macrorregiao: 'Leste do Sul', macroId: 'MAC10', urs: 'Ponte Nova' },
  
  // NOROESTE (3109) - 4 microrregiões
  { id: 'MR057', codigo: '31057', nome: 'Patos de Minas', macrorregiao: 'Noroeste', macroId: 'MAC09', urs: 'Patos de Minas' },
  { id: 'MR058', codigo: '31058', nome: 'Unaí/Paracatu', macrorregiao: 'Noroeste', macroId: 'MAC09', urs: 'Unaí' },
  { id: 'MR077', codigo: '31077', nome: 'João Pinheiro', macrorregiao: 'Noroeste', macroId: 'MAC09', urs: 'Patos de Minas' },
  { id: 'MR082', codigo: '31082', nome: 'São Gotardo', macrorregiao: 'Noroeste', macroId: 'MAC09', urs: 'Patos de Minas' },
  
  // NORDESTE (3111) - 8 microrregiões
  { id: 'MR062', codigo: '31062', nome: 'Águas Formosas', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Teófilo Otoni' },
  { id: 'MR065', codigo: '31065', nome: 'Itaobim', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Pedra Azul' },
  { id: 'MR066', codigo: '31066', nome: 'Nanuque', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Teófilo Otoni' },
  { id: 'MR067', codigo: '31067', nome: 'Padre Paraíso', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Teófilo Otoni' },
  { id: 'MR068', codigo: '31068', nome: 'Pedra Azul', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Pedra Azul' },
  { id: 'MR094', codigo: '31094', nome: 'Almenara/Jacinto', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Pedra Azul' },
  { id: 'MR096', codigo: '31096', nome: 'Itambacuri', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Teófilo Otoni' },
  { id: 'MR099', codigo: '31099', nome: 'Teófilo Otoni/Malacacheta', macrorregiao: 'Nordeste', macroId: 'MAC11', urs: 'Teófilo Otoni' },
  
  // TRIÂNGULO DO SUL (3112) - 3 microrregiões
  { id: 'MR070', codigo: '31070', nome: 'Araxá', macrorregiao: 'Triângulo do Sul', macroId: 'MAC12', urs: 'Uberaba' },
  { id: 'MR071', codigo: '31071', nome: 'Frutal/Iturama', macrorregiao: 'Triângulo do Sul', macroId: 'MAC12', urs: 'Uberaba' },
  { id: 'MR072', codigo: '31072', nome: 'Uberaba', macrorregiao: 'Triângulo do Sul', macroId: 'MAC12', urs: 'Uberaba' },
  
  // EXTREMO SUL (3115) - 3 microrregiões
  { id: 'MR003', codigo: '31003', nome: 'Itajubá', macrorregiao: 'Extremo Sul', macroId: 'MAC15', urs: 'Pouso Alegre' },
  { id: 'MR006', codigo: '31006', nome: 'Poços de Caldas', macrorregiao: 'Extremo Sul', macroId: 'MAC15', urs: 'Pouso Alegre' },
  { id: 'MR007', codigo: '31007', nome: 'Pouso Alegre', macrorregiao: 'Extremo Sul', macroId: 'MAC15', urs: 'Pouso Alegre' },
  
  // SUL (3101) - 5 microrregiões
  { id: 'MR004', codigo: '31004', nome: 'Lavras', macrorregiao: 'Sul', macroId: 'MAC01', urs: 'Varginha' },
  { id: 'MR008', codigo: '31008', nome: 'São Lourenço', macrorregiao: 'Sul', macroId: 'MAC01', urs: 'Varginha' },
  { id: 'MR010', codigo: '31010', nome: 'Três Corações', macrorregiao: 'Sul', macroId: 'MAC01', urs: 'Varginha' },
  { id: 'MR011', codigo: '31011', nome: 'Três Pontas', macrorregiao: 'Sul', macroId: 'MAC01', urs: 'Varginha' },
  { id: 'MR012', codigo: '31012', nome: 'Varginha', macrorregiao: 'Sul', macroId: 'MAC01', urs: 'Varginha' },
];

// =====================================
// MUNICÍPIOS - Importados do arquivo municipios.ts
// =====================================
import { TODOS_MUNICIPIOS } from './municipios';

export const MUNICIPIOS: Municipio[] = TODOS_MUNICIPIOS;

// =====================================
// FUNÇÕES AUXILIARES
// =====================================

export function getMicroregiaoById(id: string): Microrregiao | undefined {
  return MICROREGIOES.find(m => m.id === id);
}

export function getMicroregiaoByCodigo(codigo: string): Microrregiao | undefined {
  return MICROREGIOES.find(m => m.codigo === codigo);
}

export function getMacrorregioes(): string[] {
  return [...new Set(MICROREGIOES.map(m => m.macrorregiao))].sort();
}

export function getMicroregioesByMacro(macrorregiao: string): Microrregiao[] {
  return MICROREGIOES.filter(m => m.macrorregiao === macrorregiao);
}

export function getMunicipiosByMicro(microregiaoId: string): Municipio[] {
  return MUNICIPIOS.filter(m => m.microregiaoId === microregiaoId);
}

export function getMunicipioByCode(codigo: string): Municipio | undefined {
  return MUNICIPIOS.find(m => m.codigo === codigo);
}

export function searchMunicipios(termo: string): Municipio[] {
  const termoLower = termo.toLowerCase();
  return MUNICIPIOS.filter(m => 
    m.nome.toLowerCase().includes(termoLower) ||
    m.codigo.includes(termo)
  );
}

export function getMacroById(id: string): Macrorregiao | undefined {
  return MACRORREGIOES.find(m => m.id === id);
}

// =====================================
// ESTATÍSTICAS
// =====================================
export const STATS = {
  totalMacrorregioes: MACRORREGIOES.length,
  totalMicroregioes: MICROREGIOES.length,
  totalMunicipios: MUNICIPIOS.length,
};




