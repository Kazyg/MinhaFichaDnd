import { Metamagica } from '../../bibliotecas/Metamagica';
import type { Ficha } from '../fichaPersonagem/FichaPersonagem';
import { nivelDaClasse, niveisMetamagia, normalizarChave } from './progressao';
import { arquivarEscolha } from '../fichaPersonagem/escolhasProgressao';

export type EscolhaMetamagia = { nivelClasse: number; slot: number; nome: string; descricao: string; revisao?: string; fonte?: string; consulta?: string; licenca?: string };
export const fonteMetamagia2024 = 'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#MetamagicOptions';
export function opcoesMetamagia(edicao: string) {
  if (edicao === 'DND_2014') return Metamagica.filter(m => m.nome);
  if (edicao !== 'DND_2024') return [];
  // Local adaptations of SRD 5.2.1 pp. 66–67 (CC-BY-4.0). Saved snapshots stay unchanged.
  const resumos: Record<string, string> = {
    'Magia Acelerada': '2 pontos: transforma a conjuração de uma ação em ação bônus. Não pode ser usada se você já conjurou magia de círculo 1 ou maior neste turno, nem permite conjurar outra dessas magias depois no mesmo turno.',
    'Magia Aumentada': '2 pontos: um alvo tem desvantagem nos testes de resistência contra a magia.',
    'Magia Cuidadosa': '1 ponto: proteja até seu modificador de Carisma em criaturas (mínimo 1). Elas passam automaticamente na resistência da magia e não sofrem dano se o sucesso normalmente causaria metade.',
    'Magia Distante': '1 ponto: dobra um alcance de pelo menos 5 pés; alcance de toque passa a 30 pés.',
    'Magia Duplicada': '1 ponto: em magia que permite atingir outra criatura ao usar espaço de círculo superior, aumenta o círculo efetivo em 1.',
    'Magia Estendida': '1 ponto: dobra duração de pelo menos 1 minuto, até 24 horas. Se exigir concentração, concede vantagem nas resistências para mantê-la.',
    'Magia Potencializada': '1 ponto: rerrole até seu modificador de Carisma em dados de dano (mínimo 1), usando os novos resultados. Pode combinar com outra metamagia.',
    'Magia Sutil': '1 ponto: dispensa componentes verbais, somáticos e materiais, exceto materiais consumidos ou com custo especificado.',
    'Magia Buscadora': '1 ponto: após errar um ataque de magia, rerrole o d20 e use o novo resultado. Pode combinar com outra metamagia.',
    'Magia Transmutada': '1 ponto: troca um tipo de dano da magia por outro desta lista: ácido, frio, fogo, elétrico, veneno ou trovejante.',
  };
  return Object.entries(resumos).map(([nome, descricao]) => ({ nome,
    descricao: `${descricao} Resumo 2024; gasto e aplicação são manuais. SRD 5.2.1, pp. 66–67 (CC-BY-4.0).`,
    revisao: 'srd-5.2.1-pt-resumo-1', fonte: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf#page=66',
    consulta: '2026-10-08', licenca: 'CC-BY-4.0',
  }));
}
export function eventosMetamagia(ficha: Ficha): EscolhaMetamagia[] {
  if (ficha.escolhasMetamagia) return ficha.escolhasMetamagia;
  const slots = ficha.versaoRegras === 'DND_2024' ? [0, 1, 2, 4] : [0, 1, 2, 3];
  return [ficha.metamagica1, ficha.metamagica2, ficha.metamagica3, ficha.metamagica4].flatMap((m, i) => m ? [{ ...m, slot: slots[i], nivelClasse: niveisMetamagia(ficha.versaoRegras)[slots[i]] }] : []);
}
export function metamagiasNoNivel(ficha: Ficha, nivel: number): EscolhaMetamagia[] {
  const slots = new Map<number, EscolhaMetamagia>();
  eventosMetamagia(ficha).filter(e => e.nivelClasse <= nivel).slice().sort((a, b) => a.nivelClasse - b.nivelClasse).forEach(e => slots.set(e.slot, e));
  return [...slots.values()];
}
export function selecionarMetamagia(ficha: Ficha, nivel: number, slot: number, nome: string): boolean {
  if (!Number.isInteger(nivel) || !Number.isInteger(slot) || nivel < 1 || nivel > 20) return false;
  const entrada = niveisMetamagia(ficha.versaoRegras)[slot];
  if (!entrada || nivel < entrada || nivel > nivelDaClasse(ficha, 'feiticeiro')) return false;
  if (ficha.versaoRegras === 'DND_2014' && nivel !== entrada) return false;
  const opcao = opcoesMetamagia(ficha.versaoRegras).find(o => o.nome === nome);
  if (!opcao) return false;
  if (metamagiasNoNivel(ficha, nivel).some(e => e.slot === slot && e.nome === nome)) return true;
  const eventos = eventosMetamagia(ficha);
  if (nivel > entrada && eventos.some(e => e.nivelClasse === nivel && e.slot !== slot && niveisMetamagia(ficha.versaoRegras)[e.slot] < nivel)) return false;
  const novos = [...eventos.filter(e => !(e.slot === slot && e.nivelClasse === nivel)), { ...opcao, nivelClasse: nivel, slot }];
  const simulada = { ...ficha, escolhasMetamagia: novos } as Ficha;
  for (let n = entrada; n <= 20; n++) {
    const nomes = metamagiasNoNivel(simulada, n).map(m => normalizarChave(m.nome));
    if (new Set(nomes).size !== nomes.length) return false;
  }
  arquivarEscolha(ficha, 'metamagia', eventos.filter(e => e.slot === slot && e.nivelClasse === nivel));
  ficha.escolhasMetamagia = novos;
  return true;
}
