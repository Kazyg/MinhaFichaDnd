import { criarInstancia, ErroAreaMestre } from './dominio';
import { DadosCampanha } from './modelos';
import { ImportacaoConfirmada } from './importacaoVisual';
import { validarDadosCampanha } from './validacao';


export function incorporarImportacao(dados: DadosCampanha, resultado: ImportacaoConfirmada): DadosCampanha {
  if (resultado.ficha.campanhaId !== dados.campanha.id) throw new ErroAreaMestre('dados-invalidos', 'A importação pertence a outra campanha.');

  const primeira = criarInstancia(resultado.ficha, `instancia-${resultado.ficha.id}`, resultado.ficha.categoria === 'monstro' ? `${resultado.ficha.nome.slice(0, 180)} 1` : resultado.ficha.nome);
  const proximo: DadosCampanha = {
    ...dados,
    fichas: [...dados.fichas.filter(f => f.id !== resultado.ficha.id), resultado.ficha],
    anexos: [...dados.anexos.filter(a => !resultado.anexos.some(n => n.id === a.id)), ...resultado.anexos],
    instancias: [...dados.instancias.filter(i => i.id !== primeira.id), primeira],
  };
  validarDadosCampanha(proximo);
  return proximo;
}


export function removerFichaCampanha(dados: DadosCampanha, fichaId: string): DadosCampanha {
  if (dados.instancias.some(i => i.fichaOriginalId === fichaId)) {
    throw new ErroAreaMestre('dados-invalidos', 'Remova primeiro as instâncias desta ficha no painel de PV. Nenhuma instância será excluída automaticamente.');
  }
  return { ...dados, fichas: dados.fichas.filter(f => f.id !== fichaId) };
}
