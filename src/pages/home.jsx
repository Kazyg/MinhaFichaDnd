import React, { useState } from "react";
import iconFixaCriarNova from "../imagens/icon-fixa-criar-nova.png";
import iconFixaSalva from "../imagens/icon-fixa-salva.png";
import deleteIcon from "../imagens/delete_icon.png"
import { useNavigate } from "react-router-dom";
import "../pages/css/Home.css";
import { Ficha } from "../api/fichaPersonagem/FichaPersonagem.ts";
import { useFicha } from "../api/fichaPersonagem/FichaContext.tsx"
import { Efeitos } from "../api/classesPrincipais/Efeitos.ts";

export default function Home() {

  const navigate = useNavigate();
  const { setFicha, salvarFicha, fichas, refreshKey, deletarFicha } = useFicha();
  const [modalAberta, setModalAberta] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  const selecionarFicha = (ficha: ficha) => {
    setFicha(new Ficha(ficha));
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
    if (file) {
      setArquivoSelecionado(file);
    }
  };

  const importarFicha = () => {
    if (arquivoSelecionado) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const fichaJSON = e.target.result;
          const fichaCarregada = JSON.parse(fichaJSON);

          salvarFicha(fichaCarregada);
          selecionarFicha(fichaCarregada);

        } catch (error) {
          console.error("Erro ao carregar o arquivo JSON:", error);
          alert("Arquivo inválido. Por favor, selecione um JSON válido.");
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
          <button className="icon-button" onClick={() => setModalAberta(true)}>
            <img src={iconFixaSalva} alt="Carregar Ficha Salva" className="icon-image" />
            <span className="tooltip">Carregar Ficha Salva</span>
          </button>
          <button className="icon-button" onClick={() => {
            const ficha = new Ficha();
            setFicha(ficha);
            ficha.setEfeitos(new Efeitos());
            ficha.setLevelTotal(1);
            salvarFicha(ficha);
            navigate("/criar-ficha");
          }}>
            <img src={iconFixaCriarNova} alt="Criar Nova Ficha" className="icon-image" />
            <span className="tooltip">Criar Nova Ficha</span>
          </button>
        </div>
      </div>

      {/* 🔹 MODAL PARA SELEÇÃO DE FICHA */}
      {
        modalAberta && (
          <div key={refreshKey} className="modal-overlay" onClick={() => setModalAberta(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Selecione uma Ficha</h2>
              {fichas.length > 0 ? (
                <ul className="ficha-list">
                  {fichas.map((ficha) => (
                    <li key={ficha.id} className="ficha-item">
                      <span onClick={() => selecionarFicha(ficha)}>
                        {ficha.nomePersonagem || "Ficha sem Nome"}: {ficha.racaPrincipal?.nome || "sem raça"} / {ficha.classePrincipal?.nome || "sem classe"}
                      </span>
                      <button onClick={() => handleDeletar(ficha.id)} className="delete-button">
                        <img src={deleteIcon} alt="Deletar" className="delete-icon" title="Deletar" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Você não tem fichas salvas.</p>
              )}
              <li>
                <input type="file" accept=".json" onChange={handleFileChange} />
                <button onClick={importarFicha} disabled={!arquivoSelecionado}>
                  Confirmar Importação
                </button>
              </li>
              <button className="close-button" onClick={() => setModalAberta(false)}>Fechar</button>
            </div>
          </div>
        )
      }
    </>
  );
}
