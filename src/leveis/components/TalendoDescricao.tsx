import React, { useState } from "react";
import { descreverTalentoSalvo } from '../../api/fichaPersonagem/talentosConteudo';
import type { Efeitos } from '../../api/classesPrincipais/Efeitos';
import { useFicha } from "../../api/fichaPersonagem/FichaContext";

interface CaracteristicasClasseProps {
    talento: string;
    efeito?: Efeitos;
}

const TalentoDescricao: React.FC<CaracteristicasClasseProps> = ({ talento, efeito }) => {
    const { ficha } = useFicha();
    // Estado para controlar quais características estão expandidas
    const [caracteristicasExpandidas, setCaracteristicasExpandidas] = useState<{ [key: string]: boolean }>({});

    // Função para alternar a visibilidade da descrição
    const toggleCaracteristica = (caracteristica: string) => {
        setCaracteristicasExpandidas((prev) => ({
            ...prev,
            [caracteristica]: !prev[caracteristica],
        }));
    };
    const salvo = efeito ?? ficha?.efeitos?.find(e => e.talento === talento);
    const descricao = salvo ? descreverTalentoSalvo(salvo) : `Talento legado sem revisão identificada: ${talento}. Nenhuma descrição de outra edição foi aplicada.`;

    return (
        <div key={talento} className="skills-container">
            <button
                onClick={() => { toggleCaracteristica(talento) }}
                className="w-full text-left p-2 border rounded-lg focus:outline-none"
            >
                {talento.toLowerCase()} {caracteristicasExpandidas[talento] ? "▲" : "▼"}
            </button>
            {caracteristicasExpandidas[talento] && (
                <p className="descricao p-2 border rounded-lg mt-2">{descricao}</p>
            )}
        </div>
    );
};

export default TalentoDescricao;
