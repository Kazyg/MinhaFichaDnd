import React, { useEffect, useState } from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import { Ficha } from "../../../api/fichaPersonagem/FichaPersonagem.ts";
import { Portal } from "./Portal.tsx"
import "../../css/popupVida.css"

interface PopupVidaProps {
    onConfirmar: (novaVida: number, cura: number, dano: number) => void;
    onCancelar: () => void;
    onRestaurar: () => void;
}

const PopupVida: React.FC<PopupVidaProps> = ({ onConfirmar, onCancelar, onRestaurar }) => {
    const { ficha } = useFicha();
    const [vidaTemporaria, setVidaTemporaria] = useState(ficha?.vidaAtual || 0);
    const [cura, setCura] = useState(0);
    const [dano, setDano] = useState(0);

    const handleChangeCura = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = parseInt(e.target.value, 10);
        if (!isNaN(valor)) {
            setCura(valor);
        }
    };
    const handleChangeDano = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = parseInt(e.target.value, 10);
        if (!isNaN(valor)) {
            setDano(valor);
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
        <div>
            <div>
                <h3>Ajustar Vida</h3>
                <div className="barra-deslizante-mobile">
                    {vidaTemporaria}
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
                    <div className="campo-texto1">
                        <h5>Dano:</h5>
                        <input
                            type="number"
                            max={calcularVida(ficha)}
                            onChange={handleChangeDano}
                        />
                    </div>
                    <div className="campo-texto1">
                        <h5>Cura:</h5>
                        <input
                            type="number"
                            max={calcularVida(ficha)}
                            onChange={handleChangeCura}
                        />
                    </div>
                </div>
                <div className="botoes">
                    <button onClick={() => {
                        onConfirmar(vidaTemporaria, cura, dano)
                    }}>Confirmar</button>
                    <button onClick={onCancelar}>Cancelar</button>
                    <button onClick={onRestaurar}>Restaurar Vida</button>
                </div>
            </div>
        </div>
    );
};

const VidaComponente: React.FC = () => {
    const { ficha } = useFicha();
    const [mostrarPopup, setMostrarPopup] = useState(false);
    useEffect(() => {
        if (mostrarPopup) {
            const popup = document.createElement('div');
            popup.className = 'popup-vida-global';
            popup.innerHTML = `
            <div class="popup-vida-content">
              <!-- Seu conteúdo do PopupVida aqui -->
            </div>
          `;
            document.body.appendChild(popup);

            return () => {
                document.body.removeChild(popup);
            };
        }
    }, [mostrarPopup]);

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
                <Portal>
                    <div className="popup-vida-global">
                        <div className="popup-vida-content">
                            <PopupVida
                                onConfirmar={handleConfirmar}
                                onCancelar={() => setMostrarPopup(false)}
                                onRestaurar={handleRestaurar}
                            />
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
};

export default VidaComponente;