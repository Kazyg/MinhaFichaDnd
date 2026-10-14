import { alternarSlot, estadosSlots } from './magiaSlots';

test('alternância individual mantém o contador existente e a identidade após JSON', () => {
  const slots: Record<string, number> = { 'conjuracao:0': 0 };
  alternarSlot(slots, 'conjuracao:0', 4, 3);
  expect(slots['conjuracao:0']).toBe(1);
  expect(estadosSlots(JSON.parse(JSON.stringify(slots)), 'conjuracao:0', 4)).toEqual([false, false, false, true]);
  alternarSlot(slots, 'conjuracao:0', 4, 0);
  alternarSlot(slots, 'conjuracao:0', 4, 3);
  expect(slots['conjuracao:0']).toBe(1);
  expect(estadosSlots(slots, 'conjuracao:0', 4)).toEqual([true, false, false, false]);
});

test('consumo legado e mudanças externas do contador têm precedência sobre as marcas', () => {
  const slots: Record<string, number> = { 'conjuracao:0': 3 };
  expect(estadosSlots(slots, 'conjuracao:0', 4)).toEqual([true, true, true, false]);
  alternarSlot(slots, 'conjuracao:0', 4, 1);
  expect(slots['conjuracao:0']).toBe(2);
  slots['conjuracao:0'] = 0;
  expect(estadosSlots(slots, 'conjuracao:0', 4)).toEqual([false, false, false, false]);
});

test('reduzir nível preserva espaços gastos fora do total atual', () => {
  const slots: Record<string, number> = { 'conjuracao:0': 4 };
  alternarSlot(slots, 'conjuracao:0', 2, 1);
  expect(slots['conjuracao:0']).toBe(3);
  expect(estadosSlots(slots, 'conjuracao:0', 4)).toEqual([true, false, true, true]);
  const antes = JSON.stringify(slots);
  alternarSlot(slots, 'conjuracao:0', 2, 2);
  expect(JSON.stringify(slots)).toBe(antes);
});
