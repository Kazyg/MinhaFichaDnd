import { useState } from "react";
import "../css/InformacoesPersonagem.css";
import iconCa from "../../imagens/icon_ac.png"
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"

export default function InformacoesPersonagem() {
  const [nivel, setNivel] = useState(1);
  const [xp, setXp] = useState("");
  const [popupNivelAberto, setPopupNivelAberto] = useState(false);
  const [vida, setVida] = useState(100);
  const [ca, setCa] = useState(10);

  const { ficha, refreshKey, forceUpdate } = useFicha();
  const [tempNome, setTempNome] = useState(ficha?.nomePersonagem);

  const atributosIniciais = [
    { id: 1, nome: "FOR", valor: 10, nomeDesc: "Força" },
    { id: 2, nome: "DES", valor: 10, nomeDesc: "Destreza" },
    { id: 3, nome: "CON", valor: 10, nomeDesc: "Constituição" },
    { id: 4, nome: "INT", valor: 10, nomeDesc: "Inteligência" },
    { id: 5, nome: "SAB", valor: 10, nomeDesc: "Sabedoria" },
    { id: 6, nome: "CAR", valor: 10, nomeDesc: "Carisma" }
  ];

  const calcularProeficiencia = (idAtributo) => {
    let nomeTesteResistencia = atributosIniciais.find(a => a.id === idAtributo).nomeDesc;

    if (ficha?.classePrincipal?.testesResistencias?.includes(nomeTesteResistencia)) {
      return ficha?.proeficiencia ?? 0;
    }
    return 0;
  }

  const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

  return (
    <div key={refreshKey} className="informacoes-personagem compact">
      <div className="container-principal">
        {/* Coluna 1: Nome, Nível, XP */}
        <div className="coluna-1">
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome do Personagem"
              value={tempNome}
              onChange={(e) => {
                setTempNome(e.target.value);
                clearTimeout(window.nomeTimeout);
                window.nomeTimeout = setTimeout(() => {
                  ficha.setNomePersonagem(e.target.value);
                  forceUpdate();
                }, 1500); // Aguarda 500ms depois que o usuário para de digitar
              }}
            />
          </div>

          <div className="campo">
            <label>Nível</label>
            <button className="botao-nivel" onClick={() => setPopupNivelAberto(true)}>Nível: {nivel}</button>
          </div>

          <div className="campo">
            <label>XP</label>
            <input
              type="text"
              placeholder="XP"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </div>
        </div>
        {/* Popup de Nível */}
        {popupNivelAberto && (
          <div className="popup-info-personagem">
            <h3>Escolha o Nível</h3>
            <div className="popup-content-info-personagem">
              {[...Array(20)].map((_, i) => (
                <button key={i + 1} onClick={() => { setNivel(i + 1); setPopupNivelAberto(false); }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPopupNivelAberto(false)}>X</button>
            </div>
          </div>
        )}

        {/* Coluna 2: Atributos */}
        <div className="coluna-2">
          <h4>Atributos</h4>
          <div className="atributos-container">
            {Object.entries(ficha?.atributosPersonagem || atributosIniciais).map(([atributo, dados]) => (
              <div key={atributo} className="atributo">
                <span className="atributo-nome">{dados.nome}</span>
                <span> / </span>
                <span className="atributo-valor">{dados.valor}</span>
                <div className="atributo-divisoria" />
                <span className="atributo-mod">{calcularModificador(dados.valor) >= 0 ? `+${calcularModificador(dados.valor)}` : calcularModificador(dados.valor)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 3: Proficiências */}
        <div className="coluna-3">
          <h4>Proficiências</h4>
          <div className="proficiencias-container">
            {Object.entries(ficha?.atributosPersonagem || atributosIniciais).map(([atributo, dados]) => (
              <div key={atributo} className="proficiencia">
                <span className="proficiencia-nome" title={dados.tipo}>{dados.nome}</span>
                <span> / </span>
                <div className="proficiencia-divisoria" />
                <span className="proficiencia-mod">{parseInt(calcularModificador(dados.valor) >= 0 ? `+${calcularModificador(dados.valor)}` : calcularModificador(dados.valor)) + (calcularProeficiencia(dados.id))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 4: CA e Vida */}
        <div className="coluna-4">
          <div className="ca-container">
            <img src={iconCa} alt="CA" className="icon-ca"></img>
            <span className="ca-text">{ca}</span>
            <div className="ca">
              <span className="ca-detalhes">Explicação da CA aqui</span>
            </div>
          </div>

          <div className="vida">
            <h4>Vida</h4>
            <div className="barra-vida">
              <div className="vida-atual" style={{ width: `${vida}%` }}>
                {vida}/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
