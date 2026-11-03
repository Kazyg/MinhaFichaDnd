import { useEffect, useState } from 'react';
import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { RoteiroCampanha } from '../modelos';

const rascunhos = new Map<string, { id: string; titulo: string; conteudo: string }>();
export const idRascunhoRoteiro = (campanhaId: string) => rascunhos.get(JSON.stringify([campanhaId, 'novo']))?.id;
type Props = {
  campanhaId: string;
  idRoteiro: string;
  roteiro: RoteiroCampanha | null;
  onSalvar: (titulo: string, conteudo: string) => Promise<boolean>;
  onClose: () => void;
};

export default function EditorRoteiro({ campanhaId, idRoteiro, roteiro, onSalvar, onClose }: Props) {
  const chave = JSON.stringify([campanhaId, roteiro?.id ?? 'novo']);
  const anterior = rascunhos.get(chave);
  const [titulo, setTitulo] = useState(anterior?.titulo ?? roteiro?.titulo ?? '');
  const [conteudo, setConteudo] = useState(anterior?.conteudo ?? roteiro?.conteudo ?? '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const alterado = titulo !== (roteiro?.titulo ?? '') || conteudo !== (roteiro?.conteudo ?? '');
  useEffect(() => {
    if (alterado) rascunhos.set(chave, { id: idRoteiro, titulo, conteudo });
    else rascunhos.delete(chave);
    const antesDeSair = (evento: BeforeUnloadEvent) => {
      if (alterado) { evento.preventDefault(); evento.returnValue = ''; }
    };
    window.addEventListener('beforeunload', antesDeSair);
    return () => window.removeEventListener('beforeunload', antesDeSair);
  }, [alterado, chave, conteudo, idRoteiro, titulo]);
  const fechar = () => { if (!salvando) { if (alterado) setConfirmar(true); else onClose(); } };
  const salvar = async () => {
    if (!titulo.trim()) { setErro('Informe o título do roteiro.'); return; }
    setSalvando(true); setErro('');
    try {
      if (await onSalvar(titulo.trim(), conteudo)) { rascunhos.delete(chave); onClose(); }
      else setErro('Não foi possível salvar. O texto continua disponível nesta janela; verifique o erro de armazenamento.');
    } catch { setErro('Não foi possível salvar. Seu rascunho foi mantido.'); }
    finally { setSalvando(false); }
  };
  if (confirmar) return <div className="am-overlay">
    <AccessibleDialog key="confirmar" className="am-dialog" aria-label="Fechar roteiro sem salvar" onClose={() => setConfirmar(false)}>
      <h2>Fechar roteiro sem salvar?</h2>
      <p>O conteúdo modificado nesta janela será descartado. Se houve uma tentativa de salvar com erro, a campanha ainda pode ter alterações pendentes.</p>
      <div className="am-dialog-acoes">
        <button onClick={() => setConfirmar(false)}>Continuar editando</button>
        <button onClick={() => { rascunhos.delete(chave); onClose(); }}>Descartar rascunho e fechar</button>
      </div>
    </AccessibleDialog>
  </div>;
  return <div className="am-overlay">
    <AccessibleDialog key="editor" className="am-dialog am-editor-roteiro" aria-label={roteiro ? 'Editar roteiro' : 'Adicionar roteiro'} onClose={fechar}>
      <h2>{roteiro ? 'Editar roteiro' : 'Adicionar roteiro'}</h2>
      <form onSubmit={e => { e.preventDefault(); void salvar(); }}>
        <label htmlFor="am-roteiro-titulo">Título do roteiro</label>
        <input id="am-roteiro-titulo" maxLength={200} value={titulo} onChange={e => setTitulo(e.target.value)} disabled={salvando} />
        <label htmlFor="am-roteiro-conteudo">Conteúdo do roteiro</label>
        <textarea id="am-roteiro-conteudo" value={conteudo} onChange={e => setConteudo(e.target.value)} disabled={salvando} />
        {erro && <p role="alert">{erro}</p>}
        <div className="am-dialog-acoes">
          <button type="button" onClick={fechar} disabled={salvando}>Cancelar</button>
          <button className="am-primario" disabled={salvando}>{salvando ? 'Salvando roteiro…' : 'Salvar roteiro'}</button>
        </div>
      </form>
    </AccessibleDialog>
  </div>;
}
