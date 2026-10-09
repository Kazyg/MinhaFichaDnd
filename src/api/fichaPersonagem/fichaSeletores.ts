import { talentoDoEfeito } from './talentosConteudo';
import { especializacoesAtivas } from './fichaEspecializacao';
import type { Ficha } from './FichaPersonagem';
import type { Armas } from '../equipamentos/Armas';
import { chaveClasse } from '../rulesets/progressao';
import { calcularValorAtributoFinal, listarEfeitosAtivos, normalizarTexto } from './fichaEfeitosUtils';

type Documento = Ficha | null | undefined;
export type Parcela = { fonte: string; valor: number; condicao?: string; aplicada: boolean };
export const formatarBonus = (n: number) => `${n >= 0 ? '+' : ''}${n}`;
export const modificador = (valor: number) => Math.floor((valor - 10) / 2);
export const modificadorAtributo = (f: Documento, atributo: string) => modificador(calcularValorAtributoFinal(f, atributo));
export const explicarParcelas = (parcelas: Parcela[]) => parcelas.map(p => `${p.fonte}: ${formatarBonus(p.valor)}${p.condicao ? ` (${p.condicao})` : ''}${p.aplicada ? '' : ' — não aplicado'}`).join('; ');
const parcela = (fonte: string, valor: number, aplicada = true, condicao?: string): Parcela => ({ fonte, valor, aplicada, condicao });
const somar = (p: Parcela[]) => p.reduce((s, v) => s + (v.aplicada ? v.valor : 0), 0);

// Positions beyond the active level remain saved but do not contribute.
export function selecionarNiveis(f: Documento) {
  return Array.from({ length: f?.levelTotal ?? 0 }, (_, i) => {
    const nivel = i + 1;
    const classe = f?.multiclasses?.find(m => m.nivelEscolhido.includes(nivel))?.classe
      ?? (!f?.multiclasses?.length ? f?.classePrincipal : null);
    return { nivel, classe };
  });
}
export function selecionarClassesAtivas(f: Documento) {
  const classes = new Map<string, { nome: string; chave: string; nivel: number }>();
  selecionarNiveis(f).forEach(({ classe }) => {
    if (!classe) return;
    const chave = chaveClasse(classe);
    const anterior = classes.get(chave);
    classes.set(chave, { nome: classe.nome, chave, nivel: (anterior?.nivel ?? 0) + 1 });
  });
  return [...classes.values()];
}
export const selecionarProficiencia = (f: Documento) => f?.levelTotal ? 2 + Math.floor((f.levelTotal - 1) / 4) : 0;
export function selecionarIniciativa(f: Documento) {
  const ajusteSalvo = f?.iniciativa == null ? 0 : f.iniciativa - modificador(f.atributosPersonagem?.destreza.valor ?? 10);
  const parcelas = [parcela('Destreza final', modificadorAtributo(f, 'destreza')), parcela('Ajuste salvo sobre a iniciativa base', ajusteSalvo),
    ...listarEfeitosAtivos(f).filter(e => e.tipoEfeito === 'iniciativa').map(e => parcela(e.tituloEfeito || 'Ajuste de iniciativa', e.bonus))];
  const alerta = listarEfeitosAtivos(f).map(talentoDoEfeito).find(t => t?.iniciativa);
  if (alerta) parcelas.push(parcela(`Alerta ${alerta.edicao.replace('DND_', '')}`, alerta.iniciativa === 'fixo5' ? 5 : selecionarProficiencia(f)));
  return { total: somar(parcelas), parcelas };
}
export function selecionarPericia(f: Documento, nome: string, atributo: string) {
  const efeitos = listarEfeitosAtivos(f).filter(e => normalizarTexto(e.pericia) === normalizarTexto(nome));
  const especializada = efeitos.some(e => e.tipoEfeito === 'especializacao') || (!!f && especializacoesAtivas(f).some(e => normalizarTexto(e.pericia) === normalizarTexto(nome)));
  const porTalento = listarEfeitosAtivos(f).some(e => talentoDoEfeito(e)?.escolha === 'treinamentos' && e.escolhasTalento?.some(p => normalizarTexto(p) === normalizarTexto(nome)));
  const treinada = porTalento || especializada || !!f?.pericias?.some(p => normalizarTexto(p) === normalizarTexto(nome)) || efeitos.some(e => !e.tipoEfeito || e.tipoEfeito === 'proficiencia');
  const parcelas = [parcela(`${atributo} final`, modificadorAtributo(f, atributo)),
    parcela(especializada ? 'Especialização (2 × proficiência)' : 'Proficiência', selecionarProficiencia(f) * (especializada ? 2 : 1), treinada),
    ...efeitos.filter(e => e.tipoEfeito === 'bonus_pericia').map(e => parcela(e.tituloEfeito || 'Ajuste de perícia', e.bonus))];
  return { total: somar(parcelas), treinada, especializada, parcelas };
}
export const selecionarPercepcaoPassiva = (f: Documento) => 10 + selecionarPericia(f, 'Percepção', 'sabedoria').total;

