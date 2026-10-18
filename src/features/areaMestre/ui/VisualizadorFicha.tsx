import { useEffect, useRef, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { AnexoCampanha, FichaOriginal } from '../modelos';
import VisualizadorDocumento from './VisualizadorDocumento';
import MiniaturaFicha from './MiniaturaFicha';

export default function VisualizadorFicha({ ficha, anexos, onFechar, onGerarPdf }: { ficha: FichaOriginal; anexos: AnexoCampanha[]; onFechar: () => void; onGerarPdf?: () => Promise<boolean> }) {
  const anexo = anexos.find(item => item.id === (ficha.formato === 'json' ? ficha.pdfAnexoId : ficha.anexoId));
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [gerando, setGerando] = useState(false);
  const gerar = useRef(onGerarPdf); gerar.current = onGerarPdf;
  useEffect(() => {
    if (ficha.formato !== 'json' || ficha.pdfAnexoId) return;
    let ativo = true;
    setGerando(true); setErro('');
    Promise.resolve().then(() => gerar.current?.()).then(ok => {
      if (ativo && !ok) setErro('Não foi possível gerar ou salvar o PDF. Tente novamente; o JSON original foi preservado.');
    }).catch(() => { if (ativo) setErro('Não foi possível gerar o PDF. Tente novamente.'); }).finally(() => { if (ativo) setGerando(false); });
    return () => { ativo = false; };
  }, [ficha.id, ficha.formato, ficha.pdfAnexoId, tentativa]);
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-visualizador-ficha" aria-label={`Ficha original: ${ficha.nome}`} onClose={onFechar}>
    <div className="am-documento-acoes"><h2>{ficha.nome}</h2><button type="button" onClick={onFechar}>Fechar ficha</button></div>
    {ficha.imagemAnexoId && ficha.imagemAnexoId !== ficha.anexoId && <figure className="am-retrato-ficha" aria-label={`Retrato de ${ficha.nome}`}><MiniaturaFicha ficha={ficha} anexos={anexos} /></figure>}
    {anexo ? <VisualizadorDocumento anexo={anexo} /> : ficha.formato === 'json' && !ficha.pdfAnexoId ? <>
      {gerando && <p role="status">Gerando e salvando PDF da ficha…</p>}
      {erro && <><p role="alert">{erro}</p><button type="button" onClick={() => setTentativa(n => n + 1)}>Tentar gerar PDF novamente</button></>}
    </> : <p role="alert">O arquivo original desta ficha não está disponível.</p>}
  </AccessibleDialog></div>;
}
