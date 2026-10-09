import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ModalSelecaoMagias from '../../modals/ModalMagias';
import '../../css/Magias.css';
import { useFicha } from '../../../api/fichaPersonagem/FichaContext';
import { adicionarMagia, pendenciasMagia, prepararMagia, removerMagia, revisarFonteMagia, selecionarEscolhasMagia, selecionarFontesConjuracao, selecionarPoolsMagia } from '../../../api/fichaPersonagem/fichaConjuracao';

export default function AbaMagias() {
  const { ficha, forceUpdate } = useFicha();
  const [modal, setModal] = useState<string | null>(null);

  const fontes = selecionarFontesConjuracao(ficha);
  const pools = selecionarPoolsMagia(ficha);
  const escolhas = selecionarEscolhasMagia(ficha);
  return <div className="magias">
    <div className="header-magias"><h3>Conjuração</h3>
      <button className="adicionar-armas" onClick={() => setModal('')}>Escolher Magia</button>
    </div>
    {ficha?.versaoRegras === 'DND_2024' && <p>Catálogo 2024 parcial e versionado. Registros antigos do catálogo 2014 permanecem identificados até revisão explícita.</p>}
    {fontes.map(fonte => <div key={fonte.id}>
      <h4>{fonte.nome} — {fonte.edicao === 'DND_2024' ? '2024' : '2014'} · nível {fonte.nivel}</h4>
      <p>{fonte.atributo}: CD {fonte.cd}, ataque {fonte.ataque >= 0 ? '+' : ''}{fonte.ataque}. Círculo máximo para escolhas: {fonte.circuloMaximo}.</p>
      <p>Truques: {escolhas.filter(e => e.fonte === fonte.id && e.categoria === 'truque').length}/{fonte.truques}.
        {' '}{fonte.categoria === 'conhecida' ? 'Conhecidas' : 'Preparadas'}: {escolhas.filter(e => e.fonte === fonte.id && (fonte.categoria === 'livro' ? e.preparada : e.categoria === fonte.categoria)).length}/{fonte.magias}.
        {fonte.categoria === 'livro' && ` Livro: ${escolhas.filter(e => e.fonte === fonte.id && e.categoria === 'livro').length} (progressão: ${fonte.livroPorProgressao}; cópias adicionais registradas separadamente).`}</p>
    </div>)}
    {!fontes.length && <p>Nenhuma fonte de conjuração ativa neste nível.</p>}
    <p><a href={ficha?.versaoRegras === 'DND_2024' ? 'https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary' : 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/adventuring'}>Regras de descanso da edição</a></p>
    {pools.map(pool => <section key={pool.id} aria-label={pool.nome}>
      <h4>{pool.nome}</h4><p>Recuperação: {pool.recuperacao}. Consumo salvo na ficha.</p>
      {pool.espacos.map((total, i) => total > 0 && <div key={i} className="espacos-magia">
        <span>Círculo {i + 1}: {total} espaços</span><span>Gastos: {ficha?.recursos.slots[pool.id.startsWith('pacto:') ? pool.id : `${pool.id}:${i}`] ?? 0} gastos (preservados ao mudar nível).</span>
        {Array.from({ length: total }, (_, slot) => {
          const chave = pool.id.startsWith('pacto:') ? pool.id : `${pool.id}:${i}`;
          const usados = ficha?.recursos.slots[chave] ?? 0;
          const id = `${pool.id}:${i}:${slot}`;
          return <button key={id} className="botao-espaco-magia" aria-label={`${pool.nome}, círculo ${i + 1}, espaço ${slot + 1}`} aria-pressed={slot < usados}
            onClick={() => { if (ficha) { ficha.recursos.slots[chave] = slot < usados ? slot : slot + 1; forceUpdate(); } }}>{slot < usados ? 'Gasto' : 'Disponível'}</button>;
        })}
      </div>)}
    </section>)}
    <h3>Magias registradas</h3>
    {escolhas.map(escolha => {
      const pendencias = pendenciasMagia(ficha, escolha);
      const fonte = fontes.find(f => f.id === escolha.fonte);
      return <div key={escolha.id} className="nivel-magia-container">
        <p>{escolha.nome} — {fonte?.nome ?? escolha.classe} · {escolha.nivel === 0 ? 'Truque' : `Círculo ${escolha.nivel ?? '?'}`} · {escolha.categoria} {escolha.preparada && escolha.categoria === 'livro' ? '(preparada)' : ''}</p>
        {pendencias.length > 0 && <ul aria-label={`Pendências de ${escolha.nome}`}>{pendencias.map((p, i) => <li key={i}>{p}</li>)}</ul>}
        {pendencias.length > 0 && <label>Revisar fonte e conteúdo de {escolha.nome}
          <select value="" onChange={e => {
            if (!ficha || !e.target.value) return;
            const erro = revisarFonteMagia(ficha, escolha.id, e.target.value);
            if (erro) toast.error(erro); else forceUpdate();
          }}><option value="">Aplicar catálogo atual desta fonte...</option>{fontes.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}</select>
        </label>}
        <button onClick={() => setModal(escolha.id)}>Detalhes de {escolha.nome}</button>
        {escolha.categoria === 'livro' && <button onClick={() => {
          if (!ficha) return;
          const erro = prepararMagia(ficha, escolha.id, !escolha.preparada);
          if (erro) toast.error(erro); else forceUpdate();
        }}>{escolha.preparada ? 'Despreparar' : 'Preparar'} {escolha.nome}</button>}
        <button onClick={() => { if (ficha) { removerMagia(ficha, escolha.id); forceUpdate(); } }}>Arquivar {escolha.nome} desta fonte</button>
      </div>;
    })}
    {modal !== null && <>
      <div className="popup-overlay" onClick={() => setModal(null)} />
      <div className="popup"><ModalSelecaoMagias titulo={modal ? `Info ${escolhas.find(e => e.id === modal)?.nome ?? modal}` : 'Escolher magia e fonte'} magiaSelect={modal ? escolhas.find(e => e.id === modal)?.nome ?? modal : ''} escolhaSalva={escolhas.find(e => e.id === modal)}
        onClose={() => setModal(null)} onSelect={(nome, fonte, aquisicao) => {
          if (!ficha || !fonte) return false;
          const erro = adicionarMagia(ficha, fonte, nome, aquisicao);
          if (erro) { toast.error(erro); return false; }
          forceUpdate(); return true;
        }} /></div>
    </>}
  </div>;
}
