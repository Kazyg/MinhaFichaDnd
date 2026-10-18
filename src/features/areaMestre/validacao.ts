import { obterCondicao } from './catalogoCondicoes';
import { ErroPersistencia } from './erros';
import { DadosCampanha } from './modelos';

export const MAX_REGISTROS_CAMPANHA = 4096;
export const MAX_BYTES_CAMPANHA = 128 * 1024 * 1024;
const MAX_BYTES_ANEXO = 20 * 1024 * 1024;
const mimesImagem = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const mimes = [...mimesImagem, 'application/pdf', 'application/json'];
type Registro = Record<string, unknown>;
const falhar = (campo: string): never => { throw new ErroPersistencia('dados-corrompidos', `Dados da campanha inválidos: ${campo}.`); };
const texto = (v: unknown): v is string => typeof v === 'string';
const opcao = (v: unknown, opcoes: string[]): boolean => texto(v) && opcoes.includes(v);
const id = (v: unknown): v is string => texto(v) && v.trim().length > 0 && v.length <= 200;
const inteiro = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;
const booleano = (v: unknown): v is boolean => typeof v === 'boolean';
const data = (v: unknown): v is string => texto(v) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
function registro(v: unknown, campo: string, obrigatorios: string[], opcionais: string[] = []): Registro {
  if (!v || typeof v !== 'object' || Array.isArray(v)) falhar(campo);
  const proto = Object.getPrototypeOf(v);
  // Aceita objetos simples de outros realms (iframes/structured clone), não classes.
  if (proto !== null && (Object.getPrototypeOf(proto) !== null || Object.getOwnPropertyDescriptor(proto, 'constructor')?.value?.name !== 'Object')) falhar(campo);
  const valor = v as Registro;
  if (Object.getOwnPropertySymbols(valor).length || Object.values(Object.getOwnPropertyDescriptors(valor)).some(d => !('value' in d))) falhar(`${campo}: propriedades`);
  if (!obrigatorios.every(k => Object.prototype.hasOwnProperty.call(valor, k)) ||
    Object.keys(valor).some(k => !obrigatorios.includes(k) && !opcionais.includes(k))) falhar(`${campo}: campos`);
  return valor;
}
function exigir(condicao: unknown, campo: string): asserts condicao { if (!condicao) falhar(campo); }
function pv(v: unknown, campo: string) {
  const r = registro(v, campo, ['atuais', 'maximos']);
  exigir(inteiro(r.atuais) && inteiro(r.maximos) && r.atuais <= r.maximos, campo);
}
function lista(v: unknown, campo: string): unknown[] {
  exigir(Array.isArray(v) && v.length <= MAX_REGISTROS_CAMPANHA, campo);
  return v;
}
function entidades(v: unknown, campo: string, campos: string[], opcionais: string[] = []): Map<string, Registro> {
  const resultado = new Map<string, Registro>();
  for (const entrada of lista(v, campo)) {
    const r = registro(entrada, campo, ['id', ...campos], opcionais);
    exigir(id(r.id) && !resultado.has(r.id), `${campo}: identificador duplicado/inválido`);
    resultado.set(r.id, r);
  }
  return resultado;
}

