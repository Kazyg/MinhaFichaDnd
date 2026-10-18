import { reconhecerImagem } from './ocr';
import { criarMotor } from './ocrMotor';
jest.mock('./ocrMotor', () => ({ criarMotor: jest.fn() }));
const terminate = jest.fn().mockResolvedValue(undefined);
const recognize = jest.fn();
beforeEach(() => { jest.clearAllMocks(); (criarMotor as jest.Mock).mockResolvedValue({ recognize, terminate }); });
test('processa TSV posicional e libera worker', async () => {
  recognize.mockResolvedValue({ data: { tsv: 'level\tpage\tblock\tpar\tline\tword\tleft\ttop\twidth\theight\tconf\ttext\n5\t1\t1\t1\t1\t1\t10\t20\t60\t12\t95\tGoblin\n5\t1\t1\t1\t2\t1\t10\t50\t20\t12\t89\tHP\n5\t1\t1\t1\t2\t2\t40\t50\t20\t12\t97\t40' } });
  const resultado = await reconhecerImagem(document.createElement('canvas'));
  expect(resultado.trechos).toHaveLength(3);
  expect(resultado.trechos[2]).toEqual({ texto: '40', x: 40, y: 50, largura: 20, altura: 12, confianca: 97 });
  expect(terminate).toHaveBeenCalledTimes(1);
});
test('falha de reconhecimento libera worker e não inventa dados', async () => {
  recognize.mockRejectedValue(new Error('arquivo ilegível'));
  await expect(reconhecerImagem(document.createElement('canvas'))).rejects.toThrow('ilegível');
  expect(terminate).toHaveBeenCalled();
});
test('cancelamento durante reconhecimento encerra worker', async () => {
  recognize.mockImplementation(() => new Promise(() => undefined));
  const controle = new AbortController(); const tarefa = reconhecerImagem(document.createElement('canvas'), undefined, controle.signal);
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  controle.abort(); await expect(tarefa).rejects.toThrow('cancelado');
  expect(terminate).toHaveBeenCalled();
});
test('timeout impede operação indefinida e libera recursos', async () => {
  jest.useFakeTimers();
  try {
    recognize.mockImplementation(() => new Promise(() => undefined));
    const tarefa = reconhecerImagem(document.createElement('canvas'));
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    jest.advanceTimersByTime(90_001);
    await expect(tarefa).rejects.toThrow('90 segundos'); expect(terminate).toHaveBeenCalled();
  } finally { jest.useRealTimers(); }
});
