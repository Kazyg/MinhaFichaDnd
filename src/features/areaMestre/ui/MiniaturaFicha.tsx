import { useEffect, useState } from 'react';
import { AnexoCampanha, FichaOriginal } from '../modelos';

export default function MiniaturaFicha({ ficha, anexos }: { ficha: FichaOriginal; anexos: AnexoCampanha[] }) {
  const anexo = anexos.find(item => item.id === (ficha.imagemAnexoId || (ficha.formato === 'imagem' ? ficha.anexoId : '')));
  const [url, setUrl] = useState('');
  const [falhou, setFalhou] = useState(false);
  useEffect(() => {
    setFalhou(false);
    if (!anexo || !anexo.mime.startsWith('image/') || typeof URL.createObjectURL !== 'function') { setUrl(''); return; }
    const objeto = URL.createObjectURL(anexo.arquivo);
    setUrl(objeto);
    return () => URL.revokeObjectURL(objeto);
  }, [anexo]);
  return url && !falhou ? <img className="am-miniatura" src={url} alt="" onError={() => setFalhou(true)} /> : <span className="am-miniatura am-miniatura-vazia" aria-hidden="true">{ficha.formato === 'pdf' ? 'PDF' : '◆'}</span>;
}
