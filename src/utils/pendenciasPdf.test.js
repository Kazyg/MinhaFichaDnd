import React from 'react';
import fs from 'fs';
import { render, screen } from '@testing-library/react';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { Ficha } from '../api/fichaPersonagem/FichaPersonagem';
import { exportFicha, parseImport } from '../api/fichaPersonagem/fichaStorage';
import { gerarFichaPdf } from './exportarFichaPdf';
import AbaItens from '../pages/components/components_inventario/AbaItens';
import InformacoesPersonagem from '../pages/components/InformacoesPersonagem';

let mockFicha;
jest.mock('../api/fichaPersonagem/FichaContext', () => ({ useFicha: () => ({ ficha: mockFicha, forceUpdate: jest.fn() }) }));
beforeEach(() => {
  global.fetch = jest.fn(async () => ({ ok: true, arrayBuffer: async () => Uint8Array.from(fs.readFileSync('public/ficha-de-personagem-dd-5e.pdf')).buffer }));
});
afterEach(() => jest.restoreAllMocks());

test('PDF normaliza acentos decompostos sem alterar JSON e explicita limite da fonte', async () => {
  const nome = 'Joa\u0303o, Éowyn, Łukasz, 李, 🐉';
  const f = new Ficha({ nomePersonagem: nome });
  const original = exportFicha(f);
  const spy = jest.spyOn(PDFPage.prototype, 'drawText');
  await gerarFichaPdf(f);
  const textos = spy.mock.calls.map(c => c[0]).join('\n');
  expect(textos).toContain('João, Éowyn, ?ukasz, ?, ?');
  expect(textos).toContain('Caracteres não suportados');
  expect(exportFicha(f)).toBe(original);
});

describe.each(['DND_2014', 'DND_2024'])('%s', edicao => {
  test.each([[0, 0], [2, 1], [3, 3]])('PDF e UI preservam morte %s/%s após JSON', async (sucessos, falhas) => {
    mockFicha = parseImport(exportFicha(new Ficha({ versaoRegras: edicao, recursos: { slots: {}, morte: { sucessos, falhas } } })));
    render(<InformacoesPersonagem />);
    expect(screen.getAllByRole('button', { name: /Sucesso de morte/ }).filter(b => b.getAttribute('aria-pressed') === 'true')).toHaveLength(sucessos);
    expect(screen.getAllByRole('button', { name: /Falha de morte/ }).filter(b => b.getAttribute('aria-pressed') === 'true')).toHaveLength(falhas);
    const spy = jest.spyOn(PDFPage.prototype, 'drawText');
    const bytes = await gerarFichaPdf(mockFicha);
    const textos = spy.mock.calls.map(c => c[0]).join('\n');
    expect(textos).toContain(`Testes de morte: ${sucessos} sucessos; ${falhas} falhas.`);
    expect(textos).not.toContain('testes de morte e dados');
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(1);
    expect(spy.mock.calls.every(([, options]) => options.y >= 7)).toBe(true);
  });
  test('legado não recebe resultados presumidos ao reabrir nem exportar', async () => {
    mockFicha = parseImport(JSON.stringify({ id: 'legado', nomePersonagem: 'Legado', versaoRegras: edicao }));
    mockFicha = parseImport(exportFicha(mockFicha));
    expect(mockFicha.recursos.morte).toBeUndefined();
    render(<InformacoesPersonagem />);
    expect(screen.getByText('Testes de morte não informados.')).toBeInTheDocument();
    const spy = jest.spyOn(PDFPage.prototype, 'drawText');
    await gerarFichaPdf(mockFicha);
    expect(spy.mock.calls.map(c => c[0]).join('\n')).toContain('Testes de morte não informados.');
  });
  test('inventário mantém contador de sintonização sem explicação e link removidos', () => {
    mockFicha = new Ficha({ versaoRegras: edicao });
    render(<AbaItens setModalItemAberto={() => {}} />);
    expect(screen.getByText('Sintonizados: 0/3')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Regras de sintonização/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/Sintonizar registra o vínculo/)).not.toBeInTheDocument();
  });
});
