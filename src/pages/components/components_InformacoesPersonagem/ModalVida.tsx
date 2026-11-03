import AccessibleDialog from "../AccessibleDialog";
import React, { useState } from "react";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext";
import { Portal } from "./Portal"
import "../../css/popupVida.css"
import { selecionarVida, explicarParcelas } from "../../../api/fichaPersonagem/fichaSeletores";
const calcularVida = (ficha: Parameters<typeof selecionarVida>[0]) => selecionarVida(ficha).total;

interface PopupVidaProps {
    vidaInicial: number;
    vidaMaxima: number;
    titulo?: string;
    ocupado?: boolean;
    restaurarComoEdicao?: boolean;
    onConfirmar: (novaVida: number, cura: number, dano: number) => void;
    onCancelar: () => void;
    onRestaurar: () => void;
}

export const PopupVida: React.FC<PopupVidaProps> = ({ vidaInicial, vidaMaxima, titulo = "Ajustar Vida", ocupado = false, restaurarComoEdicao = false, onConfirmar, onCancelar, onRestaurar }) => {
    const [vidaEditada, setVidaEditada] = useState(vidaInicial);
    const [cura, setCura] = useState('');
    const [dano, setDano] = useState('');
    const [erro, setErro] = useState('');
    const confirmar = () => {
        const valores = [cura || '0', dano || '0'];
        if (valores.some(valor => !/^\d+$/.test(valor) || !Number.isSafeInteger(Number(valor)))) {
            setErro('Informe dano e cura como números inteiros não negativos e seguros.'); return;
        }
        setErro(''); onConfirmar(vidaEditada, Number(cura || 0), Number(dano || 0));
    };
    return (
        <div>
            <div>
                <h3>{titulo}</h3>
                <div className="barra-deslizante-mobile">
                    <div className="vida-valor"><span>Pontos de vida</span><strong>{vidaEditada} <small>/ {vidaMaxima}</small></strong></div>
                    <input
                        aria-label="Pontos de vida atuais"
                        disabled={ocupado || vidaMaxima === 0}
                        type="range"
                        min={0}
                        max={vidaMaxima}
                        value={vidaEditada}
                        onChange={(e) => setVidaEditada(parseInt(e.target.value, 10))}
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="campo-texto">
                    <div className="campo-texto1">
                        <label htmlFor="vida-dano">Dano</label>
                        <input
                            type="number"
                            max={vidaMaxima}
                            id="vida-dano"
                            aria-label="Dano"
                            min={0}
                            value={dano}
                            disabled={ocupado}
                            onChange={e => setDano(e.target.value)}
                        />
                    </div>
                    <div className="campo-texto1">
                        <label htmlFor="vida-cura">Cura</label>
                        <input
                            type="number"
                            max={vidaMaxima}
                            id="vida-cura"
                            aria-label="Cura"
                            min={0}
                            value={cura}
                            disabled={ocupado}
                            onChange={e => setCura(e.target.value)}
                        />
                    </div>
                </div>
                {erro && <p role="alert">{erro}</p>}
                <div className="botoes">
                    <button disabled={ocupado} onClick={confirmar}>Confirmar</button>
                    <button disabled={ocupado} onClick={onCancelar}>Cancelar</button>
                    <button className="vida-restaurar" disabled={ocupado} onClick={() => { if (restaurarComoEdicao) { setVidaEditada(vidaMaxima); setCura(''); setDano(''); setErro(''); } else onRestaurar(); }}>Restaurar Vida</button>
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
                                vidaInicial={ficha?.vidaAtual ?? 0}
                                vidaMaxima={calcularVida(ficha)}
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
