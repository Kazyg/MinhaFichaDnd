const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');
require.extensions['.ts'] = (modulo, arquivo) => modulo._compile(ts.transpileModule(fs.readFileSync(arquivo, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText, arquivo);
const { traduzirNomeItem } = require(path.resolve('src/bibliotecas/ItensTraduzidos.ts'));
function catalogo(arquivo, classe) {
  const ast = ts.createSourceFile(arquivo, fs.readFileSync(arquivo, 'utf8'), ts.ScriptTarget.Latest, true);
  const registros = [];
  function visitar(no) {
    if (ts.isNewExpression(no) && no.expression.getText(ast) === classe && no.arguments?.length >= 7) {
      const valores = no.arguments.map(a => ts.isStringLiteralLike(a) ? a.text : a.getText(ast));
      registros.push({ nome: valores[7] || valores[0], nomeLocal: valores[0], tipo: valores[1], raridade: valores[4], sintonizavel: valores[5] === 'true', descricao: valores[6] });
    }
    ts.forEachChild(no, visitar);
  }
  visitar(ast);
  return registros;
}
const ingles = catalogo('src/bibliotecas/ItensIngles.ts', 'ItensIngles');
const local = catalogo('src/bibliotecas/Itens.ts', 'Itens');
if (ingles.length !== local.length || ingles.some((i, n) => i.nome !== local[n].nome)) throw new Error('Os registros locais e ingleses não estão alinhados; revisar os IDs do catálogo antes de gerar metadados.');
const candidatos = ingles.filter(i => /^(?:M|R|LA|MA|HA|S|GV)(?:[|,]|$)/.test(i.tipo) || /weapon|armor|shield|staff|rod/i.test(i.tipo) || /(?:functions?|can be used|use it|wielded) as (?:a |an )?(?:magic |\+\d )?(?:weapon|quarterstaff|club|mace|longsword|greatsword|dagger|shield|armor)/i.test(i.descricao));
const destino = path.resolve('docs/equipamentos-magicos-2026-10-14');
fs.mkdirSync(destino, { recursive: true });
fs.writeFileSync(path.join(destino, 'analise-catalogo.json'), JSON.stringify({ registrosLocais: local.length, registrosIngles: ingles.length, candidatos: candidatos.map(({ descricao, ...identificacao }) => identificacao) }, null, 2));
console.log(JSON.stringify({ registrosLocais: local.length, registrosIngles: ingles.length, candidatos: candidatos.length }));
const bases = { dagger: 'Adaga', sickle: 'Foice Curta', longsword: 'Espada Longa', shortsword: 'Espada Curta', greatsword: 'Espada Grande', rapier: 'Rapieira', scimitar: 'Cimitarra', battleaxe: 'Machado de Batalha', greataxe: 'Machado Grande', handaxe: 'Machadinha', warhammer: 'Martelo de Guerra', 'light hammer': 'Martelo Leve', maul: 'Malho', mace: 'Maça', morningstar: 'Maça Estrela', flail: 'Mangual', whip: 'Chicote', glaive: 'Glaive', halberd: 'Alabarda', pike: 'Lança Longa', lance: 'Lança de Montaria', spear: 'Lança', javelin: 'Azagaia', trident: 'Tridente', quarterstaff: 'Bordão', greatclub: 'Clava Grande', club: 'Porrete', longbow: 'Arco Longo', shortbow: 'Arco Curto', 'light crossbow': 'Besta Leve', 'heavy crossbow': 'Besta Pesada', 'hand crossbow': 'Besta de Mão', sling: 'Funda', dart: 'Dardo', 'war pick': 'Picareta de Guerra' };
const espadas = ['Espada Longa', 'Espada Curta', 'Espada Grande', 'Cimitarra', 'Rapieira'];
const todasArmas = Object.values(bases);
const todasArmaduras = ['Acolchoada', 'Couro', 'Couro Batido', 'Gibão de Peles', 'Camisão de Malha', 'Brunea', 'Peitoral', 'Meia-Armadura', 'Cota de Anéis', 'Cota de Malha', 'Cota de Talas', 'Placas'];
const fixos = {};
function grupo(base, nomes) { for (const nome of nomes.split('|')) fixos[nome] = base; }
grupo('Espada Grande', 'Blackrazor|Blade of Avernus|Greater Silver Sword|Silver Sword|Ruinblade|Flayer Slayer|Snicker-Snack|Waythe');
grupo('Espada Longa', 'Sword of the Paruns|Sword of Answering|Sunsword|Shatterspike|Heretic|Moonblade');
grupo('Machado Grande', 'Bloodaxe|Axe of the Dwarvish Lords|Orcsplitter|Executioner\'s Axe');
grupo('Machadinha', 'Woodcutter\'s Axe');
grupo('Martelo de Guerra', 'Dwarven Thrower|Hammer of Runic Focus|Matalotok|Sunforger');
grupo('Martelo Leve', 'Elven Thrower');
grupo('Malho', 'Hammer of Thunderbolts');
grupo('Picareta de Guerra', 'Ironfang');
grupo('Tridente', 'Canian Fork|Wave|Serpent\'s Fang');
grupo('Adaga', 'Knife of Stolen Resistance|True-Ice Shards (Dagger)|Nepenthe');
grupo('Rapieira', 'True-Ice Shards (Rapier)|Piercer');
grupo('Maça', 'Mace of Disruption|Saint Markovia\'s Thighbone');
grupo('Cimitarra', 'Scimitar of Speed');
grupo('Arco Longo', 'Oathbow|Longbow of the Healing Hearth');
grupo('Espada Curta', 'Flame Tongue Shortsword of Greed');
grupo('Placas', 'Armor of Invulnerability|Armor of Vulnerability (Bludgeoning)|Armor of Vulnerability (Piercing)|Armor of Vulnerability (Slashing)|Demon Armor|Dwarven Plate|Infernal Plate Armor|Obsidian Flint Dragon Plate|Plate Armor of Etherealness|Plate Armor of Etherealness (*)|Powered Armor|Scorpion Armor');
grupo('Cota de Malha', 'Efreeti Chain');
grupo('Camisão de Malha', 'Elven Chain|Vanrak\'s Mithral Shirt');
grupo('Couro Batido', 'Glamoured Studded Leather|Heward\'s Hireling Armor|Hunter\'s Coat|Hide of the Feral Guardian (Dormant)|Voidwalker Armor');
grupo('Couro', 'Leather Golem Armor');
grupo('Peitoral', 'Breastplate of Balance|Dragonguard|Stonebreaker\'s Breastplate');
grupo('Brunea', 'Serpent Scale Armor');
grupo('Meia-Armadura', 'Survival Mantle');
grupo('Machado de Batalha', 'Azuredge|Yester Hill Axe');
grupo('Maça', 'Bonecounter|Lightbringer|Nightbringer');
grupo('Tridente', 'Drown');
grupo('Espada Grande', 'Hazirawn');
grupo('Porrete', 'Korolnor Scepter|Lute of Thunderous Thumping');
grupo('Chicote', 'Lash of Shadows (Dormant)|Mind Lash');
grupo('Besta Leve', 'Light Repeating Crossbow');
grupo('Placas', 'Plate of Knight\'s Fellowship');
grupo('Adaga', 'Rakdos Riteknife|Reszur|Tinderstrike');
grupo('Lança Longa', 'Ranseur of Torture');
grupo('Maça Estrela', 'Reaper\'s Scream|The Bloody End (Dormant)');
grupo('Espada Longa', 'Steel|Sword of Kas|Tearulai');
grupo('Martelo de Guerra', 'Whelm');
grupo('Picareta de Guerra', 'Will of the Talon (Dormant)');
grupo('Lança', 'Windvane');
grupo('Machado de Batalha', 'Axe of the Dwarvish Lords');
const basesNaoVerificadas = new Set(['Blade of Avernus', 'Canian Fork', 'Nepenthe', 'Serpent\'s Fang', 'Hammer of Runic Focus']);
const familiasVerificadas = new Set(['Berserker Axe', 'Dancing Sword', 'Defender', 'Dragon Slayer', 'Flame Tongue', 'Frost Brand', 'Giant Slayer', 'Holy Avenger', 'Luck Blade', 'Moon-Touched Sword', 'Nine Lives Stealer', 'Sword of Life Stealing', 'Sword of Sharpness', 'Sword of Vengeance', 'Sword of Wounding', 'Vorpal Sword', 'Weapon of Warning', 'Vicious Weapon', 'Vicious +1 Weapon', 'Adamantine Armor', 'Armor of Gleaming', 'Mithral Armor', 'Cast-Off Armor', 'Smoldering Armor', 'Mariner\'s Armor', 'Dwarven Plate', 'Efreeti Chain', 'Elven Chain', 'Moonblade', 'Hammer of Thunderbolts', 'Oathbow', 'Plate Armor of Etherealness (*)']);
const familiasEspada = ['Acheron Blade', 'Blade of the Medusa', 'Bloodshed Blade', 'Corpse Slayer', 'Crystal Blade', 'Dancing Sword', 'Defender', 'Dragon Slayer', 'Flame Tongue', 'Fool\'s Blade', 'Frost Brand', 'Gambler\'s Blade', 'Holy Avenger', 'Luck Blade', 'Moon-Touched Sword', 'Nine Lives Stealer', 'Polymorph Blade', 'Sword of Life Stealing', 'Sword of Retribution', 'Sword of Sharpness', 'Sword of the Planes', 'Sword of Vengeance', 'Sword of Wounding', 'Vorpal Sword'];
const familiasArma = ['Dazzling Weapon', 'Forcebreaker Weapon', 'Hellfire Weapon', 'Returning Weapon', 'Ruidium Weapon', 'Vicious +1 Weapon', 'Vicious Weapon', 'Weapon of Agonizing Paralysis', 'Weapon of Certain Death', 'Weapon of Throne\'s Command', 'Weapon of Warning', 'Slumbering Dragon\'s Wrath Weapon', 'Stirring Dragon\'s Wrath Weapon', 'Wakened Dragon\'s Wrath Weapon', 'Ascendant Dragon\'s Wrath Weapon'];
const familiasArmadura = ['Adamantine Armor', 'Antimagic Armor', 'Armor of Fungal Spores', 'Armor of Gleaming', 'Armor of Safeguarding', 'Armor of the Fallen', 'Armor of Weightlessness', 'Cast-Off Armor', 'Clockwork Armor', 'Feywrought Armor', 'Gloomwrought Armor', 'Last Stand Armor', 'Living Armor', 'Mariner\'s Armor', 'Mind Carapace Armor', 'Mithral Armor', 'Mizzium Armor', 'Molten Bronze Skin', 'Ruidium Armor', 'Smoldering Armor', 'Zephyr Armor'];
const fontes = ['https://www.dndbeyond.com/sources/dnd/basic-rules-2014/magic-items', 'https://www.dndbeyond.com/sources/dnd/br-2024/magic-items-a-z'];
const propriedadesCore = {
  'Berserker Axe': ['Berserker: Maldição e aumento dos pontos de vida por nível; os efeitos narrativos e de combate são resolvidos na sessão.'],
  'Dancing Sword': ['Dança: Pode atacar flutuando após ativação; o uso temporário é resolvido na sessão.'],
  'Dragon Slayer': ['Matadora de dragões: Dano adicional somente contra dragões.'],
  'Frost Brand': ['Frio +1d6: Causa 1d6 de frio adicional nos golpes e oferece resistência a fogo; consulte as demais propriedades e condições do item.'],
  'Giant Slayer': ['Matadora de gigantes: Dano adicional e possibilidade de derrubar gigantes.'],
  'Luck Blade': ['Sorte: Permite repetir uma jogada nas condições do item; desejos dependem das cargas existentes.'],
  'Nine Lives Stealer': ['Roubar vidas: Pode matar um alvo após um golpe crítico; cargas, limite de vida e resistência são resolvidos na sessão.'],
  'Sword of Life Stealing': ['Roubar vida: Efeito de dano adicional e pontos de vida temporários em golpes críticos, com exceções por tipo de criatura.'],
  'Sword of Sharpness': ['Afiada: Dano maximizado contra objetos e efeitos especiais em golpes críticos, conforme a edição.'],
  'Sword of Vengeance': ['Vingança: Maldição que afeta o comportamento do portador e a escolha de alvos.'],
  'Sword of Wounding': ['Ferimentos: Causa ferimentos com dano e restrições de cura conforme as condições da edição.'],
  'Vorpal Sword': ['Vorpal: Pode decapitar após um resultado 20 na jogada de ataque, respeitando as exceções do alvo.'],
  'Weapon of Warning': ['Alerta: Ajuda contra surpresa e concede vantagem em iniciativa enquanto estiver sintonizada.'],
  'Vicious Weapon': ['Golpe cruel: Dano adicional em acertos críticos; não concede bônus permanente nas jogadas de ataque.'],
  'Vicious +1 Weapon': ['Golpe cruel: Além do bônus +1 declarado, tem dano adicional condicional em acertos críticos.'],
  'Adamantine Armor': ['Adamantina: Transforma acertos críticos contra o portador em acertos normais.'],
  'Armor of Gleaming': ['Reluzente: Esta armadura não fica suja; não concede bônus adicional de CA.'],
  'Mithral Armor': ['Mithral: Remove a desvantagem em Furtividade e o requisito de Força do modelo base.'],
  'Cast-Off Armor': ['Remoção rápida: Pode ser retirada com uma ação.'],
  'Smoldering Armor': ['Fumaça: Libera fumaça inofensiva; não concede bônus adicional de CA.'],
  "Mariner's Armor": ['Marinheira: Oferece deslocamento de natação e auxílio na superfície conforme a descrição; não altera a CA.'],
  'Dwarven Plate': ['Resistir deslocamento: Pode usar uma reação para reduzir em até 3 metros um movimento forçado pelo chão.'],
  'Efreeti Chain': ['Proteção ígnea: Imunidade a fogo, conhecimento de Primordial e capacidade de caminhar sobre rocha derretida.'],
  'Elven Chain': ['Treino próprio: O portador é considerado treinado com esta armadura enquanto a veste.'],
  'Demon Armor': ['Garras e maldição: As luvas modificam ataques desarmados; a maldição e as penalidades contra demônios são resolvidas na sessão.'],
};
const integrados = [], pendentes = [], excluidos = [];
function propriedade(rotulo, descricao) { return `${rotulo}: ${descricao}`; }
for (let indice = 0; indice < ingles.length; indice++) {
  const i = ingles[indice];
  if (!candidatos.includes(i)) continue;
  if (i.raridade.toLowerCase() === 'none' || /^(?:Staff|Shield|Light Repeating Crossbow)$/.test(i.nome) || /Ammunition|Arrow of Slaying|Barding|Orb of Shielding|Imbued Wood|Silvered Weapon|Adamantine Weapon|Repeating Shot/.test(i.nome)) { excluidos.push({ nome: i.nome, motivo: 'Equipamento comum, munição ou item que não representa equipamento mágico completo.' }); continue; }
  const edicao = /XPHB|XDMG/.test(i.tipo) ? 'DND_2024' : 'DND_2014';
  let m = { tipo: 'arma', modo: 'especifico', exigeSintonizacao: i.sintonizavel, edicao, catalogoId: `equipamento:${indice}`, usarDescricaoCatalogo: !!i.descricao };
  const generico = i.nome.match(/^\+([123]) (Weapon|Armor|Shield)(?: \(\*\))?$/);
  if (generico) {
    const bonus = Number(generico[1]);
    m = { ...m, modo: 'melhoria', exigeSintonizacao: false, tipo: { Weapon: 'arma', Armor: 'armadura', Shield: 'escudo' }[generico[2]], ...(generico[2] === 'Weapon' ? { bonusAtaque: bonus, bonusDano: bonus } : { bonusCA: bonus }) };
  } else {
    if (basesNaoVerificadas.has(i.nome)) { pendentes.push({ nome: i.nome, tipo: i.tipo, motivo: 'A descrição não especifica a base; a consulta pública não permitiu verificá-la com segurança.' }); continue; }
    if (i.tipo.startsWith('GV') && (!familiasVerificadas.has(i.nome) && !/^Armor of .* Resistance$/.test(i.nome)) && !['Energy Bow', 'Demon Armor'].includes(i.nome) && !/^Armor of Vulnerability/.test(i.nome)) {
      pendentes.push({ nome: i.nome, tipo: i.tipo, motivo: 'Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração.' });
      continue;
    }
    if (i.nome === 'Moonblade' && edicao === 'DND_2024') { pendentes.push({ nome: i.nome, tipo: i.tipo, motivo: 'Registro 2024 sem descrição das runas; não usa automaticamente a versão 2014.' }); continue; }
    if (/^S(?:[|,]|$)/.test(i.tipo)) { m.tipo = 'escudo'; m.baseNome = 'Escudo'; }
    else if (/Staff/.test(i.tipo)) m.baseNome = 'Bordão';
    else if (fixos[i.nome] || i.nome.startsWith('Sword of Answering (')) m.baseNome = fixos[i.nome] || 'Espada Longa';
    else {
      const evidencia = i.descricao.match(/(?:this (?:magic |magical |\+\d |unique )?|(?:as|is|wields|a|an) (?:a |an )?(?:magic |magical |\+\d )?)(quarterstaff|greatsword|longsword|shortsword|warhammer|battleaxe|greataxe|greatclub|dagger|sickle|mace|flail|trident|javelin|spear|whip|rapier|shortbow|longbow|war pick)\b/i);
      if (evidencia) m.baseNome = bases[evidencia[1].toLowerCase()];
      else {
        const nomeBase = Object.keys(bases).sort((a,b) => b.length-a.length).find(b => new RegExp(`\\b${b}\\b`, 'i').test(i.nome));
        if (nomeBase && !i.tipo.startsWith('GV')) m.baseNome = bases[nomeBase];
      }
    }
    if (/Dragon Scale Mail$/.test(i.nome)) { m.tipo = 'armadura'; m.baseNome = 'Brunea'; }
    if (m.baseNome && todasArmaduras.includes(m.baseNome)) m.tipo = 'armadura';
    if (familiasEspada.includes(i.nome)) { delete m.baseNome; m.basesCompativeis = [...espadas]; }
    if (i.nome === 'Sword of Sharpness') m.basesCompativeis = ['Espada Grande', 'Espada Longa', 'Cimitarra'];
    if (i.nome === 'Vorpal Sword') m.basesCompativeis = ['Espada Grande', 'Espada Longa', 'Cimitarra'];
    if (i.nome === 'Bloodshed Blade') m.basesCompativeis = ['Espada Grande', 'Espada Longa', 'Cimitarra', 'Espada Curta', 'Rapieira'];
    if (familiasArma.includes(i.nome) || /^Enspelled Weapon/.test(i.nome) || /^Drow \+[123] Weapon$/.test(i.nome)) m.basesCompativeis = [...todasArmas];
    if (/^Enspelled Armor|^Armor of .* Resistance$/.test(i.nome) || familiasArmadura.includes(i.nome) || /^Drow \+[123] Armor$|^Mithral \+1 Armor$/.test(i.nome)) { m.tipo = 'armadura'; delete m.baseNome; m.basesCompativeis = [...todasArmaduras]; }
    if (i.nome === 'Adamantine Armor') m.basesCompativeis = todasArmaduras.filter(n => !['Acolchoada', 'Couro', 'Couro Batido', 'Gibão de Peles'].includes(n));
    if (i.nome === 'Mithral Armor' || i.nome === 'Mithral +1 Armor') m.basesCompativeis = todasArmaduras.filter(n => !['Acolchoada', 'Couro', 'Couro Batido', 'Gibão de Peles'].includes(n));
    if (i.nome === 'Berserker Axe') m.basesCompativeis = ['Machadinha', 'Machado de Batalha', 'Machado Grande'];
    if (i.nome === 'Giant Slayer') m.basesCompativeis = [...espadas, 'Machadinha', 'Machado de Batalha', 'Machado Grande'];
    if (i.nome === 'Dragon Wing Bow' || i.nome === 'Energy Bow' || i.nome === 'Bow of Conflagration' || i.nome === 'Bow of Melodies' || i.nome === 'Glimmering Moonbow') m.basesCompativeis = ['Arco Curto', 'Arco Longo'];
    if (i.nome === 'Starshot Crossbow') m.basesCompativeis = ['Besta Leve', 'Besta Pesada', 'Besta de Mão'];
    if (i.nome === 'Dragonlance') m.basesCompativeis = ['Lança Longa', 'Lança de Montaria'];
    if (i.nome === 'Demonbone Polearm') m.basesCompativeis = ['Glaive', 'Alabarda', 'Lança Longa'];
    if (edicao === 'DND_2024' && ['Dwarven Plate', 'Plate Armor of Etherealness (*)'].includes(i.nome)) { m.tipo = 'armadura'; delete m.baseNome; m.basesCompativeis = ['Meia-Armadura', 'Placas']; }
    if (edicao === 'DND_2024' && ['Elven Chain', 'Efreeti Chain'].includes(i.nome)) { m.tipo = 'armadura'; delete m.baseNome; m.basesCompativeis = ['Camisão de Malha', 'Cota de Malha']; }
    if (edicao === 'DND_2024' && (i.nome === 'Demon Armor' || /^Armor of Vulnerability/.test(i.nome))) { m.tipo = 'armadura'; delete m.baseNome; m.basesCompativeis = [...todasArmaduras]; m.exigeSintonizacao = true; }
    const bonus = [...i.descricao.matchAll(/(?:you (?:gain|have)|grants(?: you)?) a \+(\d) bonus to attack(?: rolls)? and damage rolls?[^.]*\./ig)].find(match => !/while you have|only|for every|against|until|if you|when you/i.test(match[0]));
    const definicao = i.descricao.match(/(?:this (?:weapon is a magical )?|this weapon is (?:a |an )?magic(?:al)? )\+(\d) (?:battleaxe|longsword|dagger|mace|warhammer|spear|quarterstaff)/i);
    if (bonus || definicao) m.bonusAtaque = m.bonusDano = Number((bonus || definicao)[1]);
    const ca = [...i.descricao.matchAll(/you (?:gain|have) a \+(\d) bonus to (?:AC|Armor Class)[^.]*\./ig)].find(match => !/against|for every|if |until|within|when|as long as|provided|only|offhand/i.test(match[0]));
    if (ca) m.bonusCA = Number(ca[1]);
    if (['Blood Spear', 'Bloodrage Greataxe'].includes(i.nome)) { delete m.bonusAtaque; delete m.bonusDano; }
    m.propriedadesEspeciais = [];
    if (propriedadesCore[i.nome]) m.propriedadesEspeciais.push(...propriedadesCore[i.nome]);
    const resistencia = i.nome.match(/^Armor of (.+) Resistance$/);
    if (resistencia) m.propriedadesEspeciais.push(propriedade('Resistência', `Oferece resistência ao tipo de dano ${resistencia[1]} enquanto estiver equipada e sintonizada; não concede CA adicional.`));
    if (/^Armor of Vulnerability/.test(i.nome)) m.propriedadesEspeciais.push(propriedade('Vulnerabilidade', 'Oferece resistência a um tipo de dano físico, mas sua maldição impõe vulnerabilidade aos outros dois; retirar a armadura não remove a maldição.'));
    const bonusCore = { 'Berserker Axe': 1, 'Dragon Slayer': 1, 'Giant Slayer': 1, 'Luck Blade': 1, 'Nine Lives Stealer': 2, 'Sword of Vengeance': 1, 'Vorpal Sword': 3, 'Vicious +1 Weapon': 1 };
    if (bonusCore[i.nome]) m.bonusAtaque = m.bonusDano = bonusCore[i.nome];
    if (['Berserker Axe', 'Dancing Sword', 'Frost Brand', 'Luck Blade', 'Nine Lives Stealer', 'Sword of Life Stealing', 'Sword of Sharpness', 'Sword of Vengeance', 'Sword of Wounding', 'Vorpal Sword', 'Weapon of Warning'].includes(i.nome) || /^Armor of .* Resistance$/.test(i.nome)) m.exigeSintonizacao = true;
    if (/^\+[123] Moon Sickle$/.test(i.nome)) {
      const bonus = Number(i.nome[1]); m.bonusAtaque = m.bonusDano = bonus; m.exigeSintonizacao = true;
      m.bonusMagia = ['druida', 'patrulheiro'].map(classeNome => ({ classeNome, ataque: bonus, cd: bonus }));
      m.requisitoSintonizacao = 'Sintonização por druida ou patrulheiro.';
      m.propriedadesEspeciais.push(propriedade('Foco de conjuração', 'Serve como foco para magias de druida e patrulheiro enquanto estiver segurando a foice.'), propriedade('Cura +1d4', 'Ao conjurar uma magia de cura segurando a foice, acrescente 1d4 aos pontos de vida recuperados.'));
    }
    if (/^Sword of Answering/.test(i.nome)) { m.bonusAtaque = m.bonusDano = 3; m.exigeSintonizacao = true; m.requisitoSintonizacao = edicao === 'DND_2014' ? 'Mesmo alinhamento da espada.' : undefined; m.propriedadesEspeciais.push(propriedade(`Reação (${edicao.slice(-4)})`, 'Pode reagir ao sofrer dano de uma criatura ao alcance, atacando-a com vantagem. O dano desse ataque ignora resistência e imunidade.')); }
    if (i.nome === 'Holy Avenger') { m.bonusAtaque = m.bonusDano = 3; m.exigeSintonizacao = true; m.requisitoSintonizacao = 'Sintonização por paladino.'; m.propriedadesEspeciais.push(propriedade('Aura sagrada', 'Concede vantagem em resistências contra magias na aura; alcance depende do nível de paladino.'), propriedade('Dano condicional', 'Acrescenta 2d10 radiante contra ínferos e mortos-vivos.')); }
    if (i.nome === 'Defender') { m.bonusAtaque = m.bonusDano = 3; m.exigeSintonizacao = true; m.propriedadesEspeciais.push(propriedade('Transferir defesa', 'Pode transferir parte do bônus +3 de ataque e dano para CA até o próximo turno. A transferência é resolvida na sessão, sem acrescentar CA permanentemente.')); }
    if (i.nome === 'Flame Tongue') { delete m.bonusAtaque; delete m.bonusDano; m.exigeSintonizacao = true; m.propriedadesEspeciais.push(propriedade('Chamas', 'Ativação por ação bônus; enquanto acesa, causa 2d6 de fogo adicionais e ilumina a área.')); }
    if (i.nome === 'Moon-Touched Sword') { delete m.bonusAtaque; delete m.bonusDano; m.exigeSintonizacao = false; m.propriedadesEspeciais.push(propriedade('Luz lunar', 'Ilumina enquanto desembainhada no escuro; não concede bônus numérico de ataque ou dano.')); }
    if (['Sun Blade', 'Dawnbringer', 'Sunsword'].includes(i.nome)) { m.baseNome = 'Espada Longa'; m.bonusAtaque = m.bonusDano = 2; m.danoTipo = 'Radiante'; m.atributosArma = ['Força', 'Destreza']; m.propriedadesArma = ['Acuidade']; m.proficienciasAlternativas = ['Espada Longa', 'Espada Curta']; m.propriedadesEspeciais.push(propriedade('Lâmina radiante', 'A lâmina é ativada por ação bônus. Causa dano radiante, tem Acuidade e emite luz solar.'), propriedade('Mortos-vivos', 'Causa 1d8 radiante adicional contra mortos-vivos.')); }
    if (i.nome === 'Arrow-Catching Shield' || i.nome === 'Pariah\'s Shield') { delete m.bonusCA; m.propriedadesEspeciais.push(propriedade('CA condicional', i.nome === 'Arrow-Catching Shield' ? '+2 de CA somente contra ataques à distância; pode atrair ataques próximos conforme a descrição.' : 'Bônus de CA depende dos aliados próximos; não é somado à CA permanente.')); }
    if (i.nome === 'Animated Shield') m.propriedadesEspeciais.push(propriedade('Animação', 'Ativação por ação bônus: flutua por até 1 minuto e libera as mãos. O estado animado temporário é resolvido na sessão; equipado normalmente ocupa uma mão.'));
    if (i.nome === 'Sentinel Shield') m.propriedadesEspeciais.push(propriedade('Sentinela', 'Vantagem em iniciativa e testes de Percepção ao segurar o escudo.'));
    if (i.nome === 'Spellguard Shield') m.propriedadesEspeciais.push(propriedade('Proteção mágica', 'Vantagem em resistências contra magias e efeitos mágicos; ataques mágicos contra o portador têm desvantagem.'));
    if (i.nome === 'Shield of Missile Attraction') m.propriedadesEspeciais.push(propriedade('Atração de mísseis', 'Resistência a ataques de armas à distância e maldição que redireciona ataques próximos; não concede CA extra.'));
    if (i.nome === 'Staff of Power') { m.bonusAtaque = m.bonusDano = m.bonusCA = 2; m.bonusMagia = [{ classeNome: 'todas', ataque: 2 }]; }
    if (i.nome === 'Staff of the Magi') { m.bonusAtaque = m.bonusDano = 2; m.bonusMagia = [{ classeNome: 'todas', ataque: 2 }]; }
    if (i.nome === 'Voyager Staff') m.bonusMagia = [{ classeNome: 'todas', ataque: 1 }];
    if (i.nome === 'Staff of the Ivory Claw') m.bonusMagia = [{ classeNome: 'todas', ataque: 1 }];
    if (i.nome === 'Staff of the Woodlands') m.bonusMagia = [{ classeNome: 'todas', ataque: 2 }];
    if (i.nome === 'Dyrrn\'s Tentacle Whip') m.bonusAtaque = m.bonusDano = 2;
    if (i.nome === 'Leather Golem Armor') m.bonusCA = 1;
    if (i.nome === 'Moonblade') { m.bonusAtaque = m.bonusDano = 1; m.propriedadesEspeciais.push(propriedade('Runas', 'A primeira runa concede +1; outras runas e poderes são determinados pelo mestre e não são presumidos.')); }
    if (i.nome === 'Dragon Thighbone Club') m.baseNome = 'Clava Grande';
    if (i.nome === 'Flayer Slayer') m.baseNome = 'Machado Grande';
    const danosBase = { 'Ranseur of Torture': '2d10', 'Scourge of Shadow': '3d4', 'True-Ice Shards (Dagger)': '1d6', 'True-Ice Shards (Rapier)': '1d8', "Gurt's Greataxe": '3d12' };
    if (danosBase[i.nome]) m.danoBase = { dano_1: danosBase[i.nome], dano_2: '' };
    if (i.nome === 'Reaper\'s Scream') m.danoTipo = 'Necrótico';
    if (/^True-Ice Shards/.test(i.nome)) m.danoTipo = 'Frio';
    if (i.nome === 'Snicker-Snack') { m.atributosArma = ['Força', 'Carisma']; m.proficienciasAlternativas = []; m.treinoArma = true; }
    if (i.nome === 'Serpent Scale Armor') { m.destrezaSemLimite = true; m.furtividade = ''; }
    if (i.nome === 'Mithral Armor') { m.furtividade = ''; m.forcaRequerida = 0; }
    if (i.nome === 'Elven Chain') m.treinoArmadura = true;
    if (i.nome === 'Staff of Defense') m.bonusCA = 1;
    if (/Dragon Scale Mail$/.test(i.nome)) m.bonusCA = 1;
    if (i.nome === 'Glamoured Studded Leather') m.bonusCA = 1;
    if (i.nome === 'Elven Chain') m.bonusCA = 1;
    if (i.nome === 'Demon Armor') m.bonusCA = 1;
    if (i.nome === 'Dwarven Plate') m.bonusCA = 2;
    if (i.nome === 'Efreeti Chain') m.bonusCA = 3;
    if (i.nome === 'Energy Bow') { m.exigeSintonizacao = true; m.bonusAtaque = m.bonusDano = 1; m.danoTipo = 'Força'; m.propriedadesEspeciais.push(propriedade('Flechas de energia', 'Produz flechas mágicas de energia; efeitos de contenção e outras ativações são resolvidos na sessão.')); }
    if (i.nome === 'Thunderous Greatclub') m.atributosFixos = [{ atributo: 'forca', valor: 20 }];
    if (!m.baseNome && !m.basesCompativeis?.length) { pendentes.push({ nome: i.nome, tipo: i.tipo, motivo: 'Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática.' }); continue; }
    if (!i.descricao && !m.propriedadesEspeciais.length) m.propriedadesEspeciais.push(propriedade('Dados incompletos', 'O catálogo identifica o equipamento, mas não fornece descrição segura das propriedades; nenhum bônus foi presumido.'));
  }
  integrados.push({ indice, nomeIngles: i.nome, nomeLocal: traduzirNomeItem(local[indice].nomeLocal), tipoOriginal: i.tipo, metadados: m });
}
fs.writeFileSync('src/bibliotecas/equipamentosMagicosCatalogo.json', JSON.stringify(integrados, null, 2) + '\n');
fs.writeFileSync(path.join(destino, 'resultado.json'), JSON.stringify({ registrosAnalisados: ingles.length, candidatos: candidatos.length, registrosIntegrados: integrados.length, nomesIntegrados: [...new Set(integrados.map(i => i.nomeIngles))].sort(), fontes, pendentes, excluidos }, null, 2) + '\n');
const completos = integrados.filter(i => i.metadados.modo === 'especifico');
const relatorio = [
  '# Equipamentos mágicos — revisão de 2026-10-14', '',
  `Analisados os ${ingles.length} registros de ItensIngles.ts e os ${local.length} registros correspondentes de Itens.ts, verificando o alinhamento de todas as posições e usando a tradução real de ItensTraduzidos.ts. São ${new Set(ingles.map(i => i.nome)).size} nomes ingleses distintos; edições e variantes contam como registros separados.`, '',
  `A triagem por categorias estruturadas identificou ${candidatos.length} candidatos. Foram integrados ${integrados.length} registros (${new Set(integrados.map(i => i.nomeIngles)).size} nomes), incluindo ${completos.length} equipamentos completos e ${integrados.length - completos.length} melhorias genéricas. ${pendentes.length} registros permanecem sem criação automática por falta de dados seguros; ${excluidos.length} foram descartados por serem equipamentos comuns, munição ou outros itens.`, '',
  '## Modelagem e comportamento', '',
  '- Metadados e edição são registrados no catálogo; a ficha persiste o snapshot, a base escolhida e o vínculo por ID de instância. Nomes traduzidos também são reconhecidos na migração de fichas antigas.',
  '- Armas, escudos e armaduras específicos geram uma única representação. Bases alternativas exigem escolha compatível; melhorias +1/+2/+3 continuam vinculadas a equipamentos existentes.',
  '- Equipamento e sintonização continuam independentes. Requisitos narrativos são informativos, sem confirmação nem bloqueio.',
  '- CA, ataque e dano usam seletores existentes. A Foice Lunar concede bônus locais e de magias somente para druida/patrulheiro enquanto equipada e sintonizada.',
  '- Propriedades aparecem em spans compactos com tooltips acessíveis por hover, teclado e toque. Reações, cargas, ativações, efeitos de vantagem e danos condicionais não criam um sistema de combate.', '',
  '## Fontes', '',
  ...fontes.map(fonte => `- ${fonte}`),
  '- https://www.dndbeyond.com/magic-items/5389-holy-avenger',
  '- https://www.dndbeyond.com/magic-items/5384-defender',
  '- https://www.dndbeyond.com/posts/1244-ranger-201-the-best-magic-items-for-rangers',
  '- Dados específicos e descrições já presentes no catálogo inglês do projeto. Descrições integrais não são duplicadas neste relatório nem no registro estruturado.', '',
  '## Limitações', '',
  '- Há descrições com marcadores não resolvidos (XPHB, XDMG e referências de livros) e variantes vazias. Campos não verificáveis não recebem valores presumidos.',
  '- Animação do escudo e transferência de bônus da Defensora são temporárias e informativas; o estado permanente não libera mãos nem acrescenta CA automaticamente.',
  '- Cargas, runas adicionais, efeitos condicionais e transformações em combate permanecem sob controle do jogador e mestre.',
  '- Snapshots antigos com metadados próprios são preservados; quando uma edição duplicada não está identificada num snapshot sem origem, a migração reconhece a primeira variante conhecida e registra a edição nos metadados.', '',
  '## Arquivos desta implementação', '',
  '- src/bibliotecas/Itens.ts, ItensMagicos.ts, equipamentosMagicosCatalogo.json',
  '- src/api/fichaPersonagem/FichaPersonagem.ts, fichaEquipamentosMagicos.ts, fichaEfeitosUtils.ts, fichaSeletores.ts, fichaStorage.ts',
  '- src/pages/components/components_inventario/AbaItens.tsx, AbaArmas.tsx, AbaArmaduras.tsx, VinculacaoMagica.tsx, PropriedadesMagicas.tsx',
  '- src/pages/css/ArmaInventario.css',
  '- src/api/fichaPersonagem/fichaEquipamentosMagicos.test.tsx, catalogoEquipamentosMagicos.test.tsx',
  '- scripts/auditar-equipamentos-magicos.cjs e documentos desta pasta', '',
  '## Registros integrados', '',
  '| Item | Nome original | Edição | Tipo | Base / escolha |',
  '| --- | --- | --- | --- | --- |',
  ...integrados.map(i => `| ${i.nomeLocal} | ${i.nomeIngles} | ${i.metadados.edicao.slice(-4)} | ${i.metadados.tipo} (${i.metadados.modo}) | ${i.metadados.baseNome || i.metadados.basesCompativeis?.join(', ') || 'Vincular a instância existente'} |`), '',
  '## Registros pendentes de classificação segura', '',
  '| Item | Categoria original | Motivo |',
  '| --- | --- | --- |',
  ...pendentes.map(i => `| ${i.nome} | ${i.tipo.replace(/\|/g, '/')} | ${i.motivo} |`), '',
];
fs.writeFileSync(path.join(destino, 'RELATORIO.md'), relatorio.join('\n'));
console.log(JSON.stringify({ integrados: integrados.length, nomes: new Set(integrados.map(i => i.nomeIngles)).size, pendentes: pendentes.length, excluidos: excluidos.length }));
for (const i of pendentes) console.log(`PENDENTE: ${i.nome} | ${i.tipo}`);
