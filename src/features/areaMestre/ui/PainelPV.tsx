import { useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha, InstanciaFicha } from '../modelos';
import { ajustarInstancia, aplicarCura, aplicarDano, duplicarInstancia, removerInstancia } from '../instancias';
import { PopupVida } from '../../../pages/components/components_InformacoesPersonagem/ModalVida';
import './painelPV.css';

type Props = { dados: DadosCampanha; onAtualizar: (atualizar: (dados: DadosCampanha) => DadosCampanha) => Promise<boolean>; onAbrirFicha: (fichaId: string) => void };
type Edicao = { id: string; nome: string; atuais: string; maximos: string };
export default function PainelPV({ dados, onAtualizar, onAbrirFicha }: Props) {
  const [selecionada, setSelecionada] = useState<InstanciaFicha | null>(null);
  const [detalhes, setDetalhes] = useState(false);
  const [aplicado, setAplicado] = useState(false);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [remocao, setRemocao] = useState<InstanciaFicha | null>(null);
  const executar = async (atualizar: (dados: DadosCampanha) => DadosCampanha) => {
    setOcupado(true); setErro('');
    try {
      const salvo = await onAtualizar(atualizar);
      if (!salvo) setErro('Não foi possível salvar. As alterações permanecem pendentes na campanha. Não reaplique dano ou cura: use a opção de tentar salvar novamente no aviso da campanha.');
      return salvo;
    } catch (e) { setErro(e instanceof Error ? e.message : 'Não foi possível atualizar os PV.'); return false; }
    finally { setOcupado(false); }
  };
  const numero = (texto: string) => {
    if (!/^\d+$/.test(texto) || !Number.isSafeInteger(Number(texto))) throw new Error('Informe um número inteiro não negativo e seguro.');
    return Number(texto);
  };
  const salvarEdicao = () => {
    if (!edicao) return;
    void executar(atual => ajustarInstancia(atual, edicao.id, edicao.nome, numero(edicao.atuais), numero(edicao.maximos))).then(salvo => { if (salvo) setEdicao(null); });
  };
  return <div className="am-controles-pv">
    <h2>♥ Pontos de vida</h2>
    {erro && !selecionada && !edicao && !remocao && <p role="alert">{erro}</p>}
    {(['jogador', 'monstro'] as const).map(categoria => <section key={categoria} aria-label={categoria === 'jogador' ? 'PV dos jogadores' : 'PV dos monstros'}>
      <h3>{categoria === 'jogador' ? 'Jogadores' : 'Monstros'}</h3>
      {!dados.instancias.some(item => item.categoria === categoria) && <p>Nenhuma instância.</p>}
      {dados.instancias.filter(item => item.categoria === categoria).map(instancia => {
        const situacao = instancia.pv.maximos === 0 ? 'indefinido' : instancia.pv.atuais === 0 ? 'derrotado' : instancia.pv.atuais === instancia.pv.maximos ? 'completo' : 'ferido';
        const status = { indefinido: 'PV máximos não definidos', derrotado: 'Derrotado', completo: 'PV completos', ferido: 'Ferido' }[situacao];
        return <article key={instancia.id} aria-label={`PV de ${instancia.nome}`} className={`am-pv-instancia am-pv-${situacao}`}>
          <strong>{instancia.nome}</strong>
          <span>{instancia.pv.atuais}/{instancia.pv.maximos}</span>
          <button className="barra-vida am-pv-barra" aria-label={`Ajustar vida de ${instancia.nome}: ${instancia.pv.atuais}/${instancia.pv.maximos}, ${status}`} aria-haspopup="dialog" onClick={() => { setSelecionada({ ...instancia, pv: { ...instancia.pv } }); setDetalhes(false); setErro(''); setAplicado(false); }}>
            <span className="vida-atual" style={{ width: `${100 * instancia.pv.atuais / Math.max(1, instancia.pv.maximos)}%` }} />
          </button>
          {instancia.pv.maximos === 0 && <small>PV máximos não definidos</small>}
        </article>;
      })}
    </section>)}
    {selecionada && !edicao && !remocao && <div className="popup-vida-global"><AccessibleDialog key={detalhes ? 'detalhes' : 'vida'} className="popup-vida-content" aria-label={selecionada.nome} onClose={() => { if (!ocupado) setSelecionada(null); }}>
      {!detalhes ? <>
        <PopupVida key={selecionada.id} titulo={selecionada.nome} vidaInicial={selecionada.pv.atuais} vidaMaxima={selecionada.pv.maximos} ocupado={ocupado || aplicado} restaurarComoEdicao onRestaurar={() => undefined} onCancelar={() => setSelecionada(null)} onConfirmar={(valor, cura, dano) => {
          void executar(atual => aplicarDano(aplicarCura(ajustarInstancia(atual, selecionada.id, selecionada.nome, valor, selecionada.pv.maximos), selecionada.id, cura), selecionada.id, dano)).then(salvo => { if (salvo) setSelecionada(null); else setAplicado(true); });
        }} />
        {aplicado && <button onClick={() => setSelecionada(null)}>Fechar e revisar aviso da campanha</button>}
        <button disabled={ocupado || aplicado} className="am-pv-detalhes" onClick={() => setDetalhes(true)}>Detalhes da instância</button>
      </> : <>
        <h3>{selecionada.nome}</h3>
        <div className="am-pv-acoes">
          <button onClick={() => { setEdicao({ id: selecionada.id, nome: selecionada.nome, atuais: String(selecionada.pv.atuais), maximos: String(selecionada.pv.maximos) }); setSelecionada(null); }}>Editar instância</button>
          {selecionada.fichaOriginalId && <button onClick={() => { setSelecionada(null); onAbrirFicha(selecionada.fichaOriginalId!); }}>Abrir ficha</button>}
          {selecionada.categoria === 'monstro' && <button disabled={ocupado} onClick={() => { const id = crypto.randomUUID(); void executar(atual => duplicarInstancia(atual, selecionada.id, id)).then(salvo => { if (salvo) setSelecionada(null); }); }}>Duplicar</button>}
          <button disabled={ocupado} onClick={() => { setRemocao(selecionada); setSelecionada(null); }}>Remover</button>
          <button disabled={ocupado} onClick={() => setSelecionada(null)}>Fechar</button>
        </div>
      </>}
      {erro && <p role="alert">{erro}</p>}
    </AccessibleDialog></div>}
    {edicao && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Editar instância" onClose={() => { if (!ocupado) setEdicao(null); }}>
      <h2>Editar instância</h2>
      <form onSubmit={e => { e.preventDefault(); salvarEdicao(); }}>
        <label>Nome da instância<input maxLength={200} value={edicao.nome} onChange={e => setEdicao({ ...edicao, nome: e.target.value })} disabled={ocupado} /></label>
        <label>PV atuais<input type="number" min="0" step="1" value={edicao.atuais} onChange={e => setEdicao({ ...edicao, atuais: e.target.value })} disabled={ocupado} /></label>
        <label>PV máximos<input type="number" min="0" step="1" value={edicao.maximos} onChange={e => setEdicao({ ...edicao, maximos: e.target.value })} disabled={ocupado} /></label>
        <p>Se os PV atuais ultrapassarem o novo máximo, serão reduzidos ao máximo informado. Máximo zero significa PV não definidos.</p>
        {erro && <p role="alert">{erro}</p>}
        <div className="am-dialog-acoes"><button type="button" disabled={ocupado} onClick={() => setEdicao(null)}>Cancelar</button><button disabled={ocupado}>Salvar instância</button></div>
      </form>
    </AccessibleDialog></div>}
    {remocao && <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Remover instância" onClose={() => { if (!ocupado) setRemocao(null); }}>
      <h2>Remover {remocao.nome}?</h2><p>A ficha original e as outras instâncias serão preservadas.</p>
      {erro && <p role="alert">{erro}</p>}
      <div className="am-dialog-acoes"><button disabled={ocupado} onClick={() => setRemocao(null)}>Cancelar</button><button disabled={ocupado} onClick={() => void executar(atual => removerInstancia(atual, remocao.id)).then(salvo => { if (salvo) setRemocao(null); })}>Confirmar remoção</button></div>
    </AccessibleDialog></div>}
  </div>;
}
