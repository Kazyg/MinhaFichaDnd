import { Campanha } from './modelos';


export function normalizarRoteirosCampanha(campanha: Campanha): Campanha {
  if (!campanha.roteiro.trim()) return campanha;
  const roteiros = campanha.roteiros ?? [];
  const ids = new Set(roteiros.map(roteiro => roteiro.id));
  let id = 'roteiro-legado';
  let sufixo = 1;
  while (ids.has(id)) id = `roteiro-legado-${sufixo++}`;
  return {
    ...campanha,
    roteiro: '',
    roteiros: [...roteiros, {
      id, titulo: 'Roteiro original', conteudo: campanha.roteiro,
      criadoEm: campanha.criadoEm, atualizadoEm: campanha.atualizadoEm,
    }],
  };
}
