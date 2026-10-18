import AccessibleDialog from '../../../pages/components/AccessibleDialog';
import { CategoriaFicha, DadosCampanha } from '../modelos';
import CardFicha from './CardFicha';

export default function ColecaoFichas({ categoria, dados, onFechar, onAbrir, onAdicionar, onExcluir, onEditar }: {
  categoria: CategoriaFicha; dados: DadosCampanha; onFechar: () => void;
  onAbrir: (id: string) => void; onAdicionar: (id: string) => void;
  onExcluir: (id: string) => void; onEditar: (id: string) => void;
}) {
  const titulo = categoria === 'monstro' ? 'Coleção de monstros' : 'Coleção de jogadores';
  const fichas = dados.fichas.filter(ficha => ficha.categoria === categoria);
  return <div className="am-overlay"><AccessibleDialog className="am-dialog am-colecao" aria-label={titulo} onClose={onFechar}>
    <h2>{titulo}</h2>
    {fichas.length ? <ul className="am-fichas">{fichas.map(ficha => <li key={ficha.id}>
      <CardFicha ficha={ficha} anexos={dados.anexos} quantidade={dados.instancias.filter(i => i.fichaOriginalId === ficha.id).length}
        onAbrir={() => onAbrir(ficha.id)} onAdicionar={() => onAdicionar(ficha.id)} onExcluir={() => onExcluir(ficha.id)} onEditar={() => onEditar(ficha.id)} />
    </li>)}</ul> : <p className="am-vazio">Nenhuma ficha nesta coleção. Use a navegação para incluir uma ficha.</p>}
    <div className="am-dialog-acoes"><button onClick={onFechar}>Fechar coleção</button></div>
  </AccessibleDialog></div>;
}
