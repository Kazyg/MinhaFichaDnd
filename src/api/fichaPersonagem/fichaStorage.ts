import { migrarInventario } from './fichaInventario';
import { restaurarModelos } from './fichaRestauracao';
import { migrarMagias } from './fichaConjuracao';
import { Ficha } from './FichaPersonagem';
import { Atributos } from '../classesPrincipais/Atributos.class';
import { Efeitos } from '../classesPrincipais/Efeitos';

export const MAX_INPUT_BYTES = 5 * 1024 * 1024;
export const STORAGE_KEY = 'fichas';
export const BACKUP_KEY = 'fichas.backup';
export const RECOVERY_KEY = 'fichas.recuperacao';
const fail = (path: string): never => { throw new Error(`Documento inválido ou não suportado: ${path}.`); };
const object = (v: any) => v !== null && typeof v === 'object' && !Array.isArray(v);
const string = (v: any) => typeof v === 'string';
const number = (v: any) => typeof v === 'number' && Number.isFinite(v);
const id = (v: any) => string(v) && v.trim().length > 0 && v.length <= 200;
type Check = (v: any) => boolean;
const array = (check: Check): Check => v => Array.isArray(v) && v.every(check);
const shape = (required: Record<string, Check>, optional: Record<string, Check> = {}): Check => v =>
  object(v) && Object.entries(required).every(([k, check]) => check(v[k])) &&
  Object.entries(optional).every(([k, check]) => v[k] === undefined || v[k] === null || check(v[k]));
