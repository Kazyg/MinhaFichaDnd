import type { Ficha } from './FichaPersonagem';
import { selecionarPoolsMagia } from './fichaConjuracao';

export function recuperarEspacos(ficha: Ficha, descanso: 'curto' | 'longo') {
  // Only active, known pools recover. Unknown/inactive consumption is retained.
  for (const pool of selecionarPoolsMagia(ficha)) {
    if (descanso === 'curto' && !pool.id.startsWith('pacto:')) continue;
    for (const chave of Object.keys(ficha.recursos.slots)) {
      if (chave === pool.id || chave.startsWith(`${pool.id}:`)) ficha.recursos.slots[chave] = 0;
    }
  }
}
