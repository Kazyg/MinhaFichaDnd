import type { Ficha } from './FichaPersonagem';
import { Efeitos } from '../classesPrincipais/Efeitos';
import { buscarTalentoConteudo, chaveConteudo, getTalentosConteudo, referenciaConteudo, resolverConteudo, rotuloConteudo } from '../rulesets/conteudo';
import type { TalentoConteudo } from '../rulesets/types';
import { calcularValorAtributoFinal } from './fichaEfeitosUtils';
import { talento2024, validarEscolhasTalento, requisitosTalento } from './talentos2024Utils';
import type { EscolhasTalento } from '../../bibliotecas/Catalogo2024';
export type EscolhasSelecaoTalento = string[] | EscolhasTalento;
export function descreverEscolhasTalento(e: Efeitos): string {
  const escolhas = e.escolhasTalento2024 ?? e.escolhasTalento;
  return Array.isArray(escolhas) ? escolhas.join(', ') : Object.entries(escolhas ?? {}).map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ');
}

export const periciasTalento = ['Acrobacia', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Adestrar Animais', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência'];
export const ferramentasTalento = ['Suprimentos de Alquimista', 'Suprimentos de Cervejeiro', 'Suprimentos de Calígrafo', 'Ferramentas de Carpinteiro', 'Ferramentas de Cartógrafo', 'Ferramentas de Sapateiro', 'Utensílios de Cozinheiro', 'Ferramentas de Vidreiro', 'Ferramentas de Joalheiro', 'Ferramentas de Coureiro', 'Ferramentas de Pedreiro', 'Suprimentos de Pintor', 'Ferramentas de Oleiro', 'Ferramentas de Ferreiro', 'Ferramentas de Funileiro', 'Ferramentas de Tecelão', 'Ferramentas de Entalhador', 'Kit de Disfarce', 'Kit de Falsificação', 'Kit de Herbalismo', 'Ferramentas de Navegador', 'Kit de Veneno', 'Ferramentas de Ladrão', 'Dados', 'Xadrez de Dragão', 'Baralho', 'Três Dragões', 'Gaita de Foles', 'Tambor', 'Dulcimer', 'Flauta', 'Alaúde', 'Lira', 'Trompa', 'Flauta de Pã', 'Charamela', 'Violino'];
export const treinamentosTalento = [...periciasTalento, ...ferramentasTalento];

