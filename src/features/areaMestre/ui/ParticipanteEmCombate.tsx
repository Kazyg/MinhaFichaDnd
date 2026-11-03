import { useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { PopupVida } from '../../../pages/components/components_InformacoesPersonagem/ModalVida';
import { ajustarInstancia, aplicarCura, aplicarDano } from '../instancias';
import { DadosCampanha } from '../modelos';
import MiniaturaFicha from './MiniaturaFicha';
import './painelPV.css';

type Props = {
  dados: DadosCampanha; instanciaId: string; onFechar: () => void;
  onAbrirFicha: (fichaId: string) => void;
  onAtualizar: (alterar: (dados: DadosCampanha) => DadosCampanha) => Promise<boolean>;
};
export default function ParticipanteEmCombate({ dados, instanciaId, onFechar, onAbrirFicha, onAtualizar }: Props) {
  const instancia = dados.instancias.find(i => i.id === instanciaId);
  const ficha = dados.fichas.find(f => f.id === instancia?.fichaOriginalId);
  const [vida, setVida] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [aplicado, setAplicado] = useState(false);
  const [erro, setErro] = useState('');
  const pendente = useRef(false);
  const fechar = () => { if (!pendente.current) onFechar(); };
  if (!instancia) return <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label="Participante indisponível" onClose={fechar}><h2>Participante indisponível</h2><p role="alert">Recarregue a campanha para consultar esta instância.</p><button onClick={fechar}>Fechar</button></AccessibleDialog></div>;
  return vida ? <div className="popup-vida-global"><AccessibleDialog key="vida" className="popup-vida-content" aria-label={instancia.nome} onClose={fechar}>
    <PopupVida titulo={instancia.nome} vidaInicial={instancia.pv.atuais} vidaMaxima={instancia.pv.maximos} ocupado={ocupado || aplicado} restaurarComoEdicao onRestaurar={() => undefined} onCancelar={fechar} onConfirmar={(valor, cura, dano) => {
      if (pendente.current || aplicado) return;
      pendente.current = true; setOcupado(true); setErro('');
      void (async () => {
        try {
          const salvo = await onAtualizar(atual => aplicarDano(aplicarCura(ajustarInstancia(atual, instancia.id, instancia.nome, valor, instancia.pv.maximos), instancia.id, cura), instancia.id, dano));
          if (salvo) onFechar();
          else { setAplicado(true); setErro('As alterações de PV estão pendentes. Não reaplique dano ou cura; tente salvar novamente no aviso da campanha.'); }
        } catch (causa) { setErro(causa instanceof Error ? causa.message : 'Não foi possível atualizar os PV.'); }
        finally { pendente.current = false; setOcupado(false); }
      })();
    }} />
    {erro && <p role="alert">{erro}</p>}
    {aplicado && <button onClick={fechar}>Fechar e revisar aviso da campanha</button>}
  </AccessibleDialog></div> : <div className="am-overlay"><AccessibleDialog key="resumo" className="am-dialog am-participante-combate" aria-label={`Participante ${instancia.nome}`} onClose={fechar}>
    <h2>{instancia.nome}</h2>
    {ficha ? <MiniaturaFicha ficha={ficha} anexos={dados.anexos} /> : <span className="am-miniatura am-miniatura-vazia" aria-hidden="true">◆</span>}
    <p>Pontos de vida: {instancia.pv.atuais}/{instancia.pv.maximos}</p>
    {instancia.pv.atuais === 0 && <p>0 PV — permanece na ordem de iniciativa.</p>}
    <div className="am-dialog-acoes"><button onClick={fechar}>Fechar participante</button>{ficha && <button onClick={() => onAbrirFicha(ficha.id)}>Abrir ficha completa</button>}<button onClick={() => setVida(true)}>Ajustar vida</button></div>
  </AccessibleDialog></div>;
}
