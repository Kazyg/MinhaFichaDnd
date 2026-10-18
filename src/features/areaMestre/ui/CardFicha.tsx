import { useEffect, useRef, useState } from 'react';
import { AnexoCampanha, FichaOriginal } from '../modelos';
import { lerResumoFichaJson } from '../leituraFichaJson';
import MiniaturaFicha from './MiniaturaFicha';

export default function CardFicha({ ficha, anexos, quantidade, onAbrir, onAdicionar, onExcluir, onEditar }: {
  ficha: FichaOriginal; anexos: AnexoCampanha[]; quantidade: number;
  onAbrir: () => void; onAdicionar: () => void; onExcluir: () => void;
  onEditar?: () => void;
}) {
  const [resumo, setResumo] = useState('');
  const anexo = anexos.find(a => a.id === ficha.anexoId);
  const fonte = useRef(anexo);
  fonte.current = anexo;
  useEffect(() => {
    let ativo = true;
    setResumo('');
    if (ficha.formato === 'json' && fonte.current) void lerResumoFichaJson(fonte.current.arquivo).then(valor => {
      if (ativo) setResumo([valor.classe, valor.nivel !== undefined ? `Nível ${valor.nivel}` : '', valor.raca].filter(Boolean).join(' · '));
    }).catch(() => { /* O visualizador apresenta o erro completo ao abrir. */ });
    return () => { ativo = false; };
  // Anexos originais são imutáveis; salvar PV não exige reler o JSON de até 5 MiB.
  }, [anexo?.id, anexo?.campanhaId, ficha.formato]);
  return <div className="am-card-ficha">
    <button className="am-card-ficha-abrir" aria-label={`Abrir ficha ${ficha.nome}`} onClick={onAbrir}>
      <MiniaturaFicha ficha={ficha} anexos={anexos} />
      <strong>{ficha.nome}</strong>
      <small>{ficha.formato.toUpperCase()}{ficha.origemJson ? ` · D&D ${ficha.origemJson.versaoRegras === 'DND_2024' ? '2024' : '2014'}` : ''}</small>
      {resumo && <small>{resumo}</small>}<small>{quantidade} instância(s)</small>
      <small>PV de referência: {ficha.pvIniciais.atuais} / {ficha.pvIniciais.maximos || 'não definidos'}</small>
    </button>
    <div className="am-card-ficha-acoes">
      {ficha.categoria === 'monstro' && <button aria-label={`Adicionar instância de ${ficha.nome}`} onClick={onAdicionar}>Nova instância</button>}
      {onEditar && <button aria-label={`Editar dados e retrato de ${ficha.nome}`} onClick={onEditar}>Editar dados e retrato</button>}
      <button aria-label={`Excluir ficha ${ficha.nome}`} onClick={onExcluir}>Excluir</button>
    </div>
  </div>;
}
