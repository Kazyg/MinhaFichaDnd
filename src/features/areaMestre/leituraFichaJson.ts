import { parseJSON, validateFicha } from '../../api/fichaPersonagem/fichaStorage';
import { interpretarFichaJson } from './importacao';
import { lerBlob } from './pdf';

export async function lerResumoFichaJson(blob: Blob): Promise<{ classe?: string; nivel?: number | string; raca?: string }> {
  const ficha = lerFichaSomenteLeitura(await lerBlob(blob, true) as string);
  const nome = (valor: unknown) => valor && typeof valor === 'object' && 'nome' in valor && typeof valor.nome === 'string' ? valor.nome : undefined;
  return { classe: nome(ficha.classePrincipal), nivel: typeof ficha.levelTotal === 'number' ? ficha.levelTotal : undefined, raca: nome(ficha.racaPrincipal) };
}

/** Leitura de snapshots: não instancia Ficha, não recalcula e não acessa storage. */
export function lerFichaSomenteLeitura(texto: string): Record<string, unknown> {
  interpretarFichaJson(texto);
  const documento = parseJSON(texto);
  const ficha = documento.format === 'minhafichadnd' ? documento.data : documento;
  validateFicha(ficha);
  return ficha as unknown as Record<string, unknown>;
}
