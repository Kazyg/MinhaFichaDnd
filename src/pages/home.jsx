import AccessibleDialog from "./components/AccessibleDialog";
import { hydrateFicha } from '../api/fichaPersonagem/fichaStorage';
import React, { useState } from "react";
import iconFixaCriarNova from "../imagens/icon-fixa-criar-nova.png";
import iconFixaSalva from "../imagens/icon-fixa-salva.png";
import deleteIcon from "../imagens/delete_icon.png"
import { useNavigate } from "react-router-dom";
import "../pages/css/Home.css";
import { Ficha } from "../api/fichaPersonagem/FichaPersonagem";
import { useFicha } from "../api/fichaPersonagem/FichaContext"
import { MAX_INPUT_BYTES, parseImport } from "../api/fichaPersonagem/fichaStorage";

export default function Home() {

  const navigate = useNavigate();
  const { setFicha, salvarFicha, importarFicha: persistirImportacao, fichas, deletarFicha, erro: erroPersistencia } = useFicha();
  const [modalAberta, setModalAberta] = useState(false);
  const [modalCriarFichaAberta, setModalCriarFichaAberta] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [erroImportacao, setErroImportacao] = useState('');
  const [importacaoPendente, setImportacaoPendente] = useState(null);

  const selecionarFicha = (fichaSelecionada) => {
    const fichaInstancia = fichaSelecionada instanceof Ficha ? fichaSelecionada : hydrateFicha(fichaSelecionada);
    setFicha(fichaInstancia);
    navigate("/criar-ficha");
  };

  const criarNovaFicha = (versaoRegras) => {
    const ficha = new Ficha({ versaoRegras });
    ficha.setLevelTotal(1);
    if (!salvarFicha(ficha)) return;
    setModalCriarFichaAberta(false);
    navigate("/criar-ficha");
  };

  const handleDeletar = (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta ficha?');
    if (confirmar) {
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
    const ficha = persistirImportacao(text, escolha);
    if (ficha) {
      setImportacaoPendente(null);
      navigate('/criar-ficha');
    }
  };
  const importarFicha = () => {
    if (arquivoSelecionado) {
      if (arquivoSelecionado.size > MAX_INPUT_BYTES) {
        setErroImportacao('Arquivo excede o limite de 5 MiB.');
        return;
      }
      const reader = new FileReader();
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

  return (
    <>
      <div className="home-container">
        <h1 className="home-title">Criador de Fichas de RPG</h1>
        <div className="button-container">
          <button className="icon-button" aria-label="Carregar Ficha Salva" aria-haspopup="dialog" onClick={() => setModalAberta(true)}>
            <img src={iconFixaSalva} alt="Carregar Ficha Salva" className="icon-image" />
            <span className="tooltip">Carregar Ficha Salva</span>
          </button>
          <button className="icon-button" aria-label="Criar Nova Ficha" aria-haspopup="dialog" onClick={() => setModalCriarFichaAberta(true)}>
            <img src={iconFixaCriarNova} alt="Criar Nova Ficha" className="icon-image" />
            <span className="tooltip">Criar Nova Ficha</span>
          </button>
        </div>
      </div>

      {
        modalCriarFichaAberta && (
          <div className="modal-overlay" onClick={() => setModalCriarFichaAberta(false)}>
            <AccessibleDialog aria-label="Escolha as regras da ficha" onClose={() => setModalCriarFichaAberta(false)} className="modal-content modal-criar-ficha" onClick={(e) => e.stopPropagation()}>
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
              <button className="close-button" onClick={() => setModalCriarFichaAberta(false)}>Fechar</button>
            </AccessibleDialog>
          </div>
        )
      }

      {/* 🔹 MODAL PARA SELEÇÃO DE FICHA */}
      {
        modalAberta && (
          <div  className="modal-overlay" onClick={() => setModalAberta(false)}>
            <AccessibleDialog aria-label="Selecione uma Ficha" onClose={() => setModalAberta(false)} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Selecione uma Ficha</h2>
              {erroPersistencia && <p role="alert">{erroPersistencia}</p>}
              {fichas.length > 0 ? (
                <ul className="ficha-list">
                  {fichas.map((ficha) => (
                    <li key={ficha.id} className="ficha-item">
                      <button type="button" className="selection-option" onClick={() => selecionarFicha(ficha)}>
                        {ficha.nomePersonagem || "Ficha sem Nome"}: {ficha.racaPrincipal?.nome || "sem raça"} / {ficha.classePrincipal?.nome || "sem classe"}
                      </button>
                      <button aria-label={`Excluir ${ficha.nomePersonagem || "Ficha sem Nome"}`} onClick={() => handleDeletar(ficha.id)} className="delete-button">
                        <img src={deleteIcon} alt="Deletar" className="delete-icon" title="Deletar" />
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
                <button onClick={importarFicha} disabled={!arquivoSelecionado}>
                  Confirmar Importação
                </button>
                {erroImportacao && <p id="erro-importacao" role="alert">{erroImportacao}</p>}
                {importacaoPendente && <div role="group" aria-label="ID já existente">
                  <p>Já existe uma ficha com este ID. Como deseja importar?</p>
                  <button onClick={() => concluirImportacao(importacaoPendente, 'copia')}>Importar como cópia</button>
                  <button onClick={() => concluirImportacao(importacaoPendente, 'substituir')}>Substituir ficha existente</button>
                  <button onClick={() => setImportacaoPendente(null)}>Cancelar importação</button>
                </div>}
              </div>
              <button className="close-button" onClick={() => setModalAberta(false)}>Fechar</button>
            </AccessibleDialog>
          </div>
        )
      }
    </>
  );
}
