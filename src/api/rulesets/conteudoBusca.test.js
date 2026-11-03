import { buscarMagiaConteudo, buscarTalentoConteudo, getMagiasConteudo, getTalentosConteudo, referenciaConteudo, resolverConteudo } from './conteudo';

test.each(['DND_2014', 'DND_2024'])('busca e resolução clonam só a entrada, preservando isolamento: %s', edicao => {
  const talento = buscarTalentoConteudo(edicao, edicao === 'DND_2014' ? 'ALERTA' : 'Alerta');
  const magia = buscarMagiaConteudo(edicao, 'Curar Ferimentos');
  const spy = jest.spyOn(JSON, 'stringify');
  try {
    const resolvido = resolverConteudo(referenciaConteudo(talento));
    expect(resolvido).toEqual(talento);
    expect(resolvido).not.toBe(talento);
    resolvido.fonte.titulo = 'Edição local';
    expect(resolverConteudo(referenciaConteudo(talento)).fonte.titulo).toBe(talento.fonte.titulo);
    magia.listas.push('classe inventada');
    expect(buscarMagiaConteudo(edicao, 'Curar Ferimentos').listas).not.toContain('classe inventada');
    expect(buscarTalentoConteudo(edicao, talento.nome)).toEqual(talento);
    expect(spy.mock.calls.every(([entrada]) => !Array.isArray(entrada))).toBe(true);
  } finally { spy.mockRestore(); }
  const magias = getMagiasConteudo(edicao);
  const talentos = getTalentosConteudo(edicao);
  magias[0].nome = 'Mudança local';
  talentos[0].nome = 'Mudança local';
  expect(getMagiasConteudo(edicao)[0].nome).not.toBe('Mudança local');
  expect(getTalentosConteudo(edicao)[0].nome).not.toBe('Mudança local');
});
