import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalSelecaoTalento from './ModalSelecaoTalento';
import { getTalentosConteudo } from '../../api/rulesets/conteudo';



test('seletores 2014 preservam escolhas iniciais e confirmam uma nova escolha', async () => {
  const user = userEvent.setup();

  const talento = { ...getTalentosConteudo('DND_2014')[0], escolha: 'atributo-agarrador' as const };
  expect(talento).toBeDefined();
  const onSelect = jest.fn();
  const onClose = jest.fn();
  render(<ModalSelecaoTalento titulo="Talentos" opcoes={[talento]} talentoInicial={talento}
    escolhasIniciais={['forca']} onSelect={onSelect} onClose={onClose} />);
  const dialog = screen.getByRole('dialog', { name: 'Talentos' });
  const seletor = within(dialog).getByRole('combobox', { name: 'Escolha adicional 1' });
  expect(seletor).toHaveValue('forca');
  await user.tab();
  await user.tab();
  await user.tab();
  expect(seletor).toHaveFocus();
  await user.selectOptions(seletor, 'destreza');
  expect(seletor).toHaveValue('destreza');
  await user.click(within(dialog).getByRole('button', { name: `Escolher ${talento.nome}` }));
  expect(onSelect).toHaveBeenCalledWith(talento, ['destreza']);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('seletores 2024 mantem valores ao filtrar a lista e transmitem escolhas versionadas', async () => {
  const user = userEvent.setup();
  const talento = getTalentosConteudo('DND_2024').find(t => t.nome === 'Adepto Elemental')!;
  const onSelect = jest.fn();
  render(<ModalSelecaoTalento titulo="Talentos" opcoes={[talento]} talentoInicial={talento}
    escolhasIniciais={{ atributo: ['inteligencia'] }} validar={() => null} onSelect={onSelect} onClose={() => {}} />);
  const dialog = screen.getByRole('dialog', { name: 'Talentos' });
  const seletores = within(dialog).getAllByRole('combobox');
  expect(seletores).toHaveLength(2);
  expect(seletores[0]).toHaveValue('inteligencia');
  const opcao = within(seletores[1]).getAllByRole('option')[1] as HTMLOptionElement;
  await user.selectOptions(seletores[1], opcao.value);
  await user.type(within(dialog).getByRole('textbox'), 'sem resultado');
  expect(seletores[0]).toHaveValue('inteligencia');
  expect(seletores[1]).toHaveValue(opcao.value);
  await user.click(within(dialog).getByRole('button', { name: 'Escolher Adepto Elemental' }));
  expect(onSelect).toHaveBeenCalledWith(talento, { atributo: ['inteligencia'], elemento: [opcao.value] });
});
