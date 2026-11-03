import { PointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha, ParticipanteCombate } from '../modelos';
import MiniaturaFicha from './MiniaturaFicha';
import { nomeCombate } from '../encerramentoCombate';
import { nomeCondicao, obterCondicao } from '../catalogoCondicoes';
import IconeCondicao from './IconeCondicao';
import './condicoes.css';
import './barraIniciativa.css';

interface Props {
  dados: DadosCampanha; combateId: string; ocupado: boolean;
  onAvancar: () => Promise<boolean>;
  onReordenar: (ordem: string[]) => Promise<boolean>;
  onAbrirParticipante: (instanciaId: string) => void;
  onEncerrar?: () => void;
  onAdicionarCondicao?: (participanteId: string) => void;
  onEditarCondicao?: (participanteId: string, condicaoId?: string) => void;
}


export function janelaIniciativa(ordem: ParticipanteCombate[], ativo: string | null, rodada: number) {
  const indice = ordem.findIndex(p => p.id === ativo);
  if (indice < 0 || !ordem.length) return [];
  return [-2, -1, 0, 1, 2].map(deslocamento => {
    const virtual = indice + deslocamento;
    const participante = ordem[((virtual % ordem.length) + ordem.length) % ordem.length];
    const volta = BigInt(rodada) + BigInt(Math.floor(virtual / ordem.length));
    return { participante, deslocamento, chave: `${participante.id}:${volta}` };
  });
}