export function selecionarVida(f: Documento) {
  const con = modificadorAtributo(f, 'constituicao');
  const niveis = selecionarNiveis(f);
  const ausentes = niveis.filter(n => !n.classe?.dadosVida).map(n => n.nivel);
  const parcelas = niveis.filter(n => n.classe?.dadosVida).map(({ nivel, classe }) => parcela(
    `${classe!.nome} no nível ${nivel}`, Math.max(1, (nivel === 1 ? classe!.dadosVida : Math.floor(classe!.dadosVida / 2) + 1) + con), true,
    nivel === 1 ? `dado máximo + CON ${formatarBonus(con)}` : `média fixa + CON ${formatarBonus(con)}`));
  parcelas.push(...listarEfeitosAtivos(f).filter(e => e.tipoEfeito === 'pv_maximo').map(e => parcela(e.tituloEfeito || 'Ajuste de PV', e.bonus)));
  // vidaTotal has no automatic writer: retain an explicitly saved maximum.
  return { total: f?.vidaTotal ?? somar(parcelas), calculado: somar(parcelas), parcelas,
    ausentes, manual: f?.vidaTotal != null };
}
export function selecionarDeslocamento(f: Documento) {
  const origem = f?.subRaca ?? f?.racaPrincipal;
  const baseRaca = f?.racaPrincipal?.velocidade;
  // speed historically cached the parent species. Other values are manual overrides.
  const manual = f?.speed != null && f.speed !== baseRaca;
  const base = manual ? f!.speed! : origem?.velocidade ?? f?.speed ?? 0;
  const parcelas = [parcela(manual ? 'Deslocamento salvo' : origem?.nome ?? 'Deslocamento não informado', base),
    ...listarEfeitosAtivos(f).filter(e => e.tipoEfeito === 'deslocamento').map(e => parcela(e.tituloEfeito || 'Ajuste de deslocamento', e.bonus))];
  return { total: somar(parcelas), parcelas };
}
export function selecionarProficiencias(f: Documento) {
  return new Set(listarEfeitosAtivos(f).flatMap(e => [
    ...(talentoDoEfeito(e)?.escolha === 'treinamentos' ? e.escolhasTalento ?? [] : []),
    ...(e.proeficienciasClasse ?? []), ...(e.proeficienciasRaca ?? []),
    ...(e.proeficienciasBackGround ?? []), ...(e.proficienciasMulticlasse ?? []),
  ]).concat(f?.classePrincipal?.armaduras ?? [], f?.classePrincipal?.armas ?? []).map(normalizarTexto));
}
export function temTreinoArmadura(f: Documento, categoria: string) {
  const p = selecionarProficiencias(f);
  const chave = normalizarTexto(categoria);
  return p.has(chave) || (chave !== 'escudos' && p.has('todas as armaduras'));
}
export function selecionarCA(f: Documento) {
  const armadura = f?.ArmaduraEquipada;
  const escudo = f?.escudoEquipado;
  const des = modificadorAtributo(f, 'destreza');
  const categoria = normalizarTexto(armadura?.categoria);
  const treino = !armadura || temTreinoArmadura(f, armadura.categoria);
  const treinoEscudo = temTreinoArmadura(f, 'escudos');
  const avisos: string[] = [];
  if (!treino || (escudo && !treinoEscudo && f?.versaoRegras === 'DND_2014')) avisos.push('Sem treino: desvantagem em testes de FOR/DES e não pode conjurar magias.');
  if (escudo && !treinoEscudo && f?.versaoRegras === 'DND_2024') avisos.push('Escudo sem treino (2024): não concede CA.');
  const parcelas: Parcela[] = [];
  if (escudo) parcelas.push(parcela(escudo.nome, escudo.ac, f?.versaoRegras !== 'DND_2024' || treinoEscudo, '2014: com ou sem treino; 2024: exige treino'));
  let defesaIncluida = false;
  listarEfeitosAtivos(f).filter(e => e.ca === 'CA' || e.tipoEfeito === 'ca_item' || e.tipoEfeito === 'estilo_defesa').forEach(e => {
    const defesa = e.tipoEfeito === 'estilo_defesa' || e.tituloEfeito?.startsWith('estiloLuta');
    if (defesa && defesaIncluida) return;
    if (defesa) defesaIncluida = true;
    parcelas.push(parcela(defesa ? 'Estilo Defesa' : e.tituloEfeito || 'Ajuste de CA', e.bonus,
      !defesa || (!!armadura && (f?.versaoRegras !== 'DND_2024' || treino)), defesa ? 'vestindo armadura; 2024 exige treino' : undefined));
  });
  const classes = selecionarClassesAtivas(f).map(c => c.chave);
  // Multiclassing does not grant Unarmored Defense a second time.
  const primeiraDefesa = selecionarNiveis(f).find(n => n.classe && ['barbaro', 'monge'].includes(chaveClasse(n.classe)))?.classe;
  const alternativas = [{ fonte: 'Sem armadura: 10 + DES', valor: 10 + des, aplicada: !armadura }];
  if (classes.includes('barbaro')) alternativas.push({ fonte: 'Bárbaro: 10 + DES + CON (permite escudo)', valor: 10 + des + modificadorAtributo(f, 'constituicao'), aplicada: !armadura && chaveClasse(primeiraDefesa!) === 'barbaro' });
  if (classes.includes('monge')) alternativas.push({ fonte: 'Monge: 10 + DES + SAB (sem escudo)', valor: 10 + des + modificadorAtributo(f, 'sabedoria'), aplicada: !armadura && !escudo && chaveClasse(primeiraDefesa!) === 'monge' });
  if (armadura) alternativas.push({ fonte: `${armadura.nome}: base${categoria.includes('leve') ? ' + DES' : categoria.includes('media') ? ' + DES (máx. 2)' : ''}`, valor: armadura.ac + (categoria.includes('leve') ? des : categoria.includes('media') ? Math.min(des, 2) : 0), aplicada: true });
  const selecionada = alternativas.filter(a => a.aplicada).reduce((a, b) => b.valor > a.valor ? b : a);
  const manual = f?.classeArmadura ?? f?.cA;
  const total = manual ?? selecionada.valor + somar(parcelas);
  return { total, alternativas, parcelas, avisos, explicacao: `${manual != null ? `CA manual salva: ${manual}. Cálculo de referência: ` : ''}${selecionada.fonte} = ${selecionada.valor}; ${explicarParcelas(parcelas)} ${avisos.join(' ')}` };
}