export function talentoDoEfeito(e: Efeitos): TalentoConteudo | undefined {
  const t = e.conteudo && resolverConteudo(e.conteudo);
  return t && 'suportado' in t ? t : undefined;
}
export function descreverTalentoSalvo(e: Efeitos) {
  const t = talentoDoEfeito(e);
  if (t) return `${t.descricao}\n${rotuloConteudo(t)}${e.escolhasTalento2024 ? `\nEscolhas: ${Object.entries(e.escolhasTalento2024).map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ')}` : Array.isArray(e.escolhasTalento) && e.escolhasTalento.length ? `\nEscolhas: ${e.escolhasTalento.join(', ')}` : ''}`;
  if (e.conteudo) return `Revisão de talento indisponível; nenhuma mecânica nova aplicada. Snapshot preservado: ${e.talentoSnapshot?.descricao ?? e.talento}`;
  return `Talento legado sem referência de edição/revisão: ${e.talento}. Efeitos salvos preservados; revise explicitamente para usar o catálogo versionado.`;
}
export function erroTalento(f: Ficha, nivel: number, t: TalentoConteudo, escolhas?: EscolhasSelecaoTalento, categoria?: string, ignorar: Efeitos[] = []): string | null {
  if (!Number.isInteger(nivel) || nivel < 1 || nivel > (f.levelTotal ?? 0)) return 'Nível de aquisição inválido.';
  const atual = buscarTalentoConteudo(f.versaoRegras, t.nome);
  if (!atual || atual.id !== t.id || atual.revisao !== t.revisao || !atual.suportado) return 'Talento sem implementação verificada nesta edição; seleção pendente.';
  if (categoria && t.categoria !== categoria) return `Esta escolha exige a categoria ${categoria}.`;
  if (t.categoria === 'General' && nivel < 4) return 'Requer nível 4.';
  if (t.categoria === 'Epic Boon' && nivel < 19) return 'Requer nível 19.';
  const efeitos = (f.efeitos ?? []).filter(e => !ignorar.includes(e));
  if (!t.repetivel && (efeitos.some(e => chaveConteudo((e.talento ?? '').replace(/^2024: /, '')) === chaveConteudo(t.nome)) || f.talentos?.some(n => chaveConteudo(n.replace(/^2024: /, '')) === chaveConteudo(t.nome)))) return 'Este talento não é repetível.';
  if (t.phb) {
    const regra = talento2024(t.nome);
    if (!regra) return 'Regra de talento indisponível.';
    const documento = { ...f, levelTotal: nivel, efeitos: efeitos.filter(e => e.level <= nivel && !ignorar.some(a => e.origemTipo === 'talento2024' && e.origemId === a.tituloEfeito)) } as Ficha;
    if (escolhas === undefined) return requisitosTalento(regra, documento, nivel)[0] ?? null;
    if (Array.isArray(escolhas)) return 'Complete as escolhas do talento; seleção pendente.';
    return validarEscolhasTalento(regra, escolhas, documento, nivel)[0] ?? null;
  }
  if (escolhas !== undefined && !Array.isArray(escolhas)) return 'Formato de escolhas incompatível com este talento.';
  // Inclui escolhas futuras para não invalidar silenciosamente o planejamento salvo.
  const antes = { ...f, levelTotal: nivel, efeitos } as Ficha;
  if (t.requisito.tipo === 'atributo' && !t.requisito.requisito?.some(a => calcularValorAtributoFinal(antes, a) >= (t.requisito.valor ?? 13))) return 'Pré-requisito de atributo não atendido.';
  if (t.requisito.tipo && t.requisito.tipo !== 'atributo') return 'Pré-requisito ainda não suportado.';
  if (escolhas === undefined) return null; // filtro de elegibilidade; confirmação exige escolhas
  if (!t.escolha && escolhas.length) return 'Este talento não oferece escolhas adicionais.';
  if (t.escolha === 'atributo-agarrador') {
    if (escolhas.length !== 1 || !['forca', 'destreza'].includes(escolhas[0])) return 'Escolha Força ou Destreza.';
    for (let n = nivel; n <= Math.max(nivel, ...(efeitos.map(e => e.level))); n++) {
      if (calcularValorAtributoFinal({ ...antes, levelTotal: n } as Ficha, escolhas[0]) >= 20) return 'O aumento não pode ultrapassar 20; confira também avanços posteriores.';
    }
  }
  if (t.escolha === 'treinamentos') {
    if (escolhas.length !== 3 || new Set(escolhas).size !== 3 || escolhas.some(v => !treinamentosTalento.includes(v))) return 'Escolha três perícias ou ferramentas distintas.';
    const treinadas = [...(f.pericias ?? []), ...(f.classePrincipal?.ferramentas ?? []), ...(f.backGround?.proeficienciaFerramentas ?? []),
      ...efeitos.flatMap(e => [...(Array.isArray(e.escolhasTalento) ? e.escolhasTalento : []), e.pericia, ...(e.proeficienciasClasse ?? []), ...(e.proeficienciasRaca ?? []), ...(e.proeficienciasBackGround ?? []), ...(e.proficienciasMulticlasse ?? [])])].filter(Boolean).map(chaveConteudo);
    if (escolhas.some(v => treinadas.includes(chaveConteudo(v)))) return 'Escolha treinamentos que ainda não possui.';
  }
  return null;
}
export function talentosDisponiveis(f: Ficha, nivel: number, categoria?: string, ignorar: Efeitos[] = []) {
  return getTalentosConteudo(f.versaoRegras).filter(t => !erroTalento(f, nivel, t, undefined, categoria, ignorar));
}
export function registrarTalento(e: Efeitos, t: TalentoConteudo, escolhas: EscolhasSelecaoTalento) {
  e.talento = t.nome; e.conteudo = referenciaConteudo(t); e.talentoSnapshot = t;
  if (Array.isArray(escolhas)) e.escolhasTalento = [...escolhas];
  else e.escolhasTalento2024 = JSON.parse(JSON.stringify(escolhas));
  if (t.escolha === 'atributo-agarrador' && Array.isArray(escolhas)) { e.atributo = escolhas[0]; e.bonus = 1; e.tipoEfeito = 'bonus_atributo'; }
}
export function selecionarTalentoInicial(f: Ficha, titulo: string, nome: string, escolhas: EscolhasSelecaoTalento = []): string | null {
  const humano = titulo === 'TalentoOrigemHumano' && f.versaoRegras === 'DND_2024' && f.racaPrincipal?.nome === 'Humano';
  const variante = titulo === 'TalentoEscolhidoHumanoVariante' && f.versaoRegras === 'DND_2014' && f.racaPrincipal?.nome === 'Humano Variante';
  const origem = titulo === 'TalentoOrigem' && f.versaoRegras === 'DND_2024' && (f.backGround as unknown as { talentoOrigem?: string })?.talentoOrigem === nome;
  if (!humano && !variante && !origem) return 'Esta origem/espécie não concede a escolha solicitada.';
  const t = buscarTalentoConteudo(f.versaoRegras, nome);
  if (!t) return 'Talento indisponível.';
  const antigos = (f.efeitos ?? []).filter(e => e.tituloEfeito === titulo);
  const erro = erroTalento(f, 1, t, escolhas, f.versaoRegras === 'DND_2024' ? 'Origin' : undefined, antigos);
  if (erro) return erro;
  if (antigos.length) f.escolhasAnteriores = [...(f.escolhasAnteriores ?? []), { tipo: titulo, valor: JSON.parse(JSON.stringify(antigos)) }];
  const e = new Efeitos(); e.level = 1; e.tituloEfeito = titulo; e.origemTipo = 'origem'; e.origemId = titulo;
  registrarTalento(e, t, escolhas);
  f.efeitos = (f.efeitos ?? []).filter(e => !antigos.includes(e) && !(e.origemTipo === 'talento2024' && e.origemId === titulo));
  f.setEfeitos(e);
  return null;
}
