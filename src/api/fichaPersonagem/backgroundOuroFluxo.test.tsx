import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FichaProvider, useFicha } from './FichaContext';
import { Ficha } from './FichaPersonagem';
import { serializeCollection, STORAGE_KEY } from './fichaStorage';
import { Acolito } from '../backGroundsFilhos/Acolito.class';
import ModalSelecaoBackGround from '../../pages/modals/ModalSelecaoBackGround';
import AbaItens from '../../pages/components/components_inventario/AbaItens';

function Fluxo() {
  const { ficha, forceUpdate, tentarSalvar } = useFicha();
  const [aberto, setAberto] = useState(false);
  if (!ficha) return null;
  return <>
    <button onClick={() => setAberto(true)}>Background</button>
    <button onClick={tentarSalvar}>Salvar</button>
    <AbaItens setModalItemAberto={() => {}} />
    {aberto && <ModalSelecaoBackGround titulo="Background" opcoes={[new Acolito()]} backGroundInicial={ficha.backGround}
      onClose={() => setAberto(false)} onSelect={b => { ficha.setBackGround(b); forceUpdate(); }} />}
  </>;
}

test('ficha salva: escolha na interface credita 15 PO, persiste e não duplica ao reabrir', async () => {
  localStorage.clear();
  const f = new Ficha({ backGround: new Acolito(), ouro: 0 });
  localStorage.setItem(STORAGE_KEY, serializeCollection([f], f.id));
  let view = render(<FichaProvider><Fluxo /></FichaProvider>);
  expect(await screen.findByText('Ouro: 0')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Background' }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher acolito' }));
  expect(screen.getByText('Ouro: 15')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  view.unmount();
  view = render(<FichaProvider><Fluxo /></FichaProvider>);
  expect(await screen.findByText('Ouro: 15')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Background' }));
  fireEvent.click(screen.getByRole('button', { name: 'Escolher acolito' }));
  expect(screen.getByText('Ouro: 15')).toBeInTheDocument();
  expect(screen.queryByText(/Ficha antiga sem origem/)).not.toBeInTheDocument();
  view.unmount();
  localStorage.clear();
});