/** Validação em runtime compartilhada entre IndexedDB e manifesto de backup. */
export function validarDadosCampanha(valor: unknown): asserts valor is DadosCampanha {
  const dados = registro(valor, 'campanha', ['campanha', 'anexos', 'fichas', 'instancias', 'combates', 'participantes', 'layout']);
  const c = registro(dados.campanha, 'metadados', ['id', 'schemaVersion', 'nome', 'roteiro', 'criadoEm', 'atualizadoEm'], ['revisao', 'roteiros']);
  exigir(id(c.id) && c.schemaVersion === 1 && texto(c.nome) && c.nome.trim() && texto(c.roteiro) && data(c.criadoEm) && data(c.atualizadoEm), 'metadados');
  exigir(c.revisao === undefined || inteiro(c.revisao), 'revisao');
  if (c.roteiros !== undefined) {
    const roteiros = entidades(c.roteiros, 'roteiros', ['titulo', 'conteudo', 'criadoEm', 'atualizadoEm']);
    for (const roteiro of Array.from(roteiros.values())) {
      exigir(texto(roteiro.titulo) && roteiro.titulo.trim() && roteiro.titulo.length <= 200 && texto(roteiro.conteudo) && data(roteiro.criadoEm) && data(roteiro.atualizadoEm), 'roteiro');
    }
  }
  const campanhaId = c.id;
  const pertence = (r: Registro) => exigir(r.campanhaId === campanhaId, 'referência de campanha');
  const anexos = entidades(dados.anexos, 'anexos', ['campanhaId', 'nome', 'mime', 'tamanho', 'arquivo']);
  let tamanhoTotal = 0;
  for (const a of Array.from(anexos.values())) {
    pertence(a);
    exigir(texto(a.nome) && a.nome.trim() && texto(a.mime) && mimes.includes(a.mime), 'anexo: nome/MIME');
    exigir(a.arquivo instanceof Blob && inteiro(a.tamanho) && a.tamanho > 0 && a.tamanho === a.arquivo.size && a.tamanho <= MAX_BYTES_ANEXO, 'anexo: bytes/tamanho');
    exigir(a.mime !== 'application/json' || a.tamanho <= 5 * 1024 * 1024, 'anexo JSON: limite');
    tamanhoTotal += a.tamanho;
  }
  exigir(tamanhoTotal <= MAX_BYTES_CAMPANHA, 'limite total dos anexos');
  const fichas = entidades(dados.fichas, 'fichas', ['campanhaId', 'categoria', 'formato', 'anexoId', 'nome', 'pvIniciais', 'origemPV', 'avisos', 'importadoEm'], ['imagemAnexoId', 'origemJson', 'pdfAnexoId']);
  for (const f of Array.from(fichas.values())) {
    pertence(f);
    exigir(opcao(f.categoria, ['jogador', 'monstro']) && opcao(f.formato, ['json', 'imagem', 'pdf']) && texto(f.nome) && data(f.importadoEm), 'ficha');
    const anexo = id(f.anexoId) ? anexos.get(f.anexoId) : undefined;
    exigir(anexo, 'ficha: anexo inexistente');
    exigir(f.formato === 'imagem' ? opcao(anexo.mime, mimesImagem) : anexo.mime === (f.formato === 'json' ? 'application/json' : 'application/pdf'), 'ficha: formato do anexo');
    exigir(f.formato !== 'json' || f.categoria === 'jogador', 'ficha JSON de monstro');
    if (f.pdfAnexoId !== undefined) exigir(f.formato === 'json' && id(f.pdfAnexoId) && anexos.get(f.pdfAnexoId)?.mime === 'application/pdf', 'ficha: PDF gerado inexistente/incompatível');
    if (f.imagemAnexoId !== undefined) exigir(id(f.imagemAnexoId) && opcao(anexos.get(f.imagemAnexoId)?.mime, mimesImagem), 'ficha: imagem inexistente');
    pv(f.pvIniciais, 'PV iniciais');
    exigir(opcao(f.origemPV, ['json', 'manual-pendente']), 'origem PV');
    exigir(lista(f.avisos, 'avisos').every(a => opcao(a, ['nome-ausente', 'pv-nao-identificados', 'pv-atuais-nao-identificados', 'extracao-manual'])), 'avisos');
    if (f.origemJson !== undefined) {
      const origem = registro(f.origemJson, 'origem JSON', ['id', 'versaoRegras', 'envelope']);
      exigir(id(origem.id) && opcao(origem.versaoRegras, ['DND_2014', 'DND_2024']) && booleano(origem.envelope) && f.formato === 'json', 'origem JSON');
    }
  }
  const instancias = entidades(dados.instancias, 'instancias', ['campanhaId', 'fichaOriginalId', 'categoria', 'nome', 'pv']);
  for (const i of Array.from(instancias.values())) {
    pertence(i);
    exigir(texto(i.nome) && i.nome.trim() && opcao(i.categoria, ['jogador', 'monstro']), 'instância');
    exigir(i.fichaOriginalId === null || (id(i.fichaOriginalId) && fichas.get(i.fichaOriginalId)?.categoria === i.categoria), 'instância: ficha inexistente/incompatível');
    pv(i.pv, 'PV da instância');
  }
  const combates = entidades(dados.combates, 'combates', ['campanhaId', 'estado', 'rodada', 'participanteAtivoId', 'iniciadoEm', 'encerradoEm'], ['execucao', 'nome', 'historico', 'condicoes']);
  for (const combate of Array.from(combates.values())) {
    pertence(combate);
    exigir(combate.nome === undefined || (texto(combate.nome) && combate.nome.trim().length > 0 && combate.nome.length <= 200), 'nome do combate');
    exigir(opcao(combate.estado, ['preparado', 'ativo', 'encerrado']) && inteiro(combate.rodada) &&
      (combate.estado === 'preparado' ? combate.rodada === 0 : combate.rodada >= 1) && data(combate.iniciadoEm), 'combate');
    exigir(combate.estado === 'encerrado' ? data(combate.encerradoEm) : combate.encerradoEm === null, 'encerramento de combate');
    if (combate.estado === 'preparado') exigir(combate.participanteAtivoId === null, 'preparado sem participante ativo');
  }
  const participantes = entidades(dados.participantes, 'participantes', ['combateId', 'instanciaId', 'iniciativa', 'ordem', 'pvInicio']);
  const ativos = new Set<string>();
  const vinculos = new Set<string>();
  const ordens = new Set<string>();
  const contagem = new Map<string, number>();
  for (const p of Array.from(participantes.values())) {
    exigir(id(p.combateId) && combates.has(p.combateId) && id(p.instanciaId) && (instancias.has(p.instanciaId) ||
      (combates.get(p.combateId)?.estado === 'encerrado' && combates.get(p.combateId)?.historico !== undefined)), 'participante: referência inexistente');
    exigir(typeof p.iniciativa === 'number' && Number.isSafeInteger(p.iniciativa) && inteiro(p.ordem), 'iniciativa/ordem');
    pv(p.pvInicio, 'snapshot de PV');
    const vinculo = JSON.stringify([p.combateId, p.instanciaId]);
    const ordem = JSON.stringify([p.combateId, p.ordem]);
    exigir(!vinculos.has(vinculo) && !ordens.has(ordem), 'participante/ordem duplicados');
    vinculos.add(vinculo); ordens.add(ordem);
    contagem.set(p.combateId, (contagem.get(p.combateId) ?? 0) + 1);
    if (combates.get(p.combateId)?.estado === 'ativo') {
      exigir(!ativos.has(p.instanciaId), 'instância em dois combates ativos');
      ativos.add(p.instanciaId);
    }
  }
  const idsCondicoes = new Set<string>();
  for (const [combateId, combate] of Array.from(combates)) {
    exigir((contagem.get(combateId) ?? 0) >= 2, 'combate: mínimo de participantes');
    exigir(combate.participanteAtivoId === null ? combate.estado !== 'ativo' :
      id(combate.participanteAtivoId) && participantes.get(combate.participanteAtivoId)?.combateId === combateId, 'participante ativo');
    if (combate.execucao !== undefined) {
      const e = registro(combate.execucao, 'execução', ['versao', 'ativadoEm', 'visitados', 'pvAtivacao'], ['origemSnapshot', 'ocorrenciaTurno']);
      exigir(e.ocorrenciaTurno === undefined || inteiro(e.ocorrenciaTurno), 'ocorrência de turno');
      exigir(e.origemSnapshot === undefined || opcao(e.origemSnapshot, ['ativacao', 'legado']), 'origem do snapshot');
      exigir(combate.estado !== 'preparado' && e.versao === 1 && data(e.ativadoEm), 'execução: versão/data');
      const visitados = lista(e.visitados, 'turnos visitados');
      exigir(visitados.length > 0 && new Set(visitados).size === visitados.length && visitados.every(p => id(p) && participantes.get(p)?.combateId === combateId) &&
        (combate.estado !== 'ativo' || visitados.includes(combate.participanteAtivoId)), 'execução: progresso da rodada');
      const snapshots = lista(e.pvAtivacao, 'PV de ativação');
      const ids = new Set<string>();
      for (const entrada of snapshots) {
        const snapshot = registro(entrada, 'snapshot de ativação', ['participanteId', 'instanciaId', 'pv']);
        exigir(id(snapshot.participanteId) && !ids.has(snapshot.participanteId) && participantes.get(snapshot.participanteId)?.combateId === combateId &&
          participantes.get(snapshot.participanteId)?.instanciaId === snapshot.instanciaId, 'snapshot: participante/instância');
        ids.add(snapshot.participanteId);
        pv(snapshot.pv, 'PV de ativação');
      }
      exigir(ids.size === contagem.get(combateId), 'snapshot de ativação incompleto');
    }
    const validarCondicoes = (valor: unknown, historico: boolean) => {
      if (valor === undefined) return;
      exigir(combate.estado !== 'preparado', 'condições em encontro preparado');
      const idsLocais = new Set<string>();
      for (const entrada of lista(valor, 'condições')) {
        const e = registro(entrada, 'condição', ['id', 'campanhaId', 'combateId', 'participanteId', 'tipo', 'duracao', 'restantes', 'momento', 'ignorarOcorrencia'], ['nomePersonalizado', 'nivel', 'observacao']);
        exigir(id(e.id) && !idsLocais.has(e.id) && (historico || !idsCondicoes.has(e.id)), 'condição: identificador');
        idsLocais.add(e.id as string);
        if (!historico) idsCondicoes.add(e.id as string);
        exigir(e.campanhaId === campanhaId && e.combateId === combateId && id(e.participanteId) && participantes.get(e.participanteId)?.combateId === combateId, 'condição: vínculo');
        exigir(texto(e.tipo) && obterCondicao(e.tipo), 'condição: tipo');
        exigir(e.tipo === 'personalizado' ? texto(e.nomePersonalizado) && e.nomePersonalizado.trim().length > 0 && e.nomePersonalizado.length <= 100 : e.nomePersonalizado === undefined, 'condição: nome personalizado');
        exigir(e.tipo === 'exaustao' ? inteiro(e.nivel) && e.nivel <= 6 : e.nivel === undefined, 'condição: nível');
        exigir(opcao(e.duracao, ['manual', 'turnos']) && (e.duracao === 'manual' ? e.restantes === null : inteiro(e.restantes) && e.restantes > 0), 'condição: duração');
        exigir(opcao(e.momento, ['inicio', 'final']), 'condição: momento');
        const execucao = combate.execucao as Registro | undefined;
        exigir(e.ignorarOcorrencia === null || (inteiro(e.ignorarOcorrencia) && e.ignorarOcorrencia <= (typeof execucao?.ocorrenciaTurno === 'number' ? execucao.ocorrenciaTurno : 0)), 'condição: ocorrência ignorada');
        exigir(e.observacao === undefined || (texto(e.observacao) && e.observacao.length <= 500), 'condição: observação');
      }
    };
    validarCondicoes(combate.condicoes, false);
    if (combate.historico !== undefined) {
      const h = registro(combate.historico, 'histórico', ['versao', 'decisaoPV', 'iniciadoEm', 'participantes'], ['condicoes']);
      exigir(combate.estado === 'encerrado' && h.versao === 1 && opcao(h.decisaoPV, ['manter', 'restaurar']) && data(h.iniciadoEm), 'histórico: estado/decisão/data');
      const entradas = lista(h.participantes, 'participantes históricos');
      const ids = new Set<string>();
      for (const entrada of entradas) {
        const s = registro(entrada, 'participante histórico', ['participanteId', 'instanciaId', 'fichaOriginalId', 'nome', 'categoria', 'iniciativa', 'ordem', 'pvInicial', 'pvFinal']);
        const p = id(s.participanteId) ? participantes.get(s.participanteId) : undefined;
        exigir(p && p.combateId === combateId && p.instanciaId === s.instanciaId && p.iniciativa === s.iniciativa && p.ordem === s.ordem &&
          !ids.has(s.participanteId as string), 'histórico: vínculo/ordem/iniciativa');
        ids.add(s.participanteId as string);
        exigir((s.fichaOriginalId === null || id(s.fichaOriginalId)) && texto(s.nome) && s.nome.trim() && opcao(s.categoria, ['jogador', 'monstro']), 'histórico: identidade');
        pv(s.pvFinal, 'PV finais históricos');
        if (s.pvInicial !== null) pv(s.pvInicial, 'PV iniciais históricos');
        exigir(h.decisaoPV !== 'restaurar' || s.pvInicial !== null, 'histórico: restauração sem snapshot');
      }
      exigir(ids.size === contagem.get(combateId), 'histórico incompleto');
      validarCondicoes(h.condicoes, true);
    }
  }
  const layout = registro(dados.layout, 'layout', ['campanhaId', 'versao', 'sidebarRecolhida', 'paineis'], ['larguraSidebar', 'larguraPV']);
  pertence(layout);
  exigir(layout.versao === 1 && booleano(layout.sidebarRecolhida), 'layout: versão');
  exigir(layout.larguraSidebar === undefined || (inteiro(layout.larguraSidebar) && layout.larguraSidebar >= 200 && layout.larguraSidebar <= 400), 'largura da sidebar');
  exigir(layout.larguraPV === undefined || (inteiro(layout.larguraPV) && layout.larguraPV >= 240 && layout.larguraPV <= 440), 'largura do painel PV');
  const paineis = entidades(layout.paineis, 'painéis', ['tipo', 'x', 'y', 'largura', 'altura', 'recolhido', 'fechado']);
  for (const p of Array.from(paineis.values())) {
    exigir(opcao(p.tipo, ['monstros', 'jogadores', 'roteiro', 'pv']) && inteiro(p.x) && inteiro(p.y) && inteiro(p.largura) && p.largura > 0 && inteiro(p.altura) && p.altura > 0 && booleano(p.recolhido) && booleano(p.fechado), 'painel');
  }
}
