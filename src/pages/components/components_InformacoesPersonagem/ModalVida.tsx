import AccessibleDialog from "../AccessibleDialog";
import React, { useState } from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext";
import { Portal } from "./Portal"
import "../../css/popupVida.css"
import { selecionarVida, explicarParcelas } from "../../../api/fichaPersonagem/fichaSeletores";
const calcularVida = (ficha: Parameters<typeof selecionarVida>[0]) => selecionarVida(ficha).total;

interface PopupVidaProps {
    onConfirmar: (novaVida: number, cura: number, dano: number) => void;
    onCancelar: () => void;
    onRestaurar: () => void;
}

const PopupVida: React.FC<PopupVidaProps> = ({ onConfirmar, onCancelar, onRestaurar }) => {
    const { ficha } = useFicha();
    const [vidaEditada, setVidaEditada] = useState(ficha?.vidaAtual || 0);
    const [cura, setCura] = useState(0);
    const [dano, setDano] = useState(0);

    const handleChangeCura = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = parseInt(e.target.value, 10);
        if (!isNaN(valor)) {
            setCura(Math.max(0, valor));
        }
    };
    const handleChangeDano = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = parseInt(e.target.value, 10);
        if (!isNaN(valor)) {
            setDano(Math.max(0, valor));
        }
    };

    return (
        <div>
            <div>
                <h3>Ajustar Vida</h3>
                <p>Restaurar Vida altera apenas PV atuais; não realiza descanso.</p>
                <div className="barra-deslizante-mobile">
                    {vidaEditada}
                    <input
                        aria-label="Pontos de vida atuais"
                        type="range"
                        min={0}
                        max={calcularVida(ficha)}
                        value={vidaEditada}
                        onChange={(e) => setVidaEditada(parseInt(e.target.value, 10))}
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="campo-texto">
                    <div className="campo-texto1">
                        <h5>Dano:</h5>
                        <input
                            type="number"
                            max={calcularVida(ficha)}
                            aria-label="Dano"
                            onChange={handleChangeDano}
                        />
                    </div>
                    <div className="campo-texto1">
                        <h5>Cura:</h5>
                        <input
                            type="number"
                            max={calcularVida(ficha)}
                            aria-label="Cura"
                            onChange={handleChangeCura}
                        />
                    </div>
                </div>
                <div className="botoes">
                    <button onClick={() => {
                        onConfirmar(vidaEditada, cura, dano)
                    }}>Confirmar</button>
                    <button onClick={onCancelar}>Cancelar</button>
                    <button onClick={onRestaurar}>Restaurar Vida</button>
                </div>
            </div>
        </div>
    );
};

const VidaComponente: React.FC = () => {
    const { ficha, forceUpdate } = useFicha();
    const [mostrarPopup, setMostrarPopup] = useState(false);


    const handleConfirmar = (novaVida: number, cura: number, dano: number) => {
        novaVida += cura;
        if (novaVida > calcularVida(ficha)) {
            novaVida = calcularVida(ficha)
        }
        novaVida -= dano;
        if (novaVida < 0) {
            novaVida = 0
        }
        ficha?.setVidaAtual(novaVida);
        forceUpdate();
        setMostrarPopup(false);
    };

    const handleRestaurar = () => {
        ficha?.setVidaAtual(calcularVida(ficha));
        forceUpdate();
        setMostrarPopup(false);
    };

    return (
        <div className="vida" title={`${selecionarVida(ficha).manual ? 'Máximo manual salvo. Referência: ' : ''}${explicarParcelas(selecionarVida(ficha).parcelas)}`}>
            <h4>Vida</h4>
            {ficha?.vidaAtual ?? 0}/{calcularVida(ficha)}
            <button type="button" className="barra-vida" aria-label="Ajustar vida" aria-haspopup="dialog" onClick={() => setMostrarPopup(true)}>
                <span
                    className="vida-atual"
                    style={{ width: `${((ficha?.vidaAtual || 0) / Math.max(1, calcularVida(ficha))) * 100}%` }}
                >
                </span>
            </button>
            {mostrarPopup && (
                <Portal>
                    <div className="popup-vida-global">
                        <AccessibleDialog className="popup-vida-content" aria-label="Ajustar Vida" onClose={() => setMostrarPopup(false)}>
                            <PopupVida
                                onConfirmar={handleConfirmar}
                                onCancelar={() => setMostrarPopup(false)}
                                onRestaurar={handleRestaurar}
                            />
                        </AccessibleDialog>
                    </div>
                </Portal>
            )}
        </div>
    );
};

export default VidaComponente;