const strings = array(string);
const named = shape({ nome: string });
const level = shape({ nivel: number }, { caracteristicas: strings, nome: string, descricao: string });
const classe = shape({ nome: string }, {
  chave: string,
  dadosVida: number, habilidade: number, armaduras: strings, armas: strings,
  ferramentas: strings, testesResistencias: strings, habilidades: strings,
  niveis: array(level), subClasse: array(named), proficienciaMulticlasse: strings,
});
const race = shape({ nome: string }, {
  tamanho: string, velocidade: number, idiomas: strings, pericia: strings,
  proeficiencias: strings, atributos: shape({ atributo: strings, bonus: array(number) }),
  tracos: array(shape({ traco: string, descricao: string })), subOpcoes: array(named),
});
const equipment = shape({ id, nome: string }, {
  efeitosExplicitos: v => array(effect)(v),
  custo: number, preco: number, peso: number, ac: number, forca: number, sintonizavel: v => typeof v === 'boolean',
  categoria: string, descricao: string, dano: shape({ dano_1: string, dano_2: string }), dano_atributo: strings,
});
// Unknown revision/edition strings are preserved for review, never coerced to current content.
const contentReference = shape({ id: string, edicao: string, revisao: string });
const contentSnapshot = shape({ nome: string, descricao: string });
const effect = shape({ id }, {
  conteudo: contentReference, talentoSnapshot: contentSnapshot, escolhasTalento: strings,
  tituloEfeito: string, tipoEfeito: string, origemTipo: string, origemId: string,
  classeNome: string, atributo: string, talento: string, pericia: string, arma: string, ca: string,
  bonus: number, valorFixo: number, level: number, nivelClasseOrigem: number, proeficienciasRaca: strings,
  proeficienciasBackGround: strings, proeficienciasClasse: strings, proficienciasMulticlasse: strings,
});
const attributes = shape(Object.fromEntries(
  ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma']
    .map(k => [k, shape({ id: number, nome: string, valor: number }, { tipo: string })])
));
const nonnegative = (v: any) => Number.isInteger(v) && v >= 0;
const fields: Record<string, Check> = {
  especializacoesOficiais: array(shape({ fonte: string, pericia: string, nivelAquisicao: number, edicao: string })),
  itensSintonizados: strings,
  recursos: shape({ slots: v => object(v) && Object.values(v).every(nonnegative) }, { morte: shape({}, { sucessos: v => nonnegative(v) && v <= 3, falhas: v => nonnegative(v) && v <= 3 }) }),
  magiasConjuracao: array(shape({ id, nome: string, fonte: string, classe: string,
    edicao: v => ['DND_2014', 'DND_2024'].includes(v), catalogo: string,
    nivel: v => v === null || (Number.isInteger(v) && v >= 0 && v <= 9),
    categoria: v => ['truque', 'conhecida', 'livro', 'preparada', 'pendente'].includes(v),
    preparada: v => typeof v === 'boolean', aquisicao: v => ['progressao', 'copia', 'legado'].includes(v),
    }, { aviso: string, conteudo: contentReference, snapshot: contentSnapshot })),
  escolhasAnteriores: array(shape({ tipo: string, valor: () => true })),
  escolhasMetamagia: array(shape({ nivelClasse: number, slot: number, nome: string, descricao: string })),
  idiomasLivres: strings, atributosSelecionados: strings, migracoes: strings,
  distribuicaoAtributos: shape({ metodo: v => v === null || string(v), atributos: shape(Object.fromEntries(['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map(k => [k, number]))), valores: array(number), pontos: number, modo: v => ['todos', 'dois'].includes(v), maior: string, menor: string }),
  racaPrincipal: race, subRaca: race, classePrincipal: classe,
  subClasse: array(shape({ classe, subclasse: shape({ id, nome: string }, { niveis: array(level), magias: strings }) })),
  multiclasses: array(shape({ id, classe, nivelClasse: number, nivelEscolhido: array(number) })),
  backGround: shape({ nome: string }, { proeficienciasHabilidades: strings, idiomas: number,
    equipamentos: strings, proeficienciaFerramentas: strings, caracteristicas: shape({ nome: string, descricao: string }) }),
  atributosPersonagem: attributes, efeitos: array(effect),
  estiloLuta: array(shape({ estilo: string, classe: string })),
  animalSelecionado: array(shape({ animal: string, nivel: number })),
  espacosMagiaDisponiveis: array(shape({ nivelMagia: number, espaco: number })),
  espacosMagiaTotais: array(shape({ nivelMagia: number, espaco: number })),
  magiasConhecidas: array(shape({ classe: string, magias: number })),
  truquesConhecidos: array(shape({ classe: string, magias: number })),
  magiasEscolhidas: array(shape({ classe: string, magia: strings })),
  ArmaduraEquipada: equipment, escudoEquipado: equipment, patrono: named,
};
for (const key of ['nomePersonagem', 'tamanho', 'terrenoSelecionado']) fields[key] = string;
for (const key of ['iniciativa', 'proeficiencia', 'percepcao', 'vidaTotal', 'vidaAtual', 'levelTotal', 'classeArmadura', 'speed', 'cA', 'maosOcupadas', 'ouro', 'prata', 'cobre', 'limiteSintonizacao']) fields[key] = number;
for (const key of ['pericias', 'talentos', 'idiomas']) fields[key] = strings;
for (const key of ['ArmadurasMochila', 'ArmasMochila', 'ArmaEquipada', 'itensMochila', 'itensEquipados']) fields[key] = array(equipment);
for (const key of ['metamagica1', 'metamagica2', 'metamagica3', 'metamagica4']) fields[key] = shape({ nome: string, descricao: string });

// Check the graph before JSON.stringify can silently turn NaN/Infinity into null.
export function validateGraph(value: any, depth = 0, ancestors = new Set<any>()) {
  if (depth > 60) fail('profundidade máxima');
  if (typeof value === 'number' && !Number.isFinite(value)) fail('número não finito');
  if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') fail('tipo não serializável');
  if (value && typeof value === 'object') {
    if (ancestors.has(value)) fail('referência circular');
    ancestors.add(value);
    for (const [key, child] of Object.entries(value)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) fail(key);
      if ([Ficha.prototype, Atributos.prototype, Efeitos.prototype].some(proto => Object.prototype.hasOwnProperty.call(proto, key))) fail(`campo reservado ${key}`);
      validateGraph(child, depth + 1, ancestors);
    }
    ancestors.delete(value);
  }
}

export function validateFicha(value: any): asserts value is Ficha {
  if (!object(value) || !id(value.id) || !Object.prototype.hasOwnProperty.call(value, 'nomePersonagem')) fail('ficha/id/nomePersonagem');
  if (value.versaoRegras !== undefined && !['DND_2014', 'DND_2024'].includes(value.versaoRegras)) fail('versaoRegras');
  for (const key of Object.keys(value)) {
    if (key in Ficha.prototype) fail(`campo reservado ${key}`);
    if (value[key] != null && fields[key] && !fields[key](value[key])) fail(key);
  }
  for (const key of ['multiclasses', 'efeitos', 'magiasConjuracao']) {
    const ids = (value[key] || []).map((entry: any) => entry.id);
    if (new Set(ids).size !== ids.length) fail(`${key}: IDs duplicados`);
  }
  // References are embedded snapshots/names, not IDs from the current rule catalog.
  // Unknown old options remain valid. Only explicit class links must resolve locally.
  const classNames = new Set([value.classePrincipal?.nome, ...(value.multiclasses || []).map((m: any) => m.classe.nome)]);
  for (const entry of value.subClasse || []) {
    if (!classNames.has(entry.classe.nome)) fail('subClasse.classe: referência ausente');
  }
}

export function parseJSON(text: string): any {
  if (typeof text !== 'string' || new Blob([text]).size > MAX_INPUT_BYTES) fail('limite de 5 MiB');
  const value = JSON.parse(text);
  validateGraph(value);
  return value;
}

function unwrap(value: any, kind: string) {
  if (!object(value) || value.format !== 'minhafichadnd' || value.version !== 1 || value.kind !== kind) fail('envelope/versão');
  return value.data;
}

export function hydrateFicha(value: any): Ficha {
  const document = wireFicha(value);
  validateGraph(document);
  validateFicha(document);
  // Preserve unknown fields instead of dropping them in the constructor.
  const hydrated = restaurarModelos(mapUnlimitedRages(document, false));
  // Keep the last explicit selection, archiving every displaced snapshot.
  const selections = hydrated.subClasse ?? [];
  const displaced = selections.filter((s: any, i: number) => selections.slice(i + 1).some((next: any) => next.classe.nome === s.classe.nome));
  if (displaced.length) {
    hydrated.subclassesAnteriores = [...(hydrated.subclassesAnteriores ?? []), ...displaced];
    hydrated.subClasse = selections.filter((s: any) => !displaced.includes(s));
    hydrated.migracoes = [...(hydrated.migracoes ?? []), 'F3-subclasse-unica-v1'];
  }
  if (hydrated.atributosPersonagem) {
    hydrated.atributosPersonagem = Object.assign(new Atributos(), hydrated.atributosPersonagem);
  }
  if (hydrated.efeitos) hydrated.efeitos = hydrated.efeitos.map((e: any) => Object.assign(new Efeitos(), e));
  const ficha = Object.assign(new Ficha(hydrated), hydrated, { versaoRegras: hydrated.versaoRegras ?? 'DND_2014' });
  if (ficha.magiasEscolhidas?.length) migrarMagias(ficha);
  // Missing legacy counters are unknown, not evidence of zero recorded saves.
  if (document.recursos == null) ficha.recursos = { slots: {} };
  ficha.recursos.slots ??= {};
  ficha.itensSintonizados ??= [];
  migrarInventario(ficha, document.itensSintonizados == null);
  return ficha;
}

// The legacy rule catalog uses Infinity for unlimited rages. Encode this one
// semantic value explicitly; every numeric value in a document must be finite.
// Legacy null remains null (we cannot infer whether it originally was Infinity).
function mapUnlimitedRages(value: any, encode: boolean): any {
  if (!object(value) || (value.versaoRegras !== undefined && value.versaoRegras !== 'DND_2014')) return value;
  const mapClass = (c: any) => {
    if (!object(c) || c.nome !== 'barbaro' || !Array.isArray(c.niveis)) return c;
    return { ...c, niveis: c.niveis.map((n: any) => n?.nivel === 20 && n.furias === (encode ? Infinity : 'ilimitado')
      ? { ...n, furias: encode ? 'ilimitado' : Infinity } : n) };
  };
  return { ...value,
    ...(value.classePrincipal ? { classePrincipal: mapClass(value.classePrincipal) } : {}),
    ...(Array.isArray(value.multiclasses) ? { multiclasses: value.multiclasses.map((m: any) => m && ({ ...m, classe: mapClass(m.classe) })) } : {}),
    ...(Array.isArray(value.subClasse) ? { subClasse: value.subClasse.map((s: any) => s && ({ ...s, classe: mapClass(s.classe) })) } : {}),
  };
}

function wireFicha(value: any) { return mapUnlimitedRages(value, true); }

export function parseImport(text: string): Ficha {
  const value = parseJSON(text);
  return hydrateFicha(object(value) && ('format' in value || 'version' in value) ? unwrap(value, 'ficha') : value);
}

export function parseCollection(text: string | null): { fichas: Ficha[]; selectedId: string | null } {
  if (text === null) return { fichas: [], selectedId: null };
  const value = parseJSON(text);
  const data = Array.isArray(value) ? value : unwrap(value, 'colecao');
  if (!Array.isArray(data) || data.length > 500) fail('coleção (máximo 500 fichas)');
  const fichas: Ficha[] = data.map(hydrateFicha);
  if (new Set(fichas.map(f => f.id)).size !== fichas.length) fail('IDs duplicados');
  const selectedId = Array.isArray(value) ? null : value.selectedId ?? null;
  if (selectedId !== null && (!id(selectedId) || !fichas.some(f => f.id === selectedId))) fail('selectedId: referência ausente');
  return { fichas, selectedId };
}

export function serializeCollection(fichas: Ficha[], selectedId: string | null) {
  const data = fichas.map(wireFicha);
  validateGraph(data);
  data.forEach(validateFicha);
  const text = JSON.stringify({ format: 'minhafichadnd', version: 1, kind: 'colecao', selectedId, data });
  parseCollection(text);
  return text;
}

export function exportFicha(ficha: Ficha) {
  const data = wireFicha(ficha);
  validateGraph(data);
  validateFicha(data);
  const text = JSON.stringify({ format: 'minhafichadnd', version: 1, kind: 'ficha', data }, null, 2);
  if (new Blob([text]).size > MAX_INPUT_BYTES) fail('limite de 5 MiB');
  return text;
}

export type FichaStorage = Pick<Storage, 'getItem' | 'setItem'>;
export function persist(storage: FichaStorage, previous: string | null, next: string, recovery = false) {
  if (storage.getItem(STORAGE_KEY) !== previous) throw new Error('O armazenamento mudou em outra aba. Exporte suas alterações e releia os dados antes de continuar.');
  if (previous !== null) {
    if (next.includes('F8-inventario-v1') && !previous.includes('F8-inventario-v1')) {
      const key = 'fichas.backup.F8-inventario-v1';
      if (storage.getItem(key) === null) {
        storage.setItem(key, previous);
        if (storage.getItem(key) !== previous) throw new Error('Falha no backup F8.');
      }
    }
    if (next.includes('F6-conjuracao-v1') && !previous.includes('F6-conjuracao-v1')) {
      const migrationKey = 'fichas.backup.F6-conjuracao-v1';
      if (storage.getItem(migrationKey) === null) {
        storage.setItem(migrationKey, previous);
        if (storage.getItem(migrationKey) !== previous) throw new Error('Falha no backup da migração F6.');
      }
    }
    if (next.includes('F3-subclasse-unica-v1') && !previous.includes('F3-subclasse-unica-v1')) {
      const migrationKey = 'fichas.backup.F3-subclasse-unica-v1';
      if (storage.getItem(migrationKey) === null) {
        storage.setItem(migrationKey, previous);
        if (storage.getItem(migrationKey) !== previous) throw new Error('Falha no backup da migra??o F3.');
      }
    }
    const backupKey = recovery ? RECOVERY_KEY : BACKUP_KEY;
    storage.setItem(backupKey, previous);
    if (storage.getItem(backupKey) !== previous) throw new Error('Não foi possível verificar a cópia de segurança.');
  }
  storage.setItem(STORAGE_KEY, next);
  if (storage.getItem(STORAGE_KEY) !== next) throw new Error('Não foi possível verificar o salvamento. O original foi preservado na cópia de segurança.');
}
