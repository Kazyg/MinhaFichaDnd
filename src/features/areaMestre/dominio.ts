import { FichaOriginal, InstanciaFicha, PontosVida } from './modelos';

export type CodigoErroMestre = 'dados-invalidos' | 'formato-nao-suportado' | 'arquivo-vazio' | 'arquivo-grande' | 'leitura-falhou' | 'json-invalido';
export class ErroAreaMestre extends Error {
  constructor(public readonly codigo: CodigoErroMestre, mensagem: string) {
    super(mensagem);
    this.name = 'ErroAreaMestre';
  }
}

export function validarId(id: string): void {
  if (typeof id !== 'string' || !id.trim() || id.length > 200) {
    throw new ErroAreaMestre('dados-invalidos', 'Identificador inválido.');
  }
}

export function validarPV(pv: PontosVida): void {
  if (!Number.isSafeInteger(pv.atuais) || !Number.isSafeInteger(pv.maximos) || pv.atuais < 0 || pv.maximos < 0 || pv.atuais > pv.maximos) {
    throw new ErroAreaMestre('dados-invalidos', 'PV devem ser inteiros entre zero e o máximo.');
  }
}

export function criarInstancia(ficha: FichaOriginal, id: string, nome = ficha.nome): InstanciaFicha {
  validarId(id);
  validarId(ficha.id);
  validarId(ficha.campanhaId);
  validarPV(ficha.pvIniciais);
  if (!nome.trim()) throw new ErroAreaMestre('dados-invalidos', 'Informe o nome da instância.');
  return {
    id, campanhaId: ficha.campanhaId, fichaOriginalId: ficha.id,
    categoria: ficha.categoria, nome: nome.trim(), pv: { ...ficha.pvIniciais },
  };
}
