import React, { useEffect, useRef, useState } from 'react';
import AccessibleDialog from './AccessibleDialog';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { hydrateFicha, MAX_INPUT_BYTES, parseImport } from '../../api/fichaPersonagem/fichaStorage';
import iconFixaCriarNova from '../../imagens/icon-fixa-criar-nova.png';
import iconFixaSalva from '../../imagens/icon-fixa-salva.png';
import '../css/Home.css';
import '../css/GerenciarFichas.css';

export default function GerenciarFichas({ onClose }) {
  const leitura = useRef(null);
  useEffect(() => () => {
    if (leitura.current?.readyState === FileReader.LOADING) leitura.current.abort();
  }, []);
  const { salvarFicha, importarFicha: persistirImportacao, fichas, deletarFicha, salvarPendentes, erro: erroPersistencia } = useFicha();
  const [modalAberta, setModalAberta] = useState(false);
  const [modalCriarFichaAberta, setModalCriarFichaAberta] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [erroImportacao, setErroImportacao] = useState('');
  const [importacaoPendente, setImportacaoPendente] = useState(null);

  const selecionarFicha = (fichaSelecionada) => {
    const fichaInstancia = fichaSelecionada instanceof Ficha ? fichaSelecionada : hydrateFicha(fichaSelecionada);
    if (!salvarPendentes()) return;
    if (salvarFicha(fichaInstancia)) onClose();
  };

  const criarNovaFicha = (versaoRegras) => {
    if (!salvarPendentes()) return;
    const ficha = new Ficha({ versaoRegras });
    ficha.setLevelTotal(1);
    if (!salvarFicha(ficha)) return;
    setModalCriarFichaAberta(false);
    onClose();
  };

  const handleDeletar = (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta ficha?');
    if (confirmar && salvarPendentes()) {
      deletarFicha(id);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImportacaoPendente(null);
    setErroImportacao('');
    setArquivoSelecionado(file || null);
  };

  const concluirImportacao = (text, escolha) => {
    if (!salvarPendentes()) return;
    const ficha = persistirImportacao(text, escolha);
    if (ficha) {
      setImportacaoPendente(null);
      onClose();
    }
  };
  const importarFicha = () => {
    if (arquivoSelecionado) {
      if (arquivoSelecionado.size > MAX_INPUT_BYTES) {
        setErroImportacao('Arquivo excede o limite de 5 MiB.');
        return;
      }
      const reader = new FileReader();
      leitura.current = reader;
      reader.onerror = () => setErroImportacao('Não foi possível ler o arquivo.');
      reader.onload = (e) => {
        try {
          const fichaJSON = e.target.result;
          const fichaInstancia = parseImport(fichaJSON);
          setErroImportacao('');
          if (fichas.some(f => f.id === fichaInstancia.id)) {
            setImportacaoPendente(fichaJSON);
          } else {
            concluirImportacao(fichaJSON);
          }
        } catch (error) {
          setErroImportacao(error.message || 'Arquivo inválido.');
        }
      };

      reader.readAsText(arquivoSelecionado);
    }
  };

  const inicial = !modalAberta && !modalCriarFichaAberta;
  const titulo = modalCriarFichaAberta ? 'Escolha as regras da ficha' : modalAberta ? 'Selecione uma Ficha' : 'Criador de Fichas de RPG';
  const voltar = () => { setModalAberta(false); setModalCriarFichaAberta(false); };
  return (
    <div className="fichas-overlay" data-testid="fichas-overlay">
      <AccessibleDialog key={titulo} aria-label={titulo} onClose={voltar} className={`fichas-dialog ${inicial ? 'fichas-dialog-inicial' : ''}`}>
        {!modalAberta && !modalCriarFichaAberta && <>
          <h2>Criador de Fichas de RPG</h2>
          <div className="fichas-actions">
            <button aria-label="Carregar Ficha Salva" title="Carregar ficha" onClick={() => setModalAberta(true)}><img src={iconFixaSalva} alt="" /><span>Carregar ficha</span></button>
            <button aria-label="Criar Nova Ficha" title="Nova ficha" onClick={() => setModalCriarFichaAberta(true)}><img src={iconFixaCriarNova} alt="" /><span>Nova ficha</span></button>
          </div>
        </>}
        {modalCriarFichaAberta && <>
              <h2>Escolha as regras da ficha</h2>
              {erroPersistencia && <p role="alert">{erroPersistencia}</p>}
              <p>Selecione qual versão de D&D 5ª edição será usada como base.</p>
              <div className="versao-regras-list">
                <button className="versao-regras-button" onClick={() => criarNovaFicha("DND_2024")}>
                  <strong>D&D 5ª edição - Regras 2024</strong>
                  <span>Livro do Jogador 2024 e regras revisadas.</span>
                </button>
                <button className="versao-regras-button" onClick={() => criarNovaFicha("DND_2014")}>
                  <strong>D&D 5ª edição - Regras 2014 (Legacy)</strong>
                  <span>Regras clássicas da 5ª edição original.</span>
                </button>
              </div>


        </>}
        {modalAberta && <>
              <h2>Selecione uma Ficha</h2>
              {erroPersistencia && <p role="alert">{erroPersistencia}</p>}
              {fichas.length > 0 ? (
                <ul className="ficha-list">
                  {fichas.map((ficha) => (
                    <li key={ficha.id} className="ficha-item">
                      <button type="button" className="selection-option" onClick={() => selecionarFicha(ficha)}>
                        <span>{ficha.nomePersonagem || "Ficha sem Nome"}: {ficha.racaPrincipal?.nome || "sem raça"} / {ficha.classePrincipal?.nome || "sem classe"}</span>
                        <span className="ficha-versao">Versão {ficha.versaoRegras === "DND_2024" ? "2024" : "2014"}</span>
                      </button>
                      <button aria-label={`Excluir ${ficha.nomePersonagem || "Ficha sem Nome"}`} onClick={() => handleDeletar(ficha.id)} className="delete-button">
                        <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Você não tem fichas salvas.</p>
              )}
              <div>
                <label htmlFor="importar-ficha">Importar ficha JSON</label>
                <input id="importar-ficha" aria-invalid={!!erroImportacao} aria-describedby={erroImportacao ? "erro-importacao" : undefined} type="file" accept=".json" onChange={handleFileChange} />
                {erroImportacao && <p id="erro-importacao" role="alert">{erroImportacao}</p>}
                {importacaoPendente && <div role="group" aria-label="ID já existente">
                  <p>Já existe uma ficha com este ID. Como deseja importar?</p>
                  <button onClick={() => concluirImportacao(importacaoPendente, 'copia')}>Importar como cópia</button>
                  <button onClick={() => concluirImportacao(importacaoPendente, 'substituir')}>Substituir ficha existente</button>
                  <button onClick={() => setImportacaoPendente(null)}>Cancelar importação</button>
                </div>}
              </div>


        </>}
        <div className={`fichas-dialog-footer ${modalAberta ? 'fichas-import-actions' : ''}`}>
          {modalAberta && <button onClick={importarFicha} disabled={!arquivoSelecionado}>Confirmar Importação</button>}
          {(modalAberta || modalCriarFichaAberta) && <button onClick={voltar}>Voltar</button>}
        </div>
      </AccessibleDialog>
    </div>
  );
}
