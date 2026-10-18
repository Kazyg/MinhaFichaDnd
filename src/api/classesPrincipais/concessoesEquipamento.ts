export type MoedasIniciais = { ouro: number; prata: number; cobre: number };
export type ConcessaoEquipamento = { nome: string; quantidade: number };
export type EquipamentoInicial = { itens: ConcessaoEquipamento[]; moedas: MoedasIniciais; alternativa?: MoedasIniciais };
export const moedasVazias = (): MoedasIniciais => ({ ouro: 0, prata: 0, cobre: 0 });


export function estruturarEquipamentos(descricoes: string[]): EquipamentoInicial {
  const result: EquipamentoInicial = { itens: [], moedas: moedasVazias() };
  for (const descricao of descricoes) {
    let nome = descricao.trim();
    const recipiente = nome.match(/^(?:(?:uma?|a)\s+)?(?:algibeira|bolsa)\s+(?:contendo|com)\s+(.+)$/i);
    const conteudo = recipiente ? recipiente[1] : nome;
    const moeda = conteudo.match(/^(\d+)\s*(po|pp|pc|peças? de ouro|peças? de prata|peças? de cobre)$/i);
    if (moeda) {
      const unidade = moeda[2].toLowerCase();
      const tipo = /^(po|.*ouro)$/.test(unidade) ? 'ouro' : /^(pp|.*prata)$/.test(unidade) ? 'prata' : 'cobre';
      result.moedas[tipo] += Number(moeda[1]);
      continue;
    }
    if (recipiente && /^moedas$/i.test(conteudo)) continue;
    const alternativa = nome.match(/^ou (\d+) PO$/i);
    if (alternativa) { result.alternativa = { ...moedasVazias(), ouro: Number(alternativa[1]) }; continue; }
    let quantidade = 1;
    const unidades = nome.match(/^(\d+) (.+)$/);

    if (unidades && !/^(metros|m)\b/i.test(unidades[2])) { quantidade = Number(unidades[1]); nome = unidades[2]; }
    const folhas = nome.match(/^(Pergaminho|Óleo) \((\d+) (?:folhas|frascos)\)$/i);
    if (folhas) { nome = folhas[1]; quantidade = Number(folhas[2]); }
    const duas = nome.match(/^(?:duas|dois) (.+)$/i);
    if (duas) { nome = duas[1]; quantidade = 2; }
    if (/^adagas$/i.test(nome)) nome = 'Adaga';
    result.itens.push({ nome, quantidade });
  }
  return result;
}
