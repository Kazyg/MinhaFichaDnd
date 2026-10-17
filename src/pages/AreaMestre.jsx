import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFicha } from '../api/fichaPersonagem/FichaContext';
import SairIcon from './components/SairIcon';
import AccessibleDialog from './components/AccessibleDialog';
import iconCarregar from '../imagens/icon-fixa-salva.png';
import iconNova from '../imagens/icon-fixa-criar-nova.png';
import './css/Areas.css';
import './css/GerenciarFichas.css';

export default function AreaMestre() {
  const [carregandoCampanha, setCarregandoCampanha] = useState(false);
  const [arquivoCampanha, setArquivoCampanha] = useState(null);
  const [avisoImportacao, setAvisoImportacao] = useState('');
  const [popupAberto, setPopupAberto] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuButton = useRef(null);
  const navigate = useNavigate();
  const { salvarPendentes } = useFicha();
  const voltar = () => {
    setCarregandoCampanha(false);
    setArquivoCampanha(null);
    setAvisoImportacao('');
  };
  return (
    <div className="master-area">
      <header className="master-header">
        <div className="master-menu" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setMenuAberto(false); }} onKeyDown={e => { if (e.key === 'Escape') { setMenuAberto(false); menuButton.current?.focus(); } }}>
          <button ref={menuButton} aria-label="Menu do mestre" aria-expanded={menuAberto} aria-controls="acoes-mestre" onClick={() => setMenuAberto(!menuAberto)}>☰</button>
          {menuAberto && <div id="acoes-mestre"><button className="menu-sair" onClick={() => { if (salvarPendentes()) navigate('/'); }}><SairIcon /> Sair</button></div>}
        </div>
        <span>MinhaFichaDnd</span>
      </header>
      <main className="master-workspace" aria-label="Área do Mestre" />
      {popupAberto && !carregandoCampanha && <div className="fichas-overlay">
        <AccessibleDialog aria-label="Gerenciador de Campanhas" onClose={() => {}} className="fichas-dialog fichas-dialog-inicial">
          <h2>Gerenciador de Campanhas</h2>
          <div className="fichas-actions">
            <button aria-label="Carregar Campanha" title="Carregar Campanha" onClick={() => setCarregandoCampanha(true)}><img src={iconCarregar} alt="" /><span>Carregar Campanha</span></button>
            <button aria-label="Nova Campanha" title="Nova Campanha" onClick={() => setPopupAberto(false)}><img src={iconNova} alt="" /><span>Nova Campanha</span></button>
          </div>
        </AccessibleDialog>
      </div>}
      {carregandoCampanha && <div className="fichas-overlay">
        <AccessibleDialog aria-label="Selecione uma Campanha" onClose={voltar} className="fichas-dialog">
          <h2>Selecione uma Campanha</h2>
          <p>Você não tem campanhas salvas.</p>
          <label htmlFor="importar-campanha">Importar campanha JSON</label>
          <input id="importar-campanha" type="file" accept=".json,application/json" onChange={e => { setArquivoCampanha(e.target.files?.[0] || null); setAvisoImportacao(''); }} />
          {avisoImportacao && <p role="status">{avisoImportacao}</p>}
          <div className="fichas-dialog-footer fichas-import-actions">
            <button disabled={!arquivoCampanha} onClick={() => setAvisoImportacao('A importação de campanhas estará disponível em uma próxima etapa. Nenhum dado foi importado.')}>Confirmar Importação</button>
            <button onClick={voltar}>Voltar</button>
          </div>
        </AccessibleDialog>
      </div>}
    </div>
  );
}
