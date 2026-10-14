import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalSelecao from './ModalSelecao';
import { getRulesetData } from '../../api/rulesets/getRulesetData';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { exportFicha, parseImport } from '../../api/fichaPersonagem/fichaStorage';

const mockFicha = new Ficha({ versaoRegras: 'DND_2014', levelTotal: 1 });
jest.mock('../../api/fichaPersonagem/FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha }) }));
function abrir(nome, edicao = 'DND_2014') {
  const racas = getRulesetData(edicao).racasOuEspecies;
  const onSelect = jest.fn(raca => mockFicha.setRacaPrincipal(raca));
  render(<ModalSelecao titulo="Raças" opcoes={racas} racaInicial={racas.find(r => r.nome === nome)} atributosIniciais={[]} onSelect={onSelect} onClose={() => {}} onAtributeSelect={() => {}} onFerramentaSelect={() => {}} usarRegrasEspeciais2014={edicao === 'DND_2014'} />);
  return onSelect;
}
test('ferramenta obrigatória usa seleção única acima das características', () => {
  abrir('Anão');
  expect(screen.getByRole('button', { name: 'Escolher Anão' })).toBeDisabled();
  const radios = screen.getAllByRole('radio');
  fireEvent.click(radios[0]); fireEvent.click(radios[1]);
  expect(radios[0]).not.toBeChecked(); expect(radios[1]).toBeChecked();
  expect(screen.getByRole('button', { name: 'Escolher Anão' })).toBeEnabled();
});
test('meio-elfo limita escolhas, permite substituir e persiste dados raciais', () => {
  const onSelect = abrir('Meio-Elfo');
  fireEvent.click(screen.getByRole('button', { name: 'força' }));
  fireEvent.click(screen.getByRole('button', { name: 'destreza' }));
  expect(screen.getByRole('button', { name: 'sabedoria' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'carisma' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'força +1' }));
  fireEvent.click(screen.getByRole('button', { name: 'sabedoria' }));
  fireEvent.click(screen.getByRole('button', { name: 'Atletismo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Acrobacia' }));
  expect(screen.getByRole('button', { name: 'História' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Meio-Elfo' }));
  const raca = onSelect.mock.calls[0][0];
  const salva = new Ficha({ versaoRegras: 'DND_2014', racaPrincipal: raca });
  const restaurada = parseImport(exportFicha(salva));
  expect(restaurada.racaPrincipal.pericia).toEqual(['Atletismo', 'Acrobacia']);
  expect(restaurada.racaPrincipal.atributos).toEqual(raca.atributos);
});
test('espécies 2024 não recebem escolhas de atributos de 2014', () => {
  abrir('Anão', 'DND_2024');
  expect(screen.queryByRole('region', { name: 'Personalização Racial' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Escolher Anão' })).toBeEnabled();
});


test('humano variante exige talento e reutiliza a modal sem salvar o rascunho', () => {
  abrir('Humano Variante');
  fireEvent.click(screen.getByRole('button', { name: 'força' }));
  fireEvent.click(screen.getByRole('button', { name: 'destreza' }));
  fireEvent.click(screen.getByRole('button', { name: 'Atletismo' }));
  expect(screen.getByRole('button', { name: 'Escolher Humano Variante' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Selecionar Talento' }));
  fireEvent.click(screen.getByRole('button', { name: /^alerta$/i }));
  fireEvent.click(screen.getByRole('button', { name: /^Escolher alerta$/i }));
  expect(mockFicha.efeitos?.some(e => e.talento?.toLowerCase() === 'alerta')).toBeFalsy();
  fireEvent.click(screen.getByRole('button', { name: 'Escolher Humano Variante' }));
  expect(mockFicha.efeitos.filter(e => e.tituloEfeito === 'TalentoEscolhidoHumanoVariante')).toHaveLength(1);
});
