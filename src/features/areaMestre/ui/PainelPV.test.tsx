import { useState } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import PainelPV from './PainelPV';
import { DadosCampanha } from '../modelos';

function inicial(): DadosCampanha {
  return { campanha: { id: 'c', schemaVersion: 1, nome: 'C', roteiro: '', criadoEm: '', atualizadoEm: '' }, anexos: [], fichas: [], instancias: [{ id: 'i', campanhaId: 'c', fichaOriginalId: null, categoria: 'monstro', nome: 'Vigia', pv: { atuais: 7, maximos: 7 } }], combates: [], participantes: [], layout: { campanhaId: 'c', versao: 1, sidebarRecolhida: false, paineis: [] } };
}
function Tela({ dadosIniciais = inicial(), falhar = false }: { dadosIniciais?: DadosCampanha; falhar?: boolean }) {
  const [dados, setDados] = useState(dadosIniciais);
  return <PainelPV dados={dados} onAbrirFicha={jest.fn()} onAtualizar={async atualizar => { const proximo = atualizar(dados); if (falhar) return false; setDados(proximo); return true; }} />;
}
function abrir() { fireEvent.click(screen.getByRole('button', { name: /^Ajustar vida de Vigia:/ })); }
function detalhes() { abrir(); fireEvent.click(screen.getByRole('button', { name: 'Detalhes da instância' })); }
test('painel compacto abre modal reutilizada; dano e cura são confirmados', async () => {
  render(<Tela />);
  expect(screen.queryByLabelText('Dano')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Remover' })).not.toBeInTheDocument();
  abrir();
  expect(screen.getByRole('dialog', { name: 'Vigia' })).toHaveClass('popup-vida-content');
  fireEvent.change(screen.getByLabelText('Dano'), { target: { value: '50' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByRole('button', { name: /0\/7, Derrotado/ })).toBeInTheDocument();
  abrir(); fireEvent.change(screen.getByLabelText('Cura'), { target: { value: '50' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('7/7')).toBeInTheDocument();
});
test('slider e restauração são rascunhos descartáveis até confirmar', async () => {
  render(<Tela />); abrir();
  fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByText('7/7')).toBeInTheDocument();
  abrir(); fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('2/7')).toBeInTheDocument();
  abrir(); fireEvent.click(screen.getByRole('button', { name: 'Restaurar Vida' }));
  expect(screen.getByRole('slider')).toHaveValue('7');
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('7/7')).toBeInTheDocument();
});
test('edição informa clamp e máximo zero permanece indefinido', async () => {
  render(<Tela />); detalhes();
  fireEvent.click(screen.getByRole('button', { name: 'Editar instância' }));
  const dialogo = screen.getByRole('dialog');
  expect(within(dialogo).getByText(/serão reduzidos/)).toBeInTheDocument();
  fireEvent.change(within(dialogo).getByLabelText('PV máximos'), { target: { value: '0' } });
  fireEvent.click(within(dialogo).getByRole('button', { name: 'Salvar instância' }));
  expect(await screen.findByText('PV máximos não definidos')).toBeInTheDocument();
  abrir(); expect(screen.getByRole('slider')).toBeDisabled();
});
test('remoção depende de confirmação e cancelar preserva', async () => {
  render(<Tela />); detalhes();
  fireEvent.click(screen.getByRole('button', { name: 'Remover' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.getByLabelText('PV de Vigia')).toBeInTheDocument();
  detalhes(); fireEvent.click(screen.getByRole('button', { name: 'Remover' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar remoção' }));
  await waitFor(() => expect(screen.queryByLabelText('PV de Vigia')).not.toBeInTheDocument());
});
test('erro mantém modal e bloqueia reaplicação; conflito não produz sucesso aparente', async () => {
  render(<Tela falhar />); abrir();
  fireEvent.change(screen.getByLabelText('Dano'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('alterações permanecem pendentes');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled();
});
test('dano preserva PV de outras instâncias', async () => {
  const dados = inicial(); dados.instancias.push({ ...dados.instancias[0], id: 'outra', nome: 'Outro', pv: { atuais: 6, maximos: 6 } });
  render(<Tela dadosIniciais={dados} />); abrir();
  fireEvent.change(screen.getByLabelText('Dano'), { target: { value: '3' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('4/7')).toBeInTheDocument(); expect(screen.getByText('6/6')).toBeInTheDocument();
});
test('quantidades fracionárias e inseguras são rejeitadas sem persistência', () => {
  render(<Tela />); abrir();
  fireEvent.change(screen.getByLabelText('Dano'), { target: { value: '1.5' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  expect(screen.getByRole('alert')).toHaveTextContent('inteiros não negativos');
});
