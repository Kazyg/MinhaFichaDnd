import React, { useEffect, useRef, useState } from 'react';

type Props = { nome: string; onSave: (nome: string) => void };

export default function NomePersonagem({ nome, onSave }: Props) {
  const [rascunho, setRascunho] = useState(nome);
  const pendente = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const salvar = useRef(onSave);
  salvar.current = onSave;

  const confirmar = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    if (pendente.current !== null) {
      const valor = pendente.current;
      pendente.current = null;
      salvar.current(valor);
    }
  };

  useEffect(() => {
    if (pendente.current === null) setRascunho(nome);
  }, [nome]);

  useEffect(() => {

    window.addEventListener('beforeunload', confirmar, true);
    return () => {
      window.removeEventListener('beforeunload', confirmar, true);
      confirmar();
    };
  }, []);

  return <input
    type="text"
    id="nome-personagem"
    placeholder="Nome do Personagem"
    value={rascunho}
    onChange={event => {
      const valor = event.target.value;
      setRascunho(valor);
      pendente.current = valor;
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = setTimeout(confirmar, 800);
    }}
    onBlur={confirmar}
  />;
}
