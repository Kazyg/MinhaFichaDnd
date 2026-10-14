import type { Ficha } from './FichaPersonagem';
import type { BackGround } from '../classesPrincipais/BackGrounds.class';
import { moedasVazias, MoedasIniciais, estruturarEquipamentos } from '../classesPrincipais/concessoesEquipamento';
import { armas } from '../equipamentos/Armas';
import { armaduras_equip } from '../equipamentos/Armaduras';
import { Itens, itens } from '../../bibliotecas/Itens';

export type OrigemEquipamento = { tipo: 'background'; id: string; concessao: string };
export type RegistroConcessoes = {
  origem: string; assinatura: string;
  instancias: { tipo: 'item' | 'arma' | 'armadura'; id: string }[];
  restante: MoedasIniciais; gasto: MoedasIniciais; saldo: MoedasIniciais;
  revisao?: string;
};
const tipos = ['ouro', 'prata', 'cobre'] as const;
const revisaoLegado = 'Ficha antiga sem origem das concessões. Inventário e moedas anteriores preservados; revise com a mesa.';
const saldo = (f: Ficha): MoedasIniciais => ({ ouro: f.ouro, prata: f.prata, cobre: f.cobre });
const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
const origem = (f: Ficha, b: BackGround | null) => `background:${f.versaoRegras}:${normalizar(b?.nome ?? '')}`;

export function registrarAlteracaoMoeda(f: Ficha, tipo: keyof MoedasIniciais, quantidade: number) {
  const r = f.concessoesIniciais;
  if (!r) return;
  if (tipos.some(t => f[t] !== r.saldo[t])) r.revisao = 'Saldo alterado sem histórico de origem. Moedas iniciais preservadas; revise com a mesa.';
  if (!r.revisao && quantidade < 0) {
    const gasto = Math.min(r.restante[tipo], -quantidade);
    r.restante[tipo] -= gasto;
    r.gasto[tipo] += gasto;
  }
  r.saldo = { ...saldo(f), [tipo]: f[tipo] + quantidade };
}

export function sincronizarConcessoes(f: Ficha, b: BackGround | null) {
  let r = f.concessoesIniciais;
  if (!r) {
    const legado = !!f.backGround;
    r = f.concessoesIniciais = {
      origem: legado ? origem(f, f.backGround) : '', assinatura: '', instancias: [],
      restante: moedasVazias(), gasto: moedasVazias(), saldo: saldo(f),
      revisao: legado ? revisaoLegado : undefined,
    };
  }
  const dados = b?.equipamentoInicial ?? estruturarEquipamentos(b?.equipamentos ?? []);
  const dinheiro = b?.escolhaEquipamento === 'dinheiro' && !!dados.alternativa;
  const lista = dinheiro ? [] : dados.itens;
  const moedas = dinheiro ? dados.alternativa! : dados.moedas;
  const idOrigem = origem(f, b);
  const assinatura = JSON.stringify({ origem: idOrigem, lista, moedas });
  const creditoLegadoPendente = b && r.revisao === revisaoLegado && tipos.every(t => r!.restante[t] === 0 && r!.gasto[t] === 0);
  if (creditoLegadoPendente) {
    delete r.revisao;
    r.saldo = saldo(f);
    if (r.origem === idOrigem) {
      for (const t of tipos) {
        f[t] += moedas[t];
        r.restante[t] = moedas[t];
      }
      r.assinatura = assinatura;
      r.saldo = saldo(f);
      return;
    }
  }
  if (r.assinatura === assinatura) return;
  // Legacy grants cannot be distinguished from manual acquisitions.
  if (!r.assinatura && r.revisao && r.origem === idOrigem) return;
  for (const instancia of r.instancias) {
    if (instancia.tipo === 'arma') f.excluirArmaMochila(instancia.id);
    else if (instancia.tipo === 'armadura') f.excluirArmaduraMochila(instancia.id);
    else f.excluirItem(instancia.id);
  }
  r.instancias = [];
  lista.forEach((grant, index) => {
    const aliases: Record<string, string> = { adagas: 'adaga', 'malagueta (clava)': 'clava', cajado: 'bordão', 'm kit de disfarce': 'kit de disfarce' };
    const nome = aliases[normalizar(grant.nome)] ?? grant.nome;
    const arma = armas.find(a => normalizar(a.nome) === normalizar(nome));
    const armadura = armaduras_equip.find(a => normalizar(a.nome) === normalizar(nome));
    const comum = itens.find(i => normalizar(i.nome) === normalizar(nome) && !i.equipamentoMagico && !i.sintonizavel);
    for (let n = 0; n < grant.quantidade; n++) {
      const base = arma ?? armadura ?? comum ?? new Itens(nome, 'Equipamento inicial', 0, 0, 'common', false, 'Propriedades não cadastradas. Consulte a descrição do antecedente.');
      const copia = Object.assign(Object.create(Object.getPrototypeOf(base)), base, {
        id: f.gerarIdUnico(), origemConcessao: { tipo: 'background', id: idOrigem, concessao: `${index}:${n}` } as OrigemEquipamento,
      });
      const tipo = arma ? 'arma' : armadura ? 'armadura' : 'item';
      if (tipo === 'arma') f.setArmaMochila(copia);
      else if (tipo === 'armadura') f.setArmaduraMochila(copia);
      else f.setItemMochila(copia);
      const armazenado = tipo === 'arma' ? f.ArmasMochila! : tipo === 'armadura' ? f.ArmadurasMochila! : f.itensMochila!;
      r!.instancias.push({ tipo, id: armazenado[armazenado.length - 1].id });
    }
  });
  if (tipos.some(t => f[t] !== r!.saldo[t])) r.revisao = 'Saldo alterado sem histórico de origem. Moedas iniciais preservadas; revise com a mesa.';
  if (tipos.some(t => f[t] < r!.restante[t])) r.revisao = 'Saldo insuficiente para reconciliar a origem. Moedas preservadas; revise com a mesa.';
  if (!r.revisao) {
    for (const t of tipos) {
      const novo = Math.max(0, moedas[t] - r.gasto[t]);
      f[t] = Math.max(0, f[t] - r.restante[t]) + novo;
      r.restante[t] = novo;
    }
  }
  r.origem = idOrigem;
  r.assinatura = assinatura;
  r.saldo = saldo(f);
}
