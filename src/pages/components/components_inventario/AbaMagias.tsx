import React, { useState } from "react";
import ModalSelecaoMagias from "../../modals/ModalMagias.tsx";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";

export default function AbaMagias() {
  const [modalMagiasAberta, setModalMagiasAberta] = useState(false);
  const { ficha } = useFicha();
  const [magiaConhecidas, setMagiaConhecidas] = useState(0);
  const [espacosMagia, setEspacosMagia] = useState(0);
  const [espacosTruque, setEspacosTruqe] = useState(0);

  function calcularMagiasConhecidas(){
    
  }

  function calcularEspacosMagia(){

  }

  return (
    <>
      <div className="magias">
        <h3>Magias Aprendidas</h3>
        <button className="adicionar-armas" onClick={() => setModalMagiasAberta(true)}>
          Escolher Magia
        </button>
        <div className="magia-container">
          <div className="magia-coluna1">

          </div>
          <div className="maiga-coluna2">

          </div>
        </div>
      </div>
      {modalMagiasAberta && (
        <>
          <div className="popup-overlay" onClick={() => setModalMagiasAberta(false)}></div>
          <div className="popup">
            <ModalSelecaoMagias
              onSelect={(magia) => {

              }}
              onClose={() => setModalMagiasAberta(false)}
              titulo="Lista de Magias"
            />
          </div>
        </>
      )}
    </>
  );
}