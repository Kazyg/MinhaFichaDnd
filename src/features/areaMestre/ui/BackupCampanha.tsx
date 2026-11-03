import { useEffect, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { DadosCampanha } from '../modelos';

export default function BackupCampanha({ modo, dados, onRestaurar, onPrepararExportacao, onFechar }: {
  modo: 'exportar' | 'restaurar'; dados: DadosCampanha | null;
  onRestaurar: (arquivo: Blob) => Promise<boolean>;
  onPrepararExportacao: () => Promise<boolean>; onFechar: () => void;
}) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  const executar = async () => {
    setOcupado(true); setErro('');
    try {
      if (modo === 'restaurar' && arquivo) {
        if (await onRestaurar(arquivo)) onFechar(); else setErro('Não foi possível restaurar. Consulte o erro de armazenamento; a campanha atual foi preservada.');
      } else if (modo === 'exportar' && dados) {
        if (!await onPrepararExportacao()) { setErro('Salve as alterações pendentes antes de exportar.'); return; }
        const { exportarBackup } = await import('../backup');
        setUrl(URL.createObjectURL(await exportarBackup(dados)));
      }
    } catch (causa) { setErro(causa instanceof Error ? causa.message : 'Não foi possível processar o backup.'); }
    finally { setOcupado(false); }
  };
  return <div className="am-overlay"><AccessibleDialog className="am-dialog" aria-label={modo === 'exportar' ? 'Exportar backup' : 'Restaurar backup'} onClose={() => { if (!ocupado) onFechar(); }}>
    <h2>{modo === 'exportar' ? 'Exportar backup' : 'Restaurar backup'}</h2>
    {modo === 'restaurar' ? <><p>A restauração cria uma nova campanha, preservando as campanhas existentes. Selecione o ZIP exportado pela Área do Mestre.</p><label>Arquivo de backup<input type="file" accept=".zip,application/zip" disabled={ocupado} onChange={e => setArquivo(e.target.files?.[0] ?? null)} /></label></> : <p>O backup inclui fichas originais, retratos, instâncias, PV, roteiros e layout da campanha.</p>}
    {ocupado && <p role="status">Processando backup…</p>}{erro && <p role="alert">{erro}</p>}
    {url && <p><a className="am-backup-download" href={url} download="minhafichadnd-campanha.zip">Baixar backup ZIP</a></p>}
    <div className="am-dialog-acoes"><button disabled={ocupado} onClick={onFechar}>Fechar</button><button disabled={ocupado || (modo === 'restaurar' ? !arquivo : !dados)} onClick={() => void executar()}>{modo === 'exportar' ? 'Gerar backup' : 'Restaurar como nova campanha'}</button></div>
  </AccessibleDialog></div>;
}
