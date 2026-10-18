
export default function IconeCondicao({ icone }: { icone?: string }) {
  const aliases: Record<string, string> = { chama:'flame',gota:'drop',neve:'snow',raio:'zap',escudo:'shield',coracao:'heart','olho-riscado':'eye',olho:'eye',lua:'moon',cadeado:'lock','seta-baixo':'down',foco:'focus' };
  const chave = aliases[icone ?? ''] ?? (icone ?? '').toLowerCase();
  const especiais: Record<string, string> = {
    olho:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
    'ouvido-riscado':'M6 9a6 6 0 0 1 12 0c0 5-5 5-5 9a3 3 0 0 1-6 0M10 9a2 2 0 0 1 4 0M3 3l18 18',
    bateria:'M3 7h16v10H3ZM19 10h3v4M6 10v4',
    medo:'M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0M8 9l2 1M16 9l-2 1M9 17v-2h6v2',
    mao:'M8 12V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v9-5a2 2 0 0 1 4 0v9c0 5-3 7-7 7-4 0-6-3-8-7l-2-4c2-2 4 0 5 2',
    proibido:'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M6 6l12 12',
    pedra:'M7 3 17 4 22 14 16 21 5 20 2 11ZM7 3l3 9 12 2M10 12 5 20',
    veneno:'M9 2h6M10 2v7L4 19q-1 3 2 3h12q3 0 2-3L14 9V2M7 15h10M9 18l1 1M14 18l1 1',
    frasco:'M8 2h8M9 2v7L3 19q-1 3 2 3h14q3 0 2-3L15 9V2M6 16h12',
    corrente:'M9 15 15 9M8 13l-3 3a3 3 0 0 0 4 4l4-4M11 8l4-4a3 3 0 0 1 5 5l-4 4',
    estrela:'M12 2l3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z',
    caveira:'M5 16a9 9 0 1 1 14 0v4H5ZM9 20v2M15 20v2M8 10h1v2H8ZM15 10h1v2h-1ZM12 14v2',
    sol:'M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',
    mente:'M12 4c-4-4-8 0-7 4-4 2-4 7 0 9-1 4 4 6 7 3 3 3 8 1 7-3 4-2 4-7 0-9 1-4-3-8-7-4ZM12 4v16M6 8l3 2M18 14l-3 2',
    arcano:'M12 2 22 19H2ZM12 8v8M8 12h8M7 21h10',
    relogio:'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 6v6l4 2',
    silencio:'M4 9h4l6-5v16l-6-5H4ZM18 8l5 8M23 8l-5 8',
    fantasma:'M4 21V10a8 8 0 0 1 16 0v11l-4-3-4 3-4-3ZM8 9v3M16 9v3',
    portal:'M5 12a7 10 0 1 0 14 0 7 10 0 1 0-14 0M3 12h14M13 8l4 4-4 4',
    troca:'M3 7h17M16 3l4 4-4 4M21 17H4M8 13l-4 4 4 4',
    espada:'M4 20 16 8M13 4l7-2-2 7L7 20M3 14l7 7M2 22l3-3',
    pegadas:'M6 2c-4 0-4 8 0 8s4-8 0-8ZM4 13h4v4H4ZM17 7c-4 0-4 8 0 8s4-8 0-8ZM15 18h4v4h-4Z',
    alvo:'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0M10 12h4M12 10v4',
    asas:'M12 18C4 18 1 10 2 3l10 9L22 3c1 7-2 15-10 15ZM4 10l5 5M20 10l-5 5',
    exclamacao:'M12 2 23 22H1ZM12 8v7M12 18v1',
    marcador:'M4 3h16v19l-8-5-8 5Z',
    brilho:'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
  };
  const desenho = /flame|fogo|burn/.test(chave) ? 'M12 2C14 8 20 9 19 15a7 7 0 0 1-14 0c0-3 2-5 4-7 0 4 3 4 3 0Z' : /drop|blood|sang/.test(chave) ? 'M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z' : /snow|ice|cold/.test(chave) ? 'M12 2v20M3 7l18 10M3 17 21 7M8 4l4 4 4-4M8 20l4-4 4 4' : /bolt|zap|lightning/.test(chave) ? 'M13 2 4 14h7l-1 8 10-13h-8Z' : /shield/.test(chave) ? 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z' : /heart/.test(chave) ? 'M12 21 3 12C-3 3 8-1 12 6c4-7 15-3 9 6Z' : /eye/.test(chave) ? 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0M3 3l18 18' : /moon/.test(chave) ? 'M19 16A9 9 0 0 1 8 5a9 9 0 1 0 11 11Z' : /lock/.test(chave) ? 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v12H5ZM12 14v4' : /down|prone/.test(chave) ? 'M12 3v17M5 13l7 7 7-7' : /focus|target/.test(chave) ? 'M12 2v4M12 18v4M2 12h4M18 12h4M5 12a7 7 0 1 0 14 0 7 7 0 1 0-14 0M10 12h4' : 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z';
  return <svg className="am-icone-condicao" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={especiais[icone ?? ''] ?? desenho} /></svg>;
}
