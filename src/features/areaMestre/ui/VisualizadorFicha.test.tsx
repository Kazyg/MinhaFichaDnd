import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VisualizadorDocumento, { MAX_LADO_PDF, MAX_PIXELS_PDF } from './VisualizadorDocumento';
import VisualizadorFicha from './VisualizadorFicha';
import { abrirPdf, DocumentoPdf } from '../pdf';
import { AnexoCampanha, FichaOriginal } from '../modelos';
import { lerFichaSomenteLeitura, lerResumoFichaJson } from '../leituraFichaJson';

jest.mock('../pdf', () => ({
  ...jest.requireActual('../pdf'), abrirPdf: jest.fn(),
}));
const abrir = abrirPdf as jest.MockedFunction<typeof abrirPdf>;
const anexo = (mime: string, conteudo = '{}'): AnexoCampanha => ({ id: 'a', campanhaId: 'c', nome: 'original', mime, arquivo: new Blob([conteudo], { type: mime }), tamanho: conteudo.length });
const grupoJson = (titulo: string) => screen.getByText((_, elemento) => elemento?.textContent?.startsWith(titulo) ?? false, { selector: 'section' });
let criar: jest.Mock;
let revogar: jest.Mock;
beforeEach(() => {
  criar = jest.fn(() => 'blob:original'); revogar = jest.fn();
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: criar });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revogar });
  abrir.mockReset();
});
test('imagem mantém proporção, zoom, links originais e libera URL', () => {
  const { unmount } = render(<VisualizadorDocumento anexo={anexo('image/png')} />);
  const imagem = screen.getByRole('img'); fireEvent.load(imagem);
  expect(imagem).toHaveStyle({ height: '' });
  fireEvent.change(screen.getByLabelText('Zoom'), { target: { value: '2' } });
  expect(imagem).toHaveStyle({ width: '200%' });
  expect(screen.getByText('Baixar original')).toHaveAttribute('href', 'blob:original');
  fireEvent.error(imagem); expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar');
  unmount(); expect(revogar).toHaveBeenCalledWith('blob:original');
});
test('JSON 2024 é snapshot estruturado sem modificar armazenamento ou valores', async () => {
  const storage = jest.spyOn(Storage.prototype, 'setItem');
  const documento = { id: 'j', nomePersonagem: 'Lia', versaoRegras: 'DND_2024', vidaTotal: 14, vidaAtual: 3, classePrincipal: { nome: 'Maga' }, levelTotal: 2, racaPrincipal: { nome: 'Elfa' } };
  const original = JSON.stringify({ format: 'minhafichadnd', version: 1, kind: 'ficha', data: documento });
  render(<VisualizadorDocumento anexo={anexo('application/json', original)} />);
  expect(await screen.findByText('Snapshot original somente leitura.', { exact: false })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Defesas e PV históricos' })).toBeVisible();
  const historicos = grupoJson('Defesas e PV históricos');
  expect(within(historicos).getByText('3', { selector: 'span' })).toBeVisible();
  expect(within(historicos).getByText('14', { selector: 'span' })).toBeVisible();
  expect(lerFichaSomenteLeitura(original)).toEqual(documento);
  expect(await lerResumoFichaJson(new Blob([original]))).toEqual({ classe: 'Maga', nivel: 2, raca: 'Elfa' });
  expect(storage).not.toHaveBeenCalled(); storage.mockRestore();
});
test('legado omisso não inventa estatísticas e JSON inválido permite baixar', async () => {
  expect(lerFichaSomenteLeitura('{"id":"j","nomePersonagem":"Legado"}')).toEqual({ id: 'j', nomePersonagem: 'Legado' });
  render(<VisualizadorDocumento anexo={anexo('application/json', 'invalido')} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível visualizar');
  expect(screen.getByText('Baixar original')).toBeVisible();
});
test('PDF navega, amplia, cancela render e destrói documento', async () => {
  const cancelar = jest.fn();
  const getPage = jest.fn(async () => ({ getViewport: ({ scale }: { scale: number }) => ({ width: 100 * scale, height: 200 * scale }), render: () => ({ promise: Promise.resolve(), cancel: cancelar }), getTextContent: async () => ({ items: [] }) }));
  const destroy = jest.fn(async () => {});
  abrir.mockResolvedValue({ numPages: 2, getPage, destroy } as DocumentoPdf);
  const contexto = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);
  const { unmount } = render(<VisualizadorDocumento anexo={anexo('application/pdf')} />);
  expect(await screen.findByText('Página 1 de 2')).toBeVisible();
  await waitFor(() => expect(getPage).toHaveBeenCalledWith(1));
  fireEvent.click(screen.getByText('Próxima página'));
  await waitFor(() => expect(getPage).toHaveBeenCalledWith(2));
  fireEvent.change(screen.getByLabelText('Zoom'), { target: { value: '1.5' } });
  await waitFor(() => expect(screen.getByRole('img')).toHaveAttribute('width', '150'));
  unmount(); expect(destroy).toHaveBeenCalled(); expect(cancelar).toHaveBeenCalled(); contexto.mockRestore();
});
test('PDF indisponível e anexo ausente apresentam erro recuperável', async () => {
  abrir.mockRejectedValue(new Error('PDF inválido'));
  const { unmount } = render(<VisualizadorDocumento anexo={anexo('application/pdf')} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível visualizar'); unmount();
  render(<VisualizadorFicha ficha={{ id: 'f', nome: 'Dragão', anexoId: 'inexistente' } as FichaOriginal} anexos={[]} onFechar={() => {}} />);
  expect(screen.getByRole('alert')).toHaveTextContent('não está disponível');
});
test('PV salvo com novos objetos e Blobs não reinicia PDF aberto', async () => {
  const destroy = jest.fn(async () => {});
  const getPage = jest.fn(async () => ({ getViewport: () => ({ width: 100, height: 200 }), render: () => ({ promise: Promise.resolve(), cancel: jest.fn() }), getTextContent: async () => ({ items: [] }) }));
  abrir.mockResolvedValue({ numPages: 2, getPage, destroy });
  const contexto = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);
  const { rerender, unmount } = render(<VisualizadorDocumento anexo={anexo('application/pdf')} />);
  await screen.findByText('Página 1 de 2'); fireEvent.click(screen.getByText('Próxima página'));
  await screen.findByText('Página 2 de 2');
  rerender(<VisualizadorDocumento anexo={anexo('application/pdf')} />);
  expect(screen.getByText('Página 2 de 2')).toBeVisible(); expect(abrir).toHaveBeenCalledTimes(1);
  unmount(); expect(destroy).toHaveBeenCalledTimes(1); contexto.mockRestore();
});
test('página gigante tem canvas limitado e falha de render continua recuperável', async () => {
  const renderizar = jest.fn(() => ({ promise: Promise.reject(new Error('Render falhou')), cancel: jest.fn() }));
  abrir.mockResolvedValue({ numPages: 1, destroy: async () => {}, getPage: async () => ({ getViewport: ({ scale }) => ({ width: 1e9 * scale, height: 2e9 * scale }), render: renderizar, getTextContent: async () => ({ items: [] }) }) });
  const contexto = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);
  render(<VisualizadorDocumento anexo={anexo('application/pdf')} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível renderizar');
  const canvas = screen.getByRole('img') as HTMLCanvasElement;
  expect(canvas.width * canvas.height).toBeLessThanOrEqual(MAX_PIXELS_PDF);
  expect(Math.max(canvas.width, canvas.height)).toBeLessThanOrEqual(MAX_LADO_PDF);
  expect(screen.getByText('Baixar original')).toBeVisible(); contexto.mockRestore();
});
test('PDF resolvido depois do fechamento é destruído sem renderizar', async () => {
  let concluir!: (pdf: DocumentoPdf) => void;
  abrir.mockReturnValue(new Promise(resolve => { concluir = resolve; }));
  const destroy = jest.fn(async () => {}); const getPage = jest.fn();
  const { unmount } = render(<VisualizadorDocumento anexo={anexo('application/pdf')} />);
  unmount(); concluir({ numPages: 1, getPage, destroy });
  await waitFor(() => expect(destroy).toHaveBeenCalledTimes(1));
  expect(getPage).not.toHaveBeenCalled();
});
test('JSON real exibe CA, atributos e recursos sem campos omitidos artificiais', async () => {
  const atributos = Object.fromEntries(['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].map((nome, id) => [nome, { id, nome, valor: id + 10 }]));
  const json = { id: 'j', nomePersonagem: 'Clara', classeArmadura: 16, atributosPersonagem: atributos, recursos: { slots: { '1': 2 } }, pericias: ['Arcanismo'] };
  render(<VisualizadorDocumento anexo={anexo('application/json', JSON.stringify(json))} />);
  expect(await screen.findByText('Classe de armadura')).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Atributos' })).toBeVisible();
  const defesas = grupoJson('Defesas e PV históricos');
  expect(within(defesas).getByText('16', { selector: 'span' })).toBeVisible();
  const grupoAtributos = grupoJson('Atributos');
  for (const [indice, nome] of ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].entries()) {
    expect(within(grupoAtributos).getAllByText(nome)).toHaveLength(2);
    expect(within(grupoAtributos).getByText(String(indice + 10), { selector: 'span' })).toBeVisible();
  }
  const recursos = grupoJson('Características e recursos');
  expect(within(recursos).getByText('slots')).toBeVisible();
  expect(within(recursos).getByText('1')).toBeVisible();
  expect(within(recursos).getByText('2', { selector: 'span' })).toBeVisible();
  expect(screen.getByText('Arcanismo')).toBeVisible();
  expect(screen.queryByText('Não informado')).not.toBeInTheDocument();
  expect(screen.queryByText('Nível total')).not.toBeInTheDocument();
});
