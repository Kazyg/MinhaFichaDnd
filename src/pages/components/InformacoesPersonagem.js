import { useState } from "react";
import "../css/InformacoesPersonagem.css";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"

export default function InformacoesPersonagem() {
  const [nomePersonagem, setNomePersonagem] = useState("");
  const [nivel, setNivel] = useState(1);
  const [xp, setXp] = useState("");
  const [popupNivelAberto, setPopupNivelAberto] = useState(false);
  const [vida, setVida] = useState(100);
  const [ca, setCa] = useState(10);

  const { ficha, setFicha, refreshKey } = useFicha();

  const atributosIniciais = [
    {nome: "FOR", valor: 10},
    {nome: "DES", valor: 10},
    {nome: "CON", valor: 10},
    {nome: "INT", valor: 10},
    {nome: "SAB", valor: 10},
    {nome: "CAR", valor: 10}
  ];

  const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

  return (
    <div key={refreshKey} className="informacoes-personagem compact">
      <div className="campos-gerais">
        <div className="campo">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Nome do Personagem"
            value={nomePersonagem}
            onChange={(e) => setNomePersonagem(e.target.value)}
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

      <div className="atributos">
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

      <div className="vida-ca-container">
        <div className="ca-container">
          <label>CA</label>
          <div className="ca">
            <span>{ca}</span>
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
  );
}
