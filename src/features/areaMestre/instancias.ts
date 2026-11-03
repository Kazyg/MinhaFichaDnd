import { criarInstancia, ErroAreaMestre, validarId } from './dominio';
import { DadosCampanha, InstanciaFicha } from './modelos';

function inteiro(valor: number) {
  if (!Number.isSafeInteger(valor) || valor < 0) throw new ErroAreaMestre('dados-invalidos', 'Informe um número inteiro não negativo e seguro.');
}
function encontrar(dados: DadosCampanha, id: string) {
  const instancia = dados.instancias.find(item => item.id === id);
  if (!instancia) throw new ErroAreaMestre('dados-invalidos', 'Instância não encontrada.');
  return instancia;
}
function substituir(dados: DadosCampanha, instancia: InstanciaFicha): DadosCampanha {
  return { ...dados, instancias: dados.instancias.map(item => item.id === instancia.id ? instancia : item) };
}
function novoId(dados: DadosCampanha, id: string) {
  validarId(id);
  if (dados.instancias.some(item => item.id === id)) throw new ErroAreaMestre('dados-invalidos', 'O identificador da instância já existe.');
}
function nomeLivre(dados: DadosCampanha, base: string) {
  let numero = 1;
  const nomes = new Set(dados.instancias.map(item => item.nome));
  while (nomes.has(`${base.slice(0, 180)} ${numero}`)) numero++;
  return `${base.slice(0, 180)} ${numero}`;
}
export function criarInstanciaAdicional(dados: DadosCampanha, fichaId: string, id: string): DadosCampanha {
  novoId(dados, id);
  const ficha = dados.fichas.find(item => item.id === fichaId);
  if (!ficha || ficha.categoria !== 'monstro') throw new ErroAreaMestre('dados-invalidos', 'Selecione uma ficha de monstro.');
  return { ...dados, instancias: [...dados.instancias, criarInstancia(ficha, id, nomeLivre(dados, ficha.nome))] };
}
export function duplicarInstancia(dados: DadosCampanha, instanciaId: string, id: string): DadosCampanha {
  novoId(dados, id);
  const instancia = encontrar(dados, instanciaId);
  if (instancia.categoria !== 'monstro') throw new ErroAreaMestre('dados-invalidos', 'Somente monstros podem ser duplicados.');
  return { ...dados, instancias: [...dados.instancias, { ...instancia, id, nome: nomeLivre(dados, `${instancia.nome} (cópia)`), pv: { ...instancia.pv } }] };
}
export function removerInstancia(dados: DadosCampanha, id: string): DadosCampanha {
  if (!dados.instancias.some(item => item.id === id)) return dados;
  if (dados.participantes.some(item => item.instanciaId === id && !dados.combates.some(c => c.id === item.combateId && c.estado === 'encerrado' && c.historico))) throw new ErroAreaMestre('dados-invalidos', 'Esta instância é referenciada por um combate e não pode ser removida.');
  return { ...dados, instancias: dados.instancias.filter(item => item.id !== id) };
}
export function aplicarDano(dados: DadosCampanha, id: string, quantidade: number): DadosCampanha {
  inteiro(quantidade);
  const instancia = encontrar(dados, id);
  return substituir(dados, { ...instancia, pv: { ...instancia.pv, atuais: Math.max(0, instancia.pv.atuais - quantidade) } });
}
export function aplicarCura(dados: DadosCampanha, id: string, quantidade: number): DadosCampanha {
  inteiro(quantidade);
  const instancia = encontrar(dados, id);
  const atuais = instancia.pv.atuais + Math.min(quantidade, instancia.pv.maximos - instancia.pv.atuais);
  return substituir(dados, { ...instancia, pv: { ...instancia.pv, atuais } });
}
export function ajustarInstancia(dados: DadosCampanha, id: string, nome: string, atuais: number, maximos: number): DadosCampanha {
  inteiro(atuais); inteiro(maximos);
  if (!nome.trim() || nome.trim().length > 200) throw new ErroAreaMestre('dados-invalidos', 'Informe um nome de até 200 caracteres.');
  return substituir(dados, { ...encontrar(dados, id), nome: nome.trim(), pv: { atuais: Math.min(atuais, maximos), maximos } });
}
