import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FichaProvider, useFicha } from '../fichaPersonagem/FichaContext';
import { Ficha } from '../fichaPersonagem/FichaPersonagem';
import { exportFicha, parseImport } from '../fichaPersonagem/fichaStorage';
import CriarFicha from '../../pages/criarFicha';
import { getRulesetData } from './getRulesetData';
import * as conteudo from './conteudo';
import { getRulesetConfig } from './regras';

let api;
function Probe() { api = useFicha(); return <CriarFicha />; }
const tick = async fn => act(async () => { fn(); await Promise.resolve(); });

test.each(['DND_2014', 'DND_2024'])('contagem de catálogos em criação, reabertura e níveis: %s', async versaoRegras => {
  const rules = getRulesetData(versaoRegras);
  const ficha = new Ficha({ id: 'a25', versaoRegras, nomePersonagem: 'Perfil', levelTotal: 1,
    idiomasLivres: ['Élfico', 'Anão'], idiomas: ['Comum', 'Élfico', 'Anão'],
    classePrincipal: rules.classes.find(c => c.chave === 'guerreiro'),
    racaPrincipal: rules.racasOuEspecies.find(r => r.nome === 'Humano'), backGround: rules.backgroundsOuOrigens[0] });
  const magias = jest.spyOn(conteudo, 'getMagiasConteudo');
  const talentos = jest.spyOn(conteudo, 'getTalentosConteudo');
  const counts = [];
  const record = etapa => {
    counts.push({ etapa, magias: magias.mock.calls.length, talentos: talentos.mock.calls.length });
    magias.mockClear(); talentos.mockClear();
  };
  const values = new Map();
  const storage = { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) };
  const view = render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><FichaProvider storage={storage}><Probe /></FichaProvider></MemoryRouter>);
  await tick(() => api.setFicha(ficha));
  expect(screen.getByPlaceholderText('Nome do Personagem')).toHaveValue('Perfil');
  record('criacao');
  const saved = exportFicha(api.ficha);
  await tick(() => api.setFicha(null));
  magias.mockClear(); talentos.mockClear();
  await tick(() => api.setFicha(parseImport(saved)));
  record('reabertura');
  await tick(() => { api.ficha.setLevelTotal(3); api.forceUpdate(); });
  record('nivel-3');
  console.log('A25 CONTAGEM', versaoRegras, JSON.stringify(counts));
  expect(counts.map(c => c.magias)).toEqual([0, 0, 0]);
  expect(api.ficha.levelTotal).toBe(3);
  view.unmount();
  magias.mockRestore(); talentos.mockRestore();
});

test.each(['DND_2014', 'DND_2024'])('duas fichas alternadas preservam escolhas, identidades e snapshots: %s', versaoRegras => {
  const make = id => {
    const rules = getRulesetData(versaoRegras);
    return new Ficha({ id, versaoRegras, classePrincipal: rules.classes[0],
      racaPrincipal: rules.racasOuEspecies[0], backGround: rules.backgroundsOuOrigens[0] });
  };
  let a = make('a'); let b = make('b');
  const originalB = exportFicha(b);
  a.racaPrincipal.tracos[0].descricao = 'Escolha A';
  a.classePrincipal.subClasse[0].descricao = 'Subclasse A';
  a.backGround.proeficienciasHabilidades.push('Escolha A');
  const savedA = exportFicha(a);
  expect(exportFicha(b)).toBe(originalB);
  b = parseImport(originalB);
  b.racaPrincipal.tracos[0].descricao = 'Escolha B';
  b.backGround.proeficienciasHabilidades.push('Escolha B');
  a = parseImport(savedA);
  expect(a.racaPrincipal.tracos[0].descricao).toBe('Escolha A');
  expect(a.backGround.proeficienciasHabilidades).not.toContain('Escolha B');
  expect(a.classePrincipal.subClasse[0].id).toBe(JSON.parse(savedA).data.classePrincipal.subClasse[0].id);
  expect(b.racaPrincipal.tracos[0].descricao).toBe('Escolha B');
  expect(make('c').racaPrincipal.tracos[0].descricao).not.toMatch(/Escolha [AB]/);
});

test.each(['DND_2014', 'DND_2024'])('configuração e conteúdo não compartilham escolhas mutáveis: %s', edition => {
  const config = getRulesetConfig(edition);
  config.regras.idiomasDisponiveis.push('Manual');
  expect(getRulesetConfig(edition).regras.idiomasDisponiveis).not.toContain('Manual');
  const rules = getRulesetData(edition);
  const spells = rules.magias;
  const feats = rules.talentos;
  spells[0].listas.push('Manual');
  feats[0].descricao = 'Manual';
  expect(rules.magias[0].listas).not.toContain('Manual');
  expect(rules.talentos[0].descricao).not.toBe('Manual');
  const next = getRulesetData(edition);
  expect(next.classes[0].subClasse[0].id).not.toBe(rules.classes[0].subClasse[0].id);
});
