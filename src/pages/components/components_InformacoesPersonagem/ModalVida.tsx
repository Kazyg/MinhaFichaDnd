import React, { useState } from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import { Ficha } from "../../../api/fichaPersonagem/FichaPersonagem.ts";
import "../../css/popupVida.css"

interface PopupVidaProps {
    onConfirmar: (novaVida: number) => void;
    onCancelar: () => void;
    onRestaurar: () => void;
}

const PopupVida: React.FC<PopupVidaProps> = ({ onConfirmar, onCancelar, onRestaurar }) => {
    const { ficha } = useFicha();
    const [vidaTemporaria, setVidaTemporaria] = useState(ficha?.vidaAtual || 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = parseInt(e.target.value, 10);
        if (!isNaN(valor)) {
            setVidaTemporaria(Math.max(0, Math.min(calcularVida(ficha), valor)));
        }
    };

    const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

    const calcularVida = (ficha: Ficha | null): number => {
        let vidaTotal = 0;
        if (ficha) {
            const { levelTotal, multiclasses, atributosPersonagem, efeitos } = ficha;
            if (atributosPersonagem) {
                let constituicaoAtual = atributosPersonagem.constituicao.valor;

                if (levelTotal) for (let nivel = 1; nivel <= levelTotal; nivel++) {
                    const classeNoNivel = multiclasses?.find((m: any) => m.nivelEscolhido.includes(nivel));
                    const dadoVida = classeNoNivel?.classe.dadosVida;

                    const efeitosConstituicao = efeitos?.filter((e: any) => e.level === nivel && e.atributo === "constituição");
                    if (efeitosConstituicao) if (efeitosConstituicao.length > 0) {
                        const bonusConstituicao = efeitosConstituicao.reduce((acc: number, e: any) => acc + e.bonus, 0);
                        if (constituicaoAtual) constituicaoAtual += bonusConstituicao;
                    }

                    const modificadorConstituicao = calcularModificador(constituicaoAtual);

                    if (nivel === 1 && dadoVida) {
                        vidaTotal = dadoVida + modificadorConstituicao;
                    } else if (dadoVida) {
                        const vidaAdicional = Math.ceil((dadoVida + 1) / 2) + modificadorConstituicao;
                        vidaTotal += vidaAdicional;
                    }
                }
            }
        }
        return vidaTotal;
    };

    return (
        <div className="popup-vida">
            <h3>Ajustar Vida</h3>
            <div className="barra-deslizante-mobile">
                <input
                    type="range"
                    min={0}
                    max={calcularVida(ficha)}
                    value={vidaTemporaria}
                    onChange={(e) => setVidaTemporaria(parseInt(e.target.value, 10))}
                    style={{ width: "100%" }}
                />
            </div>
            <div className="campo-texto">
                <input
                    type="number"
                    min={0}
                    max={calcularVida(ficha)}
                    value={vidaTemporaria}
                    onChange={handleChange}
                />
            </div>
            <div className="botoes">
                <button onClick={() => onConfirmar(vidaTemporaria)}>Confirmar</button>
                <button onClick={onCancelar}>Cancelar</button>
                <button onClick={onRestaurar}>Restaurar Vida</button>
            </div>
        </div>
    );
};

const VidaComponente: React.FC = () => {
    const { ficha } = useFicha();
    const [mostrarPopup, setMostrarPopup] = useState(false);

    const handleConfirmar = (novaVida: number) => {
        ficha?.setVidaAtual(novaVida);
        setMostrarPopup(false);
    };

    const handleRestaurar = () => {
        ficha?.setVidaAtual(calcularVida(ficha));
        setMostrarPopup(false);
    };

    const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

    const calcularVida = (ficha: Ficha | null): number => {
        let vidaTotal = 0;
        if (ficha) {
            const { levelTotal, multiclasses, atributosPersonagem, efeitos } = ficha;
            if (atributosPersonagem) {
                let constituicaoAtual = atributosPersonagem.constituicao.valor;

                if (levelTotal) for (let nivel = 1; nivel <= levelTotal; nivel++) {
                    const classeNoNivel = multiclasses?.find((m: any) => m.nivelEscolhido.includes(nivel));
                    const dadoVida = classeNoNivel?.classe.dadosVida;

                    const efeitosConstituicao = efeitos?.filter((e: any) => e.level === nivel && e.atributo === "constituição");
                    if (efeitosConstituicao) if (efeitosConstituicao.length > 0) {
                        const bonusConstituicao = efeitosConstituicao.reduce((acc: number, e: any) => acc + e.bonus, 0);
                        if (constituicaoAtual) constituicaoAtual += bonusConstituicao;
                    }

                    const modificadorConstituicao = calcularModificador(constituicaoAtual);

                    if (nivel === 1 && dadoVida) {
                        vidaTotal = dadoVida + modificadorConstituicao;
                    } else if (dadoVida) {
                        const vidaAdicional = Math.ceil((dadoVida + 1) / 2) + modificadorConstituicao;
                        vidaTotal += vidaAdicional;
                    }
                }
            }
        }
        return vidaTotal;
    };

    return (
        <div className="vida">
            <h4>Vida</h4>
            {ficha?.vidaAtual}/{calcularVida(ficha)}
            <div className="barra-vida" onClick={() => setMostrarPopup(true)}>
                <div
                    className="vida-atual"
                    style={{ width: `${((ficha?.vidaAtual || 0) / calcularVida(ficha)) * 100}%` }}
                >
                </div>
            </div>
            {mostrarPopup && (
                <PopupVida
                    onConfirmar={handleConfirmar}
                    onCancelar={() => setMostrarPopup(false)}
                    onRestaurar={handleRestaurar}
                />
            )}
        </div>
    );
};

export default VidaComponente;