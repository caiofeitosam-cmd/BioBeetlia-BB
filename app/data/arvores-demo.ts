export type Arvore = {
    id: string;
    nome: string;
    especie: string;
    local: string;
    observacoes: string;
    status: string;
    criadoEm: string;
    demo?: boolean;
  };
  
  const especies = [
    'Mangueira — Mangifera indica',
    'Ipê-amarelo — Handroanthus albus',
    'Ipê-roxo — Handroanthus impetiginosus',
    'Oitizeiro — Licania tomentosa',
    'Cajueiro — Anacardium occidentale',
    'Pau-brasil — Paubrasilia echinata',
  ];
  
  const locais = [
    'Entrada principal',
    'Pátio central',
    'Jardim lateral',
    'Bloco A',
    'Bloco B',
    'Área verde norte',
    'Área verde sul',
    'Próximo à biblioteca',
  ];
  
  export const ARVORES_DEMO: Arvore[] = Array.from(
    { length: 24 },
    (_, index) => {
      const numero = index + 1;
  
      return {
        id: `BB-${String(numero).padStart(3, '0')}`,
        nome: `Árvore ${String(numero).padStart(2, '0')}`,
        especie: especies[index % especies.length],
        local: locais[index % locais.length],
        observacoes: 'Registro fictício para demonstração do aplicativo.',
        status: 'Sem leitura',
        criadoEm: new Date(
          2026,
          8,
          18,
          8,
          index
        ).toISOString(),
        demo: true,
      };
    }
  );