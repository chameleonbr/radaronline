export interface AnalystMapping {
    name: string;
    shortName: string;
    avatarUrl?: string; // Placeholder for now
    color: string;
    macros: string[];
}

export const ANALYSTS: AnalystMapping[] = [
    {
        name: 'Jonathan Souza',
        shortName: 'Jonathan',
        color: 'bg-blue-500',
        macros: [
            'EXTREMO SUL',
            'CENTRO SUL',
            'OESTE',
            'SUDOESTE',
            'SUL',
            'TRIÂNGULO DO SUL'
        ]
    },
    {
        name: 'Gabrielle Guimarães Gonçalves',
        shortName: 'Gabrielle',
        color: 'bg-purple-500',
        macros: [
            'CENTRO',
            'JEQUITINHONHA',
            'LESTE DO SUL',
            'NORDESTE',
            'VALE DO AÇO'
        ]
    },
    {
        name: 'João Paulo Gomes Carvalho',
        shortName: 'João Paulo',
        color: 'bg-orange-500',
        macros: [
            'LESTE',
            'NOROESTE',
            'NORTE',
            'SUDESTE',
            'TRIÂNGULO DO NORTE'
        ]
    }
];

// Helper to normalize macro names if needed (case insensitivity)
export const getAnalystByMacro = (macroName: string) => {
    return ANALYSTS.find(a => a.macros.includes(macroName.toUpperCase()));
};
