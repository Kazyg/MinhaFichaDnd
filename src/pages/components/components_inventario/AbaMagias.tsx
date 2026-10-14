import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ModalSelecaoMagias from '../../modals/ModalMagias';
import '../../css/ArmaInventario.css';
import '../../css/Magias.css';
import fogo from '../../../imagens/local_fire_department_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png';
import { estadosSlots, alternarSlot } from './magiaSlots';
import MagiaCard, { MagiaBadge } from './MagiaCard';
import DescricaoMagia from '../DescricaoMagia';
import { resolverMagiaSalva, buscarMagiaConteudo, apresentarMagia } from '../../../api/rulesets/conteudo';
import { modificadorAtributo, selecionarProficiencia } from '../../../api/fichaPersonagem/fichaSeletores';
import { useFicha } from '../../../api/fichaPersonagem/FichaContext';
import { magiasConcedidas, usarMagiaTalento } from '../../../api/fichaPersonagem/talentos2024Utils';
import { adicionarMagia, selecionarEscolhasMagia, selecionarFontesConjuracao, selecionarPoolsMagia } from '../../../api/fichaPersonagem/fichaConjuracao';

export default function AbaMagias() {
  const { ficha, forceUpdate } = useFicha();
  const [modal, setModal] = useState<string | null>(null);

  const fontes = selecionarFontesConjuracao(ficha);
  const pools = selecionarPoolsMagia(ficha);
  const escolhas = selecionarEscolhasMagia(ficha);
  const concedidas = magiasConcedidas(ficha);
  const card = (escolha: typeof escolhas[number]) => {
    const fonte = fontes.find(f => f.id === escolha.fonte);
    const resolvida = resolverMagiaSalva(escolha);
    const magia = resolvida ? apresentarMagia(resolvida) : undefined;
    const fonteCompativel = fonte?.edicao === magia?.edicao ? fonte : undefined;
    const circulos = pools.filter(p => fonteCompativel && p.fontes.includes(fonteCompativel.id)).flatMap(p => p.espacos.flatMap((n, i) => n > 0 ? [i + 1] : []));
    return <MagiaCard key={escolha.id} nome={escolha.nome} magia={magia} origem={`${fonte?.nome ?? escolha.classe} · ${magia?.edicao.replace('DND_', '') ?? escolha.edicao.replace('DND_', '')}`}
      ataque={fonteCompativel?.ataque} cd={fonteCompativel?.cd} modificador={fonteCompativel ? modificadorAtributo(ficha, fonteCompativel.atributo) : undefined} nivelPersonagem={ficha?.levelTotal ?? 1} circulos={circulos}>
      <DescricaoMagia magia={magia} snapshot={escolha.snapshot} />
    </MagiaCard>;
  };
  const talentoCard = (m: typeof concedidas[number]) => {
    const resolvida = buscarMagiaConteudo('DND_2024', m.magia.nome.replace(/^2024: /, ''));
    const magia = resolvida ? apresentarMagia(resolvida) : undefined;
    const mod = m.atributo ? modificadorAtributo(ficha, m.atributo) : undefined;
    return <MagiaCard key={`${m.origem}:${m.magia.nome}`} nome={m.magia.nome.replace(/^2024: /, '')} magia={magia} origem={`${m.talento} · ${m.atributo ?? 'atributo pendente'} · 2024`}
      ataque={mod === undefined ? undefined : mod + selecionarProficiencia(ficha)} cd={mod === undefined ? undefined : 8 + mod + selecionarProficiencia(ficha)} modificador={mod} nivelPersonagem={ficha?.levelTotal ?? 1}>
      <DescricaoMagia magia={magia} />
      {!magia && <p>{m.magia.descricao}</p>}
      {m.magia.nivel > 0 && m.usosSemEspaco > 0 && <button disabled={(ficha?.efeitos?.find(e => e.tituloEfeito === m.origem)?.usosMagiaTalento?.[m.chaveUso] ?? 0) >= m.usosSemEspaco}
        onClick={() => { if (ficha && usarMagiaTalento(ficha, m.origem, m.magia.nome)) forceUpdate(); }}>Usar sem espaço</button>}
    </MagiaCard>;
  };
  const grupo = (nome: string, registros: typeof escolhas, recursos: typeof pools, talentos: typeof concedidas = []) => {
    const niveis = [...new Set([...registros.map(e => e.nivel).filter((n): n is number => n !== null), ...talentos.map(m => m.magia.nivel),
      ...recursos.flatMap(p => p.espacos.flatMap((total, i) => total > 0 ? [i + 1] : []))])].sort((a, b) => a - b);
    if (!niveis.length) return null;
    return <section key={nome} aria-label={nome} className="magia-grupo">
      {nome !== 'Conjuração' && <h3>{nome}</h3>}
      {niveis.map(nivel => <section key={nivel} className="magia-circulo" aria-label={`${nome}, ${nivel === 0 ? 'Truques' : `Círculo ${nivel}`}`}>
        <div className="magia-circulo-header"><h4>{nivel === 0 ? 'Truques' : `Círculo ${nivel}`}</h4>
          {nivel > 0 && recursos.filter(p => p.espacos[nivel - 1] > 0).map(pool => <div className="magia-slots" key={pool.id} role="group" aria-label={`${pool.nome}, círculo ${nivel}`}>
            {Array.from({ length: pool.espacos[nivel - 1] }, (_, slot) => {
              const chave = pool.id.startsWith('pacto:') ? pool.id : `${pool.id}:${nivel - 1}`;
              const gasto = estadosSlots(ficha?.recursos.slots ?? {}, chave, pool.espacos[nivel - 1])[slot];
              const rotulo = `${pool.nome}, círculo ${nivel}, espaço ${slot + 1}: ${gasto ? 'gasto' : 'disponível'}`;
              return <button key={slot} className={`magia-slot${gasto ? ' gasto' : ''}`} aria-label={rotulo} title={`${rotulo}. Recuperação: ${pool.recuperacao}`} aria-pressed={gasto}
                onClick={() => { if (ficha) { alternarSlot(ficha.recursos.slots, chave, pool.espacos[nivel - 1], slot); forceUpdate(); } }}><img src={fogo} alt="" /></button>;
            })}
            <MagiaBadge detalhe={`${pool.nome}: ${pool.espacos[nivel - 1]} espaços; recuperação: ${pool.recuperacao}`}>ⓘ</MagiaBadge>
          </div>)}
        </div>
        <div className="magia-cards">{registros.filter(e => e.nivel === nivel).map(card)}{talentos.filter(m => m.magia.nivel === nivel).map(talentoCard)}</div>
      </section>)}
    </section>;
  };
  const pacto = pools.filter(p => p.id.startsWith('pacto:'));
  const fontesPacto = new Set(fontes.filter(f => f.progressao === 'pacto').map(f => f.id));
  const pendentes = escolhas.filter(e => e.nivel === null);
  return <div className="magias">
    <div className="header-magias"><h3>Conjuração</h3><button className="adicionar-armas" onClick={() => setModal('')}>Escolher Magia</button>
      {fontes.map(fonte => <div className="magia-fonte" role="group" aria-label={fonte.nome} key={fonte.id}>
        <MagiaBadge detalhe={`${fonte.nome} · ${fonte.edicao.replace('DND_', '')} · nível ${fonte.nivel}. Conjuração por ${fonte.atributo}; escolhas até o círculo ${fonte.circuloMaximo}.`}>{fonte.nome}</MagiaBadge>
        <MagiaBadge detalhe={`CD das magias de ${fonte.nome}, usando ${fonte.atributo}`}>CD {fonte.cd}</MagiaBadge>
        <MagiaBadge detalhe={`Ataque mágico de ${fonte.nome}, usando ${fonte.atributo}`}>Ataque {fonte.ataque >= 0 ? '+' : ''}{fonte.ataque}</MagiaBadge>
        <MagiaBadge detalhe={`Truques selecionados e limite de ${fonte.nome}`}>Truques {escolhas.filter(e => e.fonte === fonte.id && e.categoria === 'truque').length}/{fonte.truques}</MagiaBadge>
        <MagiaBadge detalhe={`Magias ${fonte.categoria === 'conhecida' ? 'conhecidas' : 'preparadas'} e limite de ${fonte.nome}`}>{fonte.categoria === 'conhecida' ? 'Conhecidas' : 'Preparadas'} {escolhas.filter(e => e.fonte === fonte.id && (fonte.categoria === 'livro' ? e.preparada : e.categoria === fonte.categoria)).length}/{fonte.magias}</MagiaBadge>
      </div>)}
    </div>
    {!fontes.length && <p>Nenhuma fonte de conjuração ativa neste nível.</p>}
    {grupo('Conjuração', escolhas.filter(e => e.nivel !== null && !fontesPacto.has(e.fonte) && !e.fonte.startsWith('DND_2014:bruxo') && !e.fonte.startsWith('DND_2024:bruxo')), pools.filter(p => !p.id.startsWith('pacto:')))}
    {grupo(pacto[0]?.nome ?? 'Magia de Pacto', escolhas.filter(e => e.nivel !== null && (fontesPacto.has(e.fonte) || e.fonte.startsWith('DND_2014:bruxo') || e.fonte.startsWith('DND_2024:bruxo'))), pacto)}
    {concedidas.length > 0 && grupo('Magias concedidas por talentos', [], [], concedidas)}
    {pendentes.length > 0 && <section aria-label="Magias pendentes de revisão"><h4>Magias pendentes de revisão</h4><div className="magia-cards">{pendentes.map(card)}</div></section>}
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
