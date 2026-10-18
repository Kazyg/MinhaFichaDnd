import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import MiniaturaFicha from './MiniaturaFicha';
import { AnexoCampanha, FichaOriginal } from '../modelos';

const ficha: FichaOriginal = {
  id: 'ficha', campanhaId: 'campanha', categoria: 'monstro', formato: 'pdf', anexoId: 'pdf', imagemAnexoId: 'retrato', nome: 'Goblin',
  pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: [], importadoEm: '2026-10-17T12:00:00.000Z',
};
function imagem(id = 'retrato'): AnexoCampanha {
  const arquivo = new Blob(['imagem'], { type: 'image/png' });
  return { id, campanhaId: 'campanha', nome: 'retrato.png', mime: arquivo.type, tamanho: arquivo.size, arquivo };
}

describe('recursos temporários das miniaturas', () => {
  const criarAnterior = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
  const revogarAnterior = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
  let criar: jest.Mock;
  let revogar: jest.Mock;
  beforeEach(() => {
    criar = jest.fn().mockReturnValueOnce('blob:primeira').mockReturnValue('blob:segunda');
    revogar = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: criar });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revogar });
  });
  afterEach(() => {
    cleanup();
    if (criarAnterior) Object.defineProperty(URL, 'createObjectURL', criarAnterior);
    else Reflect.deleteProperty(URL, 'createObjectURL');
    if (revogarAnterior) Object.defineProperty(URL, 'revokeObjectURL', revogarAnterior);
    else Reflect.deleteProperty(URL, 'revokeObjectURL');
  });

  test('cria URL do Blob e revoga a anterior na troca e a atual ao desmontar', () => {
    const primeira = imagem();
    const { rerender, unmount } = render(<MiniaturaFicha ficha={ficha} anexos={[primeira]} />);
    expect(criar).toHaveBeenCalledWith(primeira.arquivo);
    expect(screen.getByAltText('')).toHaveAttribute('src', 'blob:primeira');
    const segunda = imagem();
    rerender(<MiniaturaFicha ficha={ficha} anexos={[segunda]} />);
    expect(revogar).toHaveBeenCalledWith('blob:primeira');
    expect(screen.getByAltText('')).toHaveAttribute('src', 'blob:segunda');
    unmount();
    expect(revogar).toHaveBeenCalledTimes(2);
    expect(revogar).toHaveBeenLastCalledWith('blob:segunda');
  });

  test('erro de imagem apresenta formato original e uma nova imagem permite recuperação', () => {
    const { rerender, unmount } = render(<MiniaturaFicha ficha={ficha} anexos={[imagem()]} />);
    fireEvent.error(screen.getByAltText(''));
    expect(screen.queryByAltText('')).not.toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    rerender(<MiniaturaFicha ficha={ficha} anexos={[imagem()]} />);
    expect(screen.getByAltText('')).toHaveAttribute('src', 'blob:segunda');
    unmount();
    expect(revogar).toHaveBeenCalledTimes(2);
  });

  test('PDF sem retrato usa placeholder sem criar URL nem interpretar documento', () => {
    render(<MiniaturaFicha ficha={ficha} anexos={[]} />);
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(criar).not.toHaveBeenCalled();
  });
});