export function selecionarArma(f: Documento, arma: Armas) {
  const atributo = (arma.dano_atributo ?? []).map(nome => ({ nome, modificador: modificadorAtributo(f, nome) }))
    .sort((a, b) => b.modificador - a.modificador)[0] ?? { nome: 'Força', modificador: modificadorAtributo(f, 'forca') };
  const profs = selecionarProficiencias(f);
  const proficiente = profs.has(normalizarTexto(arma.nome)) || profs.has(normalizarTexto(arma.categoria));
  const ataque = [parcela(atributo.nome, atributo.modificador), parcela('Proficiência', selecionarProficiencia(f), proficiente)];
  const dano = [parcela(atributo.nome, atributo.modificador)];
  const estilos = new Set<string>();
  listarEfeitosAtivos(f).forEach(e => {
    const arquearia = e.tipoEfeito === 'estilo_arquearia' || e.arma === 'distancia';
    const duelo = e.tipoEfeito === 'estilo_duelismo' || e.arma === 'uma mao';
    if (arquearia || duelo) {
      const chave = arquearia ? 'Arquearia' : 'Duelismo';
      if (estilos.has(chave)) return;
      estilos.add(chave);
      const equipada = !!f?.ArmaEquipada?.some(a => a.id === arma.id);
      (arquearia ? ataque : dano).push(parcela(chave, e.bonus, arquearia ? arma.distancia === 'sim' :
        equipada && arma.distancia !== 'sim' && !normalizarTexto(arma.propriedades).includes('duas maos') && f?.ArmaEquipada?.length === 1,
      arquearia ? 'arma à distância' : 'uma arma corpo a corpo em uma mão, nenhuma outra arma; dano principal'));
    } else {
      if (e.tipoEfeito === 'ataque_arma' || e.arma === 'ataque_arma') ataque.push(parcela(e.tituloEfeito || 'Bônus de ataque', e.bonus));
      if (e.tipoEfeito === 'dano_arma' || e.arma === 'dano_arma') dano.push(parcela(e.tituloEfeito || 'Bônus de dano', e.bonus));
    }
  });
  return { ataque: somar(ataque), formula: `${arma.dano?.dano_1 || '0'} ${formatarBonus(somar(dano))}`, atributo: atributo.nome,
    proficiente, parcelasAtaque: ataque, parcelasDano: dano, explicacao: `Ataque: ${explicarParcelas(ataque)}. Dano: ${explicarParcelas(dano)}` };
}
