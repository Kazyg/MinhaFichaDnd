import React, { useState } from 'react';
import { useFicha } from '../../api/fichaPersonagem/FichaContext';
import { niveisMetamagia } from '../../api/rulesets/progressao';
import { fonteMetamagia2024, metamagiasNoNivel, opcoesMetamagia } from '../../api/rulesets/metamagia';

export default function EscolhasMetamagia({ nivelClasse }: { nivelClasse: number }) {
  const { ficha, forceUpdate } = useFicha();
  const [erro, setErro] = useState('');
  if (!ficha) return null;
  const niveis = niveisMetamagia(ficha.versaoRegras);
  const slots = niveis.map((n, slot) => ({ n, slot })).filter(({ n }) => ficha.versaoRegras === 'DND_2024' ? n <= nivelClasse : n === nivelClasse);
  if (!slots.length) return null;
  const escolhas = metamagiasNoNivel(ficha, nivelClasse);
  return <fieldset><legend>Metamagia — nível de Feiticeiro {nivelClasse}</legend>
    {ficha.versaoRegras === 'DND_2024' && <p>Ao avançar, você pode substituir uma opção por nível de Feiticeiro. <a href={fonteMetamagia2024} target="_blank" rel="noreferrer">Regras das opções 2024</a></p>}
    {slots.map(({ slot }) => <label key={slot}>Metamagia {slot + 1}
      <select aria-label={`Metamagia ${slot + 1}`} value={escolhas.find(e => e.slot === slot)?.nome ?? ''} onChange={e => {
        const ok = ficha.selecionarMetamagia(nivelClasse, slot, e.target.value);
        setErro(ok ? '' : 'Escolha indisponível: não repita opções e substitua no máximo uma por nível.');
        if (ok) forceUpdate();
      }}>
        <option value="">Selecione uma opção</option>
        {escolhas.find(e => e.slot === slot) && !opcoesMetamagia(ficha.versaoRegras).some(o => o.nome === escolhas.find(e => e.slot === slot)?.nome) && <option>{escolhas.find(e => e.slot === slot)?.nome}</option>}
        {opcoesMetamagia(ficha.versaoRegras).map(o => <option key={o.nome} disabled={escolhas.some(e => e.slot !== slot && e.nome === o.nome)}>{o.nome}</option>)}
      </select>
      <p>{opcoesMetamagia(ficha.versaoRegras).find(o => o.nome === escolhas.find(e => e.slot === slot)?.nome)?.descricao}</p>
    </label>)}
    {erro && <p role="alert">{erro}</p>}
  </fieldset>;
}