export default function BarraIniciativa({ dados, combateId, ocupado, onAvancar, onReordenar, onAbrirParticipante, onEncerrar, onAdicionarCondicao, onEditarCondicao }: Props) {
  const combate = dados.combates.find(c => c.id === combateId);
  const participantes = dados.participantes.filter(p => p.combateId === combateId).sort((a, b) => a.ordem - b.ordem);
  const janela = janelaIniciativa(participantes, combate?.participanteAtivoId ?? null, combate?.rodada ?? 1);
  const faixa = useRef<HTMLUListElement>(null);
  const listaCompleta = useRef<HTMLOListElement>(null);
  const posicoes = useRef(new Map<string, { rect: DOMRect; opacidade: number }>());
  const animacoes = useRef<Animation[]>([]);
  const larguraFaixa = useRef(0);
  const arraste = useRef<{ id: string; alvo: string; inicioX: number; inicioY: number; moveu: boolean; pointerId: number } | null>(null);
  const operacao = useRef(false);
  const suprimirClique = useRef(false);
  const [alvo, setAlvo] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [reorganizar, setReorganizar] = useState(false);
  const [compacto, setCompacto] = useState(() => window.matchMedia?.('(max-width:450px)').matches ?? false);
  const bloqueado = ocupado || pendente;
  const nomeAtivo = dados.instancias.find(i => i.id === participantes.find(p => p.id === combate?.participanteAtivoId)?.instanciaId)?.nome;
  const assinatura = JSON.stringify(janela.map(p => p.chave));

  useEffect(() => { if (ocupado) { arraste.current = null; setAlvo(null); } }, [ocupado]);
  useEffect(() => {
    const tamanho = window.matchMedia?.('(max-width:450px)');
    const movimento = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const medir = () => setCompacto(tamanho?.matches ?? false);
    const reduzir = () => { if (movimento?.matches) animacoes.current.forEach(a => a.cancel()); };
    tamanho?.addEventListener?.('change', medir);
    movimento?.addEventListener?.('change', reduzir);
    return () => { tamanho?.removeEventListener?.('change', medir); movimento?.removeEventListener?.('change', reduzir); };
  }, []);
  useLayoutEffect(() => {
    animacoes.current.forEach(a => a.cancel()); animacoes.current = [];
    const proximas = new Map<string, { rect: DOMRect; opacidade: number }>();
    const reduzido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const largura = window.innerWidth;
    const redimensionou = larguraFaixa.current !== largura;
    larguraFaixa.current = largura;
    faixa.current?.querySelectorAll<HTMLElement>('[data-ocorrencia]').forEach(elemento => {
      const chave = elemento.dataset.ocorrencia!;
      const rect = elemento.getBoundingClientRect();
      const anterior = posicoes.current.get(chave);
      const opacidade = elemento.hasAttribute('aria-current') ? 1 : .8;
      proximas.set(chave, { rect, opacidade });
      if (!reduzido && !redimensionou && posicoes.current.size && rect.width > 0 && typeof elemento.animate === 'function') {
        const x = anterior ? anterior.rect.left - rect.left : rect.width * .7;
        const escala = anterior ? anterior.rect.width / rect.width : .95;
        animacoes.current.push(elemento.animate([
          { transform: `translateX(${x}px) scale(${escala})`, opacity: anterior?.opacidade ?? 0 },
          { transform: 'translateX(0) scale(1)', opacity: opacidade },
        ], { duration: 220, easing: 'ease-out' }));
      }
    });
    posicoes.current = proximas;

  }, [assinatura, compacto]);
  useEffect(() => () => { animacoes.current.forEach(a => a.cancel()); }, []);

  if (!combate || combate.estado !== 'ativo') return null;
  async function executar(acao: () => Promise<boolean>, sucesso: string) {
    if (bloqueado || operacao.current) return;
    operacao.current = true; setPendente(true);
    try { setMensagem(await acao() ? sucesso : 'Não foi possível salvar. Tente novamente.'); }
    catch { setMensagem('Não foi possível salvar. Tente novamente.'); }
    finally { operacao.current = false; setPendente(false); }
  }
  function mover(id: string, destino: number) {
    const ordem = participantes.map(p => p.id);
    const origem = ordem.indexOf(id);
    if (origem < 0 || destino < 0 || destino >= ordem.length || origem === destino) return;
    ordem.splice(origem, 1); ordem.splice(destino, 0, id);
    void executar(() => onReordenar(ordem), 'Ordem da iniciativa atualizada.');
  }
  const fecharOrdem = () => {
    if (bloqueado) return;
    arraste.current = null; setAlvo(null); setReorganizar(false);
  };
  const cancelarGesto = (evento: PointerEvent) => {
    if (arraste.current?.pointerId === evento.pointerId) { arraste.current = null; setAlvo(null); }
  };
  const handle = (p: ParticipanteCombate) => {
    const nome = dados.instancias.find(i => i.id === p.instanciaId)?.nome ?? 'Participante';
    return <button type="button" className="am-iniciativa-arrastar" disabled={bloqueado} aria-label={`Reorganizar ${nome}`} title="Arraste para mover. Setas, Home e End reordenam; Enter abre a ordem completa." onClick={e => {
      if (e.detail !== 0 && suprimirClique.current) { suprimirClique.current = false; return; }
      setReorganizar(true);
    }} onKeyDown={e => {
      if (e.key === 'Escape' && arraste.current) { e.preventDefault(); arraste.current = null; setAlvo(null); suprimirClique.current = true; return; }
      const indice = participantes.findIndex(item => item.id === p.id);
      const destino = e.key === 'ArrowLeft' ? indice - 1 : e.key === 'ArrowRight' ? indice + 1 : e.key === 'Home' ? 0 : e.key === 'End' ? participantes.length - 1 : null;
      if (destino !== null) { e.preventDefault(); mover(p.id, destino); }
    }} onPointerDown={e => {
      if (bloqueado || arraste.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
      suprimirClique.current = false;
      arraste.current = { id: p.id, alvo: p.id, inicioX: e.clientX, inicioY: e.clientY, moveu: false, pointerId: e.pointerId };
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }} onPointerMove={e => {
      const atual = arraste.current;
      if (!atual || atual.pointerId !== e.pointerId || bloqueado) return;
      if (Math.hypot(e.clientX - atual.inicioX, e.clientY - atual.inicioY) > 5) atual.moveu = true;
      if (!atual.moveu) return;
      suprimirClique.current = true;
      const lista = reorganizar ? listaCompleta.current : faixa.current;
      if (!lista) return;
      const limite = lista.getBoundingClientRect();
      if (reorganizar) {
        if (e.clientY < limite.top + 36) lista.scrollTop -= 28;
        else if (e.clientY > limite.bottom - 36) lista.scrollTop += 28;
      }
      const cartao = document.elementFromPoint?.(e.clientX, e.clientY)?.closest<HTMLElement>('[data-iniciativa-real-id]');
      if (cartao && lista.contains(cartao) && cartao.dataset.iniciativaRealId) { atual.alvo = cartao.dataset.iniciativaRealId; setAlvo(atual.alvo); }
    }} onPointerUp={e => {
      const atual = arraste.current;
      if (!atual || atual.pointerId !== e.pointerId) return;
      arraste.current = null; setAlvo(null);
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      if (atual.moveu) mover(atual.id, participantes.findIndex(item => item.id === atual.alvo));
    }} onPointerCancel={cancelarGesto} onLostPointerCapture={cancelarGesto}><svg aria-hidden="true" focusable="false" viewBox="0 0 18 18">{[5, 9, 13].flatMap(y => [6, 12].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" />))}</svg></button>;
  };

  return <section className="am-barra-iniciativa" aria-label="Barra de iniciativa" aria-busy={bloqueado}>
    <div className="am-iniciativa-identificacao"><small title={nomeCombate(dados, combate)}>{nomeCombate(dados, combate)}</small><strong>Rodada {combate.rodada}</strong></div>
    <div className="am-roleta-viewport"><ul ref={faixa} className="am-iniciativa-faixa" aria-label="Ordem de iniciativa">
      {janela.map(({ participante: p, deslocamento, chave }) => {
        const instancia = dados.instancias.find(i => i.id === p.instanciaId);
        if (!instancia) return null;
        const ficha = dados.fichas.find(f => f.id === instancia.fichaOriginalId);
        const condicoes = (combate.condicoes ?? []).filter(c => c.participanteId === p.id);

        const principal = (!compacto || Math.abs(deslocamento) < 2) && [...janela].filter(item => item.participante.id === p.id).sort((a, b) => Math.abs(a.deslocamento) - Math.abs(b.deslocamento) || b.deslocamento - a.deslocamento)[0].chave === chave;
        const descricaoCopia = principal ? '' : janela.filter(item => item.participante.id === p.id).length > 1 ? ' (repetição visual)' : ' (prévia)';
        const conteudo = <>{ficha ? <MiniaturaFicha ficha={ficha} anexos={dados.anexos} /> : <span className="am-miniatura am-miniatura-vazia" aria-hidden="true">◆</span>}<span><strong>{instancia.nome}</strong><small>PV {instancia.pv.atuais}/{instancia.pv.maximos}{instancia.pv.atuais === 0 ? ' · 0 PV' : ''}</small></span></>;
        return <li key={chave} data-ocorrencia={chave} data-iniciativa-real-id={p.id} aria-current={deslocamento === 0 ? 'step' : undefined} aria-label={`${deslocamento === 0 ? 'Turno atual' : deslocamento < 0 ? `Anterior ${-deslocamento}` : `Próximo ${deslocamento}`}: ${instancia.nome}${descricaoCopia}`} title={`Posição real ${p.ordem + 1} · Iniciativa ${p.iniciativa}`} className={`am-iniciativa-cartao${alvo === p.id ? ' am-iniciativa-destino' : ''}${instancia.pv.atuais === 0 ? ' am-iniciativa-zero' : ''}`}>
          {principal ? <><button type="button" className="am-iniciativa-abrir" disabled={bloqueado} aria-label={`Abrir participante ${instancia.nome}`} onClick={() => onAbrirParticipante(instancia.id)}>{conteudo}</button>{handle(p)}</> : <div className="am-iniciativa-abrir am-iniciativa-copia" aria-hidden="true">{conteudo}</div>}
          {principal && onAdicionarCondicao && <button type="button" className="am-iniciativa-adicionar-condicao" title="Adicionar condição" aria-label={`Adicionar condição a ${instancia.nome}`} disabled={bloqueado} onClick={() => onAdicionarCondicao(p.id)}>+</button>}
          {!!condicoes.length && <div className="am-iniciativa-condicoes" aria-hidden={principal ? undefined : true}>{condicoes.slice(0, 2).map(c => {
            const catalogo = obterCondicao(c.tipo);
            const descricao = `${nomeCondicao(c)}${c.tipo === 'exaustao' ? ` · nível ${c.nivel}` : ''} · ${c.duracao === 'manual' ? '∞ · duração ilimitada' : `${c.restantes} turnos restantes · ${c.momento === 'inicio' ? 'Início' : 'Final'} do turno`}${c.observacao ? ` · ${c.observacao}` : ''}`;
            const conteudoCondicao = <><IconeCondicao icone={catalogo?.icone} /><span>{c.duracao === 'manual' ? '∞' : c.restantes}</span></>;
            return principal && onEditarCondicao ? <button type="button" key={c.id} title={descricao} aria-label={`Editar ${descricao} de ${instancia.nome}`} disabled={bloqueado} className={`am-iniciativa-condicao am-condicao-${catalogo?.categoria}`} onClick={() => onEditarCondicao(p.id, c.id)}>{conteudoCondicao}</button> : <span key={c.id} title={descricao} className={`am-iniciativa-condicao am-condicao-${catalogo?.categoria}`}>{conteudoCondicao}</span>;
          })}{condicoes.length > 2 && (principal && onEditarCondicao ? <button type="button" disabled={bloqueado} title="Todas as condições" aria-label={`Ver todas as ${condicoes.length} condições de ${instancia.nome}`} className="am-iniciativa-condicao" onClick={() => onEditarCondicao(p.id)}>+{condicoes.length - 2}</button> : <span className="am-iniciativa-condicao">+{condicoes.length - 2}</span>)}</div>}
        </li>;
      })}
    </ul></div>
    <div className="am-iniciativa-acoes">
      <button type="button" className="am-primario am-iniciativa-proximo" disabled={bloqueado} onClick={() => void executar(onAvancar, 'Turno avançado.')}>Próximo turno <span aria-hidden="true">→</span></button>
      {onEncerrar && <button type="button" className="am-iniciativa-encerrar" disabled={bloqueado} onClick={onEncerrar}>Encerrar combate</button>}
    </div>
    <span role="status" className="am-sr">{nomeAtivo ? `Turno de ${nomeAtivo}. Rodada ${combate.rodada}.` : ''} {mensagem}</span>
    {mensagem.startsWith('Não') && !reorganizar && <p role="alert" className="am-iniciativa-erro">{mensagem}</p>}
    {reorganizar && <div className="am-overlay"><AccessibleDialog className="am-dialog am-ordem-completa" aria-label="Reorganizar iniciativa" onClose={fecharOrdem}>
      <h2>Reorganizar iniciativa</h2><p>Arraste pelo handle ou escolha a posição real. No handle, use as setas, Home ou End.</p>
      <ol ref={listaCompleta} aria-label="Ordem completa">{participantes.map((p, indice) => {
        const instancia = dados.instancias.find(i => i.id === p.instanciaId)!;
        return <li key={p.id} data-iniciativa-real-id={p.id} className={alvo === p.id ? 'am-iniciativa-destino' : undefined}><button className="am-ordem-nome" disabled={bloqueado} aria-label={`Abrir participante ${instancia.nome}`} onClick={() => { setReorganizar(false); onAbrirParticipante(instancia.id); }}>{instancia.nome}</button><label>Posição de {instancia.nome}<select disabled={bloqueado} value={indice} onChange={e => mover(p.id, Number(e.target.value))}>{participantes.map((destino, i) => <option key={destino.id} value={i}>{i + 1} — {dados.instancias.find(inst => inst.id === destino.instanciaId)?.nome}</option>)}</select></label>{handle(p)}</li>;
      })}</ol><p role="status">{mensagem}</p><div className="am-dialog-acoes"><button disabled={bloqueado} onClick={fecharOrdem}>Concluir reordenação</button></div>
    </AccessibleDialog></div>}
  </section>;
}
