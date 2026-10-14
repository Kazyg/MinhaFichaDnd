import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FichaProvider, useFicha } from './FichaContext';
import { Ficha } from './FichaPersonagem';
import { serializeCollection, STORAGE_KEY, parseCollection } from './fichaStorage';
import { getRulesetData } from '../rulesets/getRulesetData';
import { chaveClasse } from '../rulesets/progressao';
import AbaMagias from '../../pages/components/components_inventario/AbaMagias';
import InformacoesPersonagem from '../../pages/components/InformacoesPersonagem';
function Tela() {
  const [aba, setAba] = useState('magias');
  const { tentarSalvar } = useFicha();
  return <><button onClick={() => setAba(aba === 'magias' ? 'vida' : 'magias')}>Trocar aba</button>
    <button onClick={tentarSalvar}>Salvar agora</button>
    {aba === 'magias' ? <AbaMagias /> : <InformacoesPersonagem />}</>;
}
test('contexto real salva slots e morte e os restaura após recarregar', async () => {
  const classe = getRulesetData('DND_2024').classes.find(c => chaveClasse(c) === 'mago');
  const f = new Ficha({ nomePersonagem: 'Persistência', versaoRegras: 'DND_2024', levelTotal: 1, classePrincipal: classe,
    multiclasses: [{ id: 'mago', classe, nivelClasse: 1, nivelEscolhido: [1] }] });
  const dados = new Map([[STORAGE_KEY, serializeCollection([f], f.id)]]);
  const storage = { getItem: key => dados.get(key) ?? null, setItem: (key, value) => dados.set(key, value) };
  let view = render(<FichaProvider storage={storage}><Tela /></FichaProvider>);
  const slot = 'Conjuração, círculo 1, espaço 1';
  fireEvent.click(await screen.findByRole('button', { name: slot }));
  fireEvent.click(screen.getByRole('button', { name: 'Trocar aba' }));
  fireEvent.click(screen.getByRole('button', { name: 'Sucesso de morte 1' }));
  fireEvent.click(screen.getByRole('button', { name: 'Salvar agora' }));
  await waitFor(() => expect(parseCollection(dados.get(STORAGE_KEY)).fichas[0].recursos.morte.sucessos).toBe(1));
  view.unmount();
  view = render(<FichaProvider storage={storage}><Tela /></FichaProvider>);
  expect(await screen.findByRole('button', { name: slot })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Trocar aba' }));
  expect(screen.getByRole('button', { name: 'Sucesso de morte 1' })).toHaveAttribute('aria-pressed', 'true');
});
