import type { Ficha } from './FichaPersonagem';
import type { Itens } from '../../bibliotecas/Itens';
import { metadadosMagicosCatalogo, metadadosDoRegistroCatalogo } from '../../bibliotecas/ItensMagicos';
import { armas, Armas } from '../equipamentos/Armas';
import { Armaduras_equip, armaduras_equip } from '../equipamentos/Armaduras';

export type TipoEquipamento = 'arma' | 'armadura';
type Equipamento = Armas | Armaduras_equip;
const normalizar = (texto = '') => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function itemMagicoVinculado(f: Ficha | null | undefined, tipo: TipoEquipamento, id: string) {
  return f?.itensMochila?.find(i => i.equipamentoMagico && i.vinculoEquipamento?.tipo === tipo && i.vinculoEquipamento.id === id);
}

export function equipamentoDoItem(f: Ficha, item: Itens): Equipamento | undefined {
  const vinculo = item.vinculoEquipamento;
  return vinculo?.tipo === 'arma' ? f.ArmasMochila?.find(a => a.id === vinculo.id)
    : vinculo ? f.ArmadurasMochila?.find(a => a.id === vinculo.id) : undefined;
}

export function itemEstaEquipado(f: Ficha | null | undefined, item: Itens): boolean {
  if (!f) return false;
  if (!item.equipamentoMagico) return !!f.itensEquipados?.some(i => i.id === item.id);
  const v = item.vinculoEquipamento;
  if (!v) return false;
  return v.tipo === 'arma' ? !!f.ArmaEquipada?.some(a => a.id === v.id)
    : f.ArmaduraEquipada?.id === v.id || f.escudoEquipado?.id === v.id;
}

export function magiaDoEquipamento(f: Ficha | null | undefined, tipo: TipoEquipamento, equipamento: Equipamento) {
  const item = itemMagicoVinculado(f, tipo, equipamento.id);
  const magia = item?.equipamentoMagico;
  // Weapon rows preview an attack with that weapon; attuned properties still require active equipment.
  const ativo = !!item && ((magia?.modo === 'melhoria' && !item.sintonizavel) || (itemEstaEquipado(f, item) && (!item.sintonizavel || !!f?.itensSintonizados?.includes(item.id))));
  return { item, magia, ativo, bonusAtaque: ativo ? magia?.bonusAtaque ?? 0 : 0,
    bonusDano: ativo ? magia?.bonusDano ?? 0 : 0, bonusCA: ativo ? magia?.bonusCA ?? 0 : 0 };
}

export function nomeEquipamentoMagico(f: Ficha | null | undefined, tipo: TipoEquipamento, equipamento: Equipamento) {
  const item = itemMagicoVinculado(f, tipo, equipamento.id);
  if (!item || item.equipamentoMagico?.modo === 'especifico') return equipamento.nome;
  const bonus = item.equipamentoMagico?.bonusAtaque ?? item.equipamentoMagico?.bonusCA ?? 0;
  return `${equipamento.nome}${bonus ? ` +${bonus}` : ''}`;
}

export function motivoBloqueioMelhoria(f: Ficha | null | undefined, tipo: TipoEquipamento, equipamento: Equipamento) {
  if (itemMagicoVinculado(f, tipo, equipamento.id)?.equipamentoMagico?.modo === 'especifico') return 'Equipamento mágico especial não aceita melhoria genérica.';
  if (equipamento.magica || /\+[123](?:\s|$)/.test(equipamento.nome) || normalizar('propriedades' in equipamento ? equipamento.propriedades : '').includes('magic')) return 'Este equipamento já é mágico.';
  return '';
}

export function melhoriaCompativel(item: Itens, tipo: TipoEquipamento, equipamento: Equipamento) {
  const magia = item.equipamentoMagico;
  if (!magia || magia.modo !== 'melhoria') return false;
  if (tipo === 'arma') return magia.tipo === 'arma';
  const escudo = normalizar(equipamento.categoria) === 'escudos';
  return magia.tipo === (escudo ? 'escudo' : 'armadura');
}

export function melhoriasDisponiveis(f: Ficha | null | undefined, tipo: TipoEquipamento, equipamento: Equipamento) {
  if (motivoBloqueioMelhoria(f, tipo, equipamento)) return [];
  return f?.itensMochila?.filter(i => !i.vinculoEquipamento && melhoriaCompativel(i, tipo, equipamento)) ?? [];
}

export function sincronizarEstadoItensMagicos(f: Ficha) {
  const magicos = (f.itensMochila ?? []).filter(i => i.equipamentoMagico);
  if (!magicos.length) return;
  const anteriores = new Set(f.itensEquipados?.map(i => i.id));
  const idsMagicos = new Set(magicos.map(i => i.id));
  f.itensEquipados = (f.itensEquipados ?? []).filter(i => !idsMagicos.has(i.id));
  magicos.forEach(item => {
    if (itemEstaEquipado(f, item)) f.itensEquipados!.push(item);
    else if (anteriores.has(item.id)) f.itensSintonizados = f.itensSintonizados?.filter(id => id !== item.id);
    f.sincronizarEfeitosItem(item);
  });
}

export function restaurarEquipamentosMagicos(f: Ficha) {
  const ocupados = new Set<string>();
  (f.itensMochila ?? []).forEach(item => {
    item.equipamentoMagico ??= item.registroCatalogo !== undefined
      ? metadadosDoRegistroCatalogo(item.registroCatalogo, item.nomeIngles)
      : metadadosMagicosCatalogo(item.nomeIngles || item.nome);
    const magia = item.equipamentoMagico;
    if (!magia) return;
    item.sintonizavel = magia.exigeSintonizacao;
    if (magia.modo === 'especifico') {
      const tipo: TipoEquipamento = magia.tipo === 'arma' ? 'arma' : 'armadura';
      const catalogo: Equipamento[] = tipo === 'arma' ? armas : armaduras_equip;
      const base = catalogo.find(a => a.nome === magia.baseNome);
      if (!base) return;
      const mochila: Equipamento[] | null | undefined = tipo === 'arma' ? f.ArmasMochila : f.ArmadurasMochila;
      const existente = item.vinculoEquipamento?.tipo === tipo && mochila?.find(a => a.id === item.vinculoEquipamento!.id);
      const legadoEquipado = !item.vinculoEquipamento && f.itensEquipados?.some(i => i.id === item.id);
      let representacao = existente || mochila?.find(a => a.id === `${tipo}-item:${item.id}`);
      if (!representacao || ocupados.has(`${tipo}:${representacao.id}`)) {
        const nova = Object.assign(Object.create(tipo === 'arma' ? Armas.prototype : Armaduras_equip.prototype), base, { id: `${tipo}-item:${item.id}`, nome: item.nome, magica: true });
        if ('dano' in base) {
          nova.dano = { ...(magia.danoBase ?? base.dano) }; nova.dano_atributo = [...base.dano_atributo];
          if (magia.danoTipo) nova.dano_tipo = magia.danoTipo;
          if (magia.atributosArma) nova.dano_atributo = [...magia.atributosArma];
          if (magia.propriedadesArma) nova.propriedades = [base.propriedades, ...magia.propriedadesArma].join(', ');
        } else {
          if (magia.furtividade !== undefined) nova.furtividade = magia.furtividade;
          if (magia.forcaRequerida !== undefined) nova.forca = magia.forcaRequerida;
        }
        while (mochila?.some(a => a.id === nova.id)) nova.id = f.gerarIdUnico();
        if (tipo === 'arma') f.ArmasMochila = [...(f.ArmasMochila ?? []), nova];
        else f.ArmadurasMochila = [...(f.ArmadurasMochila ?? []), nova];
        representacao = nova;
      }
      if (!representacao) return;
      item.vinculoEquipamento = { tipo, id: representacao.id };
      if (legadoEquipado && tipo === 'arma' && !f.ArmaEquipada?.some(a => a.id === representacao!.id) && f.getMaosOcupadas() + f.maosDaArma(representacao as Armas) <= 2) {
        f.ArmaEquipada = [...(f.ArmaEquipada ?? []), representacao as Armas];
        f.atualizarMaos();
      }
      if (legadoEquipado && tipo === 'armadura') {
        if (magia.tipo === 'escudo') {
          if (!f.escudoEquipado && f.getMaosOcupadas() < 2) { f.escudoEquipado = representacao as Armaduras_equip; f.atualizarMaos(); }
        } else if (!f.ArmaduraEquipada) f.ArmaduraEquipada = representacao as Armaduras_equip;
      }
    }
    const v = item.vinculoEquipamento;
    if (!v) return;
    const alvo = equipamentoDoItem(f, item);
    const chave = `${v.tipo}:${v.id}`;
    if (!alvo || ocupados.has(chave) || (magia.modo === 'melhoria' && (!melhoriaCompativel(item, v.tipo, alvo) || motivoBloqueioMelhoria(f, v.tipo, alvo)))) {
      delete item.vinculoEquipamento;
      return;
    }
    ocupados.add(chave);
  });
  sincronizarEstadoItensMagicos(f);
}
