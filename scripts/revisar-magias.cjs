const fs = require('node:fs');
const path = require('node:path');
const entradas = [
  ['Mísseis Mágicos','Magic Missile',null,null,1,4,'Energia',0],
  ['Raio de Fogo','Fire Bolt','distancia',null,1,10,'Fogo',0],
  ['Bola de Fogo','Fireball',null,'Destreza',8,6,'Fogo',1],
  ['Mãos Flamejantes','Burning Hands',null,'Destreza',3,6,'Fogo',1],
  ['Onda Trovejante','Thunderwave',null,'Constituição',2,8,'Trovejante',1],
  ['Raio de Gelo','Ray of Frost','distancia',null,1,8,'Frio',0],
  ['Toque Chocante','Shocking Grasp','corpo-a-corpo',null,1,8,'Elétrico',0],
  ['Toque Arrepiante','Chill Touch','distancia',null,1,8,'Necrótico',0],
  ['Rajada Mística','Eldritch Blast','distancia',null,1,10,'Energia',0],
  ['Espirro Ácido','Acid Splash',null,'Destreza',1,6,'Ácido',0],
  ['Rajada de Veneno','Poison Spray',null,'Constituição',1,12,'Veneno',0],
  ['Chama Sagrada','Sacred Flame',null,'Destreza',1,8,'Radiante',0],
  ['Produzir Chama','Produce Flame','distancia',null,1,8,'Fogo',0],
  ['Zombaria Viciosa','Vicious Mockery',null,'Sabedoria',1,4,'Psíquico',0],
  ['Infligir Ferimentos','Inflict Wounds','corpo-a-corpo',null,3,10,'Necrótico',1],
  ['Raio Guiador','Guiding Bolt','distancia',null,4,6,'Radiante',1],
  ['Raio de Bruxa','Witch Bolt','distancia',null,1,12,'Elétrico',1],
  ['Raio Adoecente','Ray of Sickness','distancia','Constituição',2,8,'Veneno',1],
  ['Raio Ardente','Scorching Ray','distancia',null,2,6,'Fogo',0],
  ['Despedaçar','Shatter',null,'Constituição',3,8,'Trovejante',1],
  ['Flecha Ácida de Melf','Acid Arrow','distancia',null,4,4,'Ácido',1],
  ['Esfera Flamejante','Flaming Sphere',null,'Destreza',2,6,'Fogo',1],
  ['Raio Lunar','Moonbeam',null,'Constituição',2,10,'Radiante',1],
  ['Arma Espiritual','Spiritual Weapon','corpo-a-corpo',null,1,8,'Energia',1],
  ['Relâmpago','Lightning Bolt',null,'Destreza',8,6,'Elétrico',1],
  ['Guardiões Espirituais','Spirit Guardians',null,'Sabedoria',3,8,'Radiante ou Necrótico',1],
  ['Toque Vampírico','Vampiric Touch','corpo-a-corpo',null,3,6,'Necrótico',1],
  ['Invocar Relâmpagos','Call Lightning',null,'Destreza',3,10,'Elétrico',1],
  ['Cone de Frio','Cone of Cold',null,'Constituição',8,8,'Frio',1],
  ['Coluna de Chamas','Flame Strike',null,'Destreza',4,6,'Fogo',1],
  ['Desintegrar','Disintegrate',null,'Destreza',10,6,'Energia',3],
  ['Barreira de Lâminas','Blade Barrier',null,'Destreza',6,10,'Cortante',0],
  ['Corrente de Relâmpagos','Chain Lightning',null,'Destreza',10,8,'Elétrico',0],
  ['Círculo da Morte','Circle of Death',null,'Constituição',8,6,'Necrótico',2],
  ['Dedo da Morte','Finger of Death',null,'Constituição',7,8,'Necrótico',0],
  ['Praga de Insetos','Insect Plague',null,'Constituição',4,10,'Perfurante',1],
  ['Muralha de Fogo','Wall of Fire',null,'Destreza',5,8,'Fogo',1],
  ['Explosão Solar','Sunburst',null,'Constituição',12,6,'Radiante',0],
  ['Raio Solar','Sunbeam',null,'Constituição',6,8,'Radiante',0],
  ['Curar Ferimentos','Cure Wounds',null,null],
  ['Palavra Curativa','Healing Word',null,null],
  ['Curar Ferimentos em Massa','Mass Cure Wounds',null,null],
  ['Palavra Curativa em Massa','Mass Healing Word',null,null],
  ['Enfeitiçar Pessoa','Charm Person',null,'Sabedoria'],
  ['Imobilizar Pessoa','Hold Person',null,'Sabedoria'],
  ['Imobilizar Monstro','Hold Monster',null,'Sabedoria'],
  ['Medo','Fear',null,'Sabedoria'],
  ['Lentidão','Slow',null,'Sabedoria'],
  ['Padrão Hipnótico','Hypnotic Pattern',null,'Sabedoria'],
  ['Banimento','Banishment',null,'Carisma'],
  ['Polimorfia','Polymorph',null,'Sabedoria'],
  ['Confusão','Confusion',null,'Sabedoria'],
  ['Sono','Sleep',null,null],
  ['Escudo Arcano','Shield',null,null],
  ['Armadura Arcana','Mage Armor',null,null],
  ['Bênção','Bless',null,null],
  ['Perdição','Bane',null,'Carisma'],
  ['Auxílio','Aid',null,null],
  ['Luz','Light',null,null],
  ['Mãos Mágicas','Mage Hand',null,null],
  ['Detectar Magia','Detect Magic',null,null],
  ['Passo Nebuloso','Misty Step',null,null],
  ['Invisibilidade','Invisibility',null,null],
  ['Amizade Animal','Animal Friendship',null,'Sabedoria'],
  ['Animar Mortos','Animate Dead',null,null],
  ['Chama Contínua','Continual Flame',null,null],
  ['Escrita Ilusória','Illusory Script',null,null],
  ['Proteção Contra Veneno','Protection from Poison',null,null],
  ['Proteção Contra Energia','Protection from Energy',null,null],
  ['Proteção Contra a Morte','Death Ward',null,null],
  ['Rogar Maldição','Bestow Curse',null,'Sabedoria'],
  ['Banquete de Heróis','Heroes’ Feast',null,null],
  ['Enfraquecer Intelecto','Feeblemind',null,'Inteligência',4,6,'Psíquico',0],
  ['Telecinesia','Telekinesis',null,null],
  ['Criar Passagem','Passwall',null,null],
  ['Chicote de Espinhos','Thorn Whip','corpo-a-corpo',null,1,6,'Perfurante',0],
  ['Fagulha Estelar','Starry Wisp','distancia',null,1,8,'Radiante',0],
  ['Nuvem de Adagas','Cloud of Daggers',null,null,4,4,'Cortante',2],
  ['Esquentar Metal','Heat Metal',null,'Constituição',2,8,'Fogo',1],
  ['Crescer Espinhos','Spike Growth',null,null,2,4,'Perfurante',0],
  ['Lâmina Flamejante','Flame Blade','corpo-a-corpo',null,3,6,'Fogo',1],
  ['Escudo Ardente','Fire Shield',null,null,2,8,'Fogo ou Frio',0],
  ['Névoa Mortal','Cloudkill',null,'Constituição',5,8,'Veneno',1],
  ['Nuvem Incendiária','Incendiary Cloud',null,'Destreza',10,8,'Fogo',0],
  ['Tempestade de Fogo','Fire Storm',null,'Destreza',7,10,'Fogo',0],
  ['Tempestade Glacial','Ice Storm',null,'Destreza',2,8,'Concussão',1],
  ['Chuva de Meteoros','Meteor Swarm',null,'Destreza',20,6,'Fogo',0],
  ['Favor Divino','Divine Favor',null,null,1,4,'Radiante',0],
  ['Marca do Predador','Hunter’s Mark',null,null,1,6,'Tipo da arma',0],
  ['Orbe Cromático','Chromatic Orb','distancia',null,3,8,'Tipo escolhido',1],
  ['Sussurros Dissonantes','Dissonant Whispers',null,'Sabedoria',3,6,'Psíquico',1],
  ['Faca de Gelo','Ice Knife','distancia','Destreza',1,10,'Perfurante',0],
  ['Repreensão Diabólica','Hellish Rebuke',null,'Destreza',2,10,'Fogo',1],
  ['Badalar Fúnebre','Toll the Dead',null,'Sabedoria',1,8,'Necrótico',0],
  ['Palavra de Radiância','Word of Radiance',null,'Constituição',1,6,'Radiante',0],
  ['Talho Mental','Mind Sliver',null,'Inteligência',1,6,'Psíquico',0],
  ['Trovão','Thunderclap',null,'Constituição',1,6,'Trovejante',0],
  ['Destruição Divina','Divine Smite',null,null,2,8,'Radiante',1],
  ['Aura de Vitalidade','Aura of Vitality',null,null],
  ['Oração de Cura','Prayer of Healing',null,null],
  ['Regeneração','Regenerate',null,null],
];
const notas = {
  'Magic Missile': 'Cada dardo acerta automaticamente uma criatura visível. Os dardos atingem simultaneamente e podem ser distribuídos entre alvos.',
  'Eldritch Blast': 'Faça uma jogada de ataque por feixe; os feixes podem atingir alvos diferentes. O dano indicado é por feixe, sem modificador automático.',
  'Scorching Ray': 'Faça uma jogada de ataque por raio. Os raios podem atingir o mesmo alvo ou alvos diferentes.',
  'Witch Bolt': 'A fórmula indica o dano inicial. O efeito sustentado causa 1d12 e segue a descrição da edição.',
  'Acid Arrow': 'Dano indicado no acerto inicial. Ao final do próximo turno do alvo, causa 2d4, aumentando 1d4 por círculo acima do segundo; consulte também o efeito de um erro.',
  'Spiritual Weapon': 'O dano usa o modificador de conjuração. A concentração e o escalonamento dependem da edição.',
  'Vampiric Touch': 'Recupera PV iguais à metade do dano necrótico causado.',
  'Spirit Guardians': 'O tipo de dano depende da opção definida na descrição. A aplicação e a frequência seguem a edição.',
  'Call Lightning': 'Sob uma tempestade existente, acrescente 1d10 ao dano.',
  'Charm Person': 'Um humanoide faz resistência de Sabedoria; em combate, pode ter vantagem conforme a descrição. A magia não dá controle total sobre o alvo.',
  'Hold Person': 'Um humanoide faz resistência de Sabedoria; em falha, fica paralisado enquanto o efeito durar, repetindo a resistência conforme a descrição.',
  'Hold Monster': 'O alvo faz resistência de Sabedoria e pode ficar paralisado; repete a resistência conforme a descrição.',
  'Fear': 'Criaturas na área fazem resistência de Sabedoria; a falha provoca medo e fuga conforme a descrição.',
  'Slow': 'Até seis criaturas na área fazem resistência de Sabedoria; a falha reduz suas opções de movimento e ações.',
  'Hypnotic Pattern': 'Criaturas que veem o padrão fazem resistência de Sabedoria; em falha, ficam enfeitiçadas e incapacitadas até o efeito terminar ou ser interrompido.',
  'Banishment': 'O alvo faz resistência de Carisma; em falha, é banido temporariamente, conforme sua origem e a descrição da edição.',
  'Polymorph': 'Transforma uma criatura em uma besta permitida pela descrição. Um alvo involuntário faz resistência de Sabedoria.',
  'Confusion': 'Criaturas na área fazem resistência de Sabedoria; a falha altera seu comportamento, determinado pela tabela da magia.',
  'Shield': 'Uma reação concede +5 à CA até o início do próximo turno, incluindo contra o ataque desencadeador, e impede o dano de Mísseis Mágicos.',
  'Mage Armor': 'Uma criatura voluntária sem armadura passa a ter CA base 13 + modificador de Destreza por até 8 horas.',
  'Bless': 'Até três criaturas acrescentam 1d4 a ataques e resistências enquanto o efeito durar. Cada círculo acima do primeiro permite mais um alvo.',
  'Bane': 'Até três criaturas fazem resistência de Carisma. Em falha, subtraem 1d4 de ataques e resistências; cada círculo superior permite mais um alvo.',
  'Aid': 'Até três criaturas aumentam seus PV atuais e máximos em 5 por 8 horas, mais 5 por círculo acima do segundo.',
  'Light': 'Um objeto emite luz plena em 6 m e penumbra por mais 6 m, por até 1 hora. Consulte as condições para objetos carregados por criaturas hostis.',
  'Mage Hand': 'Uma mão espectral manipula objetos leves à distância. Não pode atacar, ativar itens mágicos nem carregar mais de cerca de 4,5 kg.',
  'Detect Magic': 'Permite detectar magia próxima enquanto mantém concentração; consulte a descrição para auras e obstáculos que bloqueiam a percepção.',
  'Misty Step': 'Teleporta você para um espaço desocupado visível a até 9 m, como ação bônus.',
  'Invisibility': 'Uma criatura fica invisível enquanto o efeito durar. As condições que encerram a invisibilidade seguem a edição.',
  'Animal Friendship': 'Uma besta faz resistência de Sabedoria. Em falha, fica enfeitiçada; as limitações do alvo seguem a edição.',
  'Animate Dead': 'Anima restos como um morto-vivo ou renova o controle sobre mortos-vivos já criados, conforme a descrição e o círculo utilizado.',
  'Continual Flame': 'Cria uma chama permanente que ilumina sem consumir combustível nem produzir calor, até ser dissipada.',
  'Illusory Script': 'Oculta o significado de uma escrita por 10 dias; leitores designados veem a mensagem verdadeira.',
  'Protection from Poison': 'Neutraliza veneno no alvo e concede resistência a dano de veneno e vantagem nas resistências contra envenenamento durante o efeito.',
  'Protection from Energy': 'Concede resistência a um tipo escolhido entre ácido, frio, fogo, elétrico e trovejante enquanto mantém concentração.',
  'Death Ward': 'Protege uma vez contra cair a 0 PV ou contra um efeito que mataria instantaneamente sem causar dano, conforme a descrição.',
  'Bestow Curse': 'Em falha na resistência de Sabedoria, o alvo sofre uma maldição escolhida entre os efeitos da descrição. Duração e concentração variam com o círculo.',
  'Heroes’ Feast': 'Cria um banquete para até doze criaturas, com benefícios contra medo e veneno e aumento de PV por 24 horas, conforme a edição.',
  'Telekinesis': 'Move uma criatura ou objeto por esforço mágico enquanto mantém concentração; o teste para resistir depende da edição.',
  'Passwall': 'Abre uma passagem temporária em uma superfície de madeira, pedra ou gesso, dentro das dimensões da descrição.',
  'Cloud of Daggers':'Uma área de adagas causa o dano indicado sem resistência; os momentos de aplicação seguem a edição.',
  'Heat Metal':'A fórmula indica o dano causado pelo objeto aquecido. A resistência de Constituição está ligada a soltar o objeto; não reduz automaticamente o dano.',
  'Spike Growth':'A área é terreno difícil. O dano indicado se aplica por cada 1,5 m percorridos dentro dela, sem jogada de ataque ou resistência contra o dano.',
  'Flame Blade':'A lâmina permite ataques mágicos corpo a corpo. O modificador e o escalonamento seguem a edição.',
  'Fire Shield':'A fórmula indica o dano de retaliação contra um atacante a até 1,5 m que acerte você com um ataque corpo a corpo. A versão escolhida determina fogo ou frio.',
  'Divine Favor':'A fórmula indica o dano adicional de seus ataques com armas que acertarem; não é um ataque mágico separado.',
  'Hunter’s Mark':'A fórmula indica o dano adicional ao acertar a criatura marcada, respeitando os tipos de ataque permitidos pela edição.',
  'Chromatic Orb':'Escolha ácido, frio, fogo, elétrico, veneno ou trovejante. Faça um ataque mágico à distância; saltos para outros alvos seguem a descrição de 2024.',
  'Dissonant Whispers':'Em falha na resistência de Sabedoria, o alvo sofre o dano e usa sua reação para se afastar conforme a descrição. Em sucesso, sofre metade do dano.',
  'Ice Knife':'O ataque determina o dano perfurante inicial. Acertando ou errando, a explosão exige resistência de Destreza contra o dano de frio, conforme a descrição.',
  'Hellish Rebuke':'Uma reação causa dano de fogo à criatura que o feriu; uma resistência bem-sucedida de Destreza reduz esse dano à metade.',
  'Toll the Dead':'Use d12 quando o alvo já perdeu PV; caso contrário, use d8. A resistência de Sabedoria evita o dano conforme a descrição.',
  'Divine Smite':'A fórmula é o dano radiante adicional após acertar um ataque permitido pela magia. Acrescente 1d8 contra um ínfero ou morto-vivo.',
  'Aura of Vitality':'A aura permite restaurar 2d6 PV nas condições e momentos da descrição da edição, sem acrescentar o modificador de conjuração.',
  'Regenerate':'A fórmula é a cura inicial; depois o alvo recupera 1 PV no início de cada turno durante o efeito. A magia também pode restaurar membros decepados.',
};
const escolas = { Abjuration:'abjuração', Conjuration:'conjuração', Divination:'adivinhação', Enchantment:'encantamento', Evocation:'evocação', Illusion:'ilusão', Necromancy:'necromancia', Transmutation:'transmutação' };
const spells = edition => {
  const pages = JSON.parse(fs.readFileSync(`tmp/srd${edition}-spells.json`, 'utf8'));
  const segments = pages.map(p => ({ page:p.page, text:p.text.replace(/System Reference Document[^\n]*\n/g,'').replace(/[\u00a0\t\r]+/g,' ').replace(/\u00ad\s*\n/g,'').replace(/\u00ad/g,'').replace(/ +/g,' ').replace(/ *[‑‐] */g,'-').split('\n').map(s => s.trim()).join('\n') }));
  let offset = 0;
  const locations = segments.map(p => { const position = { page:p.page, offset }; offset += p.text.length + 1; return position; });
  const text = segments.map(p => p.text).join('\n');
  const pattern = edition === '52' ? /^([^\n]+)\n((?:Level [1-9] |[A-Z][a-z]+ Cantrip)[^\n]*)/gm : /^([^\n]+)\n((?:[1-9](?:st|nd|rd|th)-+level|[A-Za-z]+ cantrip)[^\n]*)/gm;
  const starts = [...text.matchAll(pattern)];
  return new Map(starts.map((m,i) => [m[1].trim(), { text:text.slice(m.index,starts[i+1]?.index ?? text.length).replace(/-\s*\n\s*/g,'').replace(/\s+/g,' '), page:locations.filter(p => p.offset <= m.index).at(-1)?.page }]));
};
const result = {};
for (const edition of ['51','52']) {
  const source = spells(edition);
  const edicao = edition === '51' ? 'DND_2014' : 'DND_2024';
  result[edicao] = {};
  for (const [nome, ingles, attack, save, base, die, type, upcast] of entradas) {
    const spell = source.get(ingles);
    if (!spell) continue;
    const combate = { fonte:`https://media.dndbeyond.com/compendium-images/srd/5.${edition === '51' ? '1' : '2'}/SRD_CC_v5.${edition === '51' ? '1' : '2'}.pdf` };
    if (attack) combate.ataque = attack;
    if (save) combate.resistencia = save;
    if (die) combate.dano = { dadosBase:base, dado:die, tipo:type, ...(upcast ? { dadosPorCirculo:upcast } : {}) };
    if (die && spell.text.includes('Cantrip') || die && spell.text.includes('cantrip')) combate.dano.niveisPersonagem = [5,11,17];
    if (ingles === 'Magic Missile') {
      combate.dano.bonusFixo = 1; combate.dano.rotulo = 'Dano por dardo';
      combate.alvos = { rotulo:'Dardos', base:3, porCirculo:1 }; combate.propriedades = ['Acerto automático'];
    }
    if (ingles === 'Eldritch Blast') {
      delete combate.dano.niveisPersonagem; combate.dano.rotulo = 'Dano por feixe';
      combate.alvos = { rotulo:'Feixes', base:1, niveisPersonagem:[5,11,17] };
    }
    if (ingles === 'Scorching Ray') { combate.dano.rotulo = 'Dano por raio'; combate.alvos = { rotulo:'Raios', base:3, porCirculo:1 }; }
    if (ingles === 'Spiritual Weapon') { combate.dano.modificador = true; combate.dano.intervaloCirculos = edition === '51' ? 2 : 1; }
    if (ingles === 'Disintegrate') combate.dano.bonusFixo = 40;
    if (ingles === 'Finger of Death') combate.dano.bonusFixo = 30;
    if (ingles === 'Flame Strike') combate.danosAdicionais = [{ ...combate.dano, tipo:'Radiante' }];
    if (ingles === 'Ice Storm') combate.danosAdicionais = [{ dadosBase:4, dado:6, tipo:'Frio' }];
    if (ingles === 'Meteor Swarm') combate.danosAdicionais = [{ ...combate.dano, tipo:'Concussão' }];
    if (ingles === 'Ice Knife') { combate.dano.rotulo = 'Dano no acerto'; combate.danosAdicionais = [{ dadosBase:2, dado:6, dadosPorCirculo:1, tipo:'Frio', rotulo:'Dano da explosão' }]; }
    if (ingles === 'Spike Growth') combate.dano.rotulo = 'Dano por 1,5 m percorridos';
    if (['Divine Favor','Hunter’s Mark','Divine Smite'].includes(ingles)) combate.dano.rotulo = 'Dano adicional ao acertar';
    if (ingles === 'Flame Blade' && edition === '51') combate.dano.intervaloCirculos = 2;
    if (ingles === 'Toll the Dead') combate.danosAdicionais = [{ ...combate.dano, dado:12, rotulo:'Dano se o alvo já perdeu PV' }];
    if (ingles === 'Aura of Vitality') combate.cura = { dadosBase:2, dado:6 };
    if (ingles === 'Regenerate') combate.cura = { dadosBase:4, dado:8, bonusFixo:15 };
    if (ingles === 'Prayer of Healing') {
      combate.cura = { dadosBase:2, dado:8, dadosPorCirculo:1, modificador:edition === '51' };
      combate.alvos = { rotulo:'Alvos (até)', base:edition === '51' ? 6 : 5 };
      combate.notas = [edition === '51' ? 'Restaura PV de até seis criaturas visíveis. Não afeta mortos-vivos nem constructos.' : 'Até cinco criaturas recebem os benefícios de um descanso curto e a cura indicada. Uma criatura só pode receber novamente esse benefício após um descanso longo.'];
    }
    if (ingles.includes('Cure Wounds') || ingles.includes('Healing Word')) {
      const mass = ingles.startsWith('Mass');
      const wounds = ingles.includes('Wounds');
      combate.cura = { dadosBase:mass && wounds ? edition === '51' ? 3 : 5 : edition === '51' ? 1 : 2, dado:wounds ? 8 : 4, modificador:true, dadosPorCirculo:mass ? 1 : edition === '51' ? 1 : 2 };
      if (mass) combate.alvos = { rotulo:'Alvos (até)', base:6 };
    }
    if (edition === '52') {
      if (ingles === 'Chill Touch') { combate.ataque = 'corpo-a-corpo'; combate.dano.dado = 10; }
      if (ingles === 'Poison Spray') { delete combate.resistencia; combate.ataque = 'distancia'; }
      if (ingles === 'Vicious Mockery') combate.dano.dado = 6;
      if (ingles === 'Inflict Wounds') { delete combate.ataque; combate.resistencia = 'Constituição'; combate.dano.dadosBase = 2; }
      if (ingles === 'Witch Bolt') combate.dano.dadosBase = 2;
      if (ingles === 'Ray of Sickness') delete combate.resistencia;
      if (ingles === 'Flame Strike') { combate.dano.dadosBase = 5; combate.danosAdicionais[0].dadosBase = 5; }
      if (ingles === 'Circle of Death') combate.dano.dado = 8;
      if (ingles === 'Ice Storm') combate.dano.dado = 10;
      if (ingles === 'Flame Blade') combate.dano.modificador = true;
      if (ingles === 'Hunter’s Mark') combate.dano.tipo = 'Energia';
    }
    if (ingles === 'Sleep') {
      if (edition === '51') { combate.propriedades = ['5d8 PV afetados', '+2d8 PV por círculo superior']; }
      else { combate.resistencia = 'Sabedoria'; combate.propriedades = ['Concentração', 'Resistências sucessivas']; }
    }
    if (notas[ingles]) combate.notas = [notas[ingles]];
    if (['Bless','Bane'].includes(ingles)) combate.alvos = { rotulo:'Alvos (até)', base:3, porCirculo:1 };
    if (ingles === 'Aid') combate.alvos = { rotulo:'Alvos (até)', base:3 };
    if (['Charm Person','Hold Person','Hold Monster','Invisibility','Banishment'].includes(ingles)) combate.alvos = { rotulo:'Alvos (até)', base:1, porCirculo:1 };
    if (combate.dano && !spell.text.includes(`${combate.dano.dadosBase}d${combate.dano.dado}`)) throw new Error(`Fórmula base ausente da fonte: ${edicao} ${nome}`);
    const summary = ingles === 'Sleep' ? edition === '51' ? 'Afeta criaturas em ordem crescente de PV atuais, dentro da reserva rolada; as criaturas afetadas adormecem conforme a descrição.' : 'Criaturas na área fazem resistência de Sabedoria; em falha, ficam incapacitadas e repetem a resistência, podendo ficar inconscientes.'
      : ingles === 'Prayer of Healing' ? combate.notas[0]
      : notas[ingles] ?? (combate.cura ? 'Restaura pontos de vida conforme a fórmula indicada, usando o modificador de conjuração. Consulte as limitações de alvo e os demais efeitos na descrição da edição.'
        : combate.dano ? `A fórmula indica o dano${combate.dano.rotulo ? ' por projétil' : ''}. ${combate.ataque ? 'Exige uma jogada de ataque mágico.' : combate.resistencia ? `O alvo faz resistência de ${combate.resistencia}; consulte o efeito de uma resistência bem-sucedida na descrição.` : ''} As condições e a frequência de aplicação seguem a descrição da edição.` : undefined);
    const level = spell.text.match(/(?:Level ([1-9])|([1-9])(?:st|nd|rd|th)-+level)/);
    const school = Object.keys(escolas).find(s => spell.text.slice(0,180).toLowerCase().includes(s.toLowerCase()));
    const cast = spell.text.match(/Casting Time: (.+?) Range:/)?.[1];
    const range = spell.text.match(/Range: (.+?) Components:/)?.[1];
    const components = spell.text.match(/Components: (.+?) Duration:/)?.[1];
    const duration = spell.text.match(/Duration: ((?:Concentration, up to |up to )?(?:Instantaneous|\d+ (?:minute|hour|day)s?|Until dispelled))/i)?.[1];
    const rangeNumber = range?.match(/^(\d+) feet$/);
    const alcance = rangeNumber ? { tipo:'distância', distancia:Number(rangeNumber[1]) * .3 } : range === 'Touch' ? { tipo:'toque', distancia:0 } : range?.startsWith('Self') ? { tipo:'pessoal', distancia:0 } : undefined;
    const dados = { ingles, pagina:spell.page, nivel:level ? Number(level[1] ?? level[2]) : 0, tipo:escolas[school], combate, resumoVerificado:summary };
    if (alcance) dados.alcance = alcance;
    if (cast && /^(1 action|Action|Bonus Action|1 bonus action|1 minute|10 minutes|1 hour)$/i.test(cast)) dados.conjuracao = ({ 'Action':'Ação', '1 action':'1 ação', 'Bonus Action':'Ação bônus', '1 bonus action':'1 ação bônus', '1 minute':'1 minuto', '10 minutes':'10 minutos', '1 hour':'1 hora' })[cast] ?? cast;
    if (components) dados.componentes = { componentes: components.split('(')[0].split(',').map(s => s.trim()).filter(s => /^[VSM]$/.test(s)), material: components.includes('(') ? components.slice(components.indexOf('(')+1,components.lastIndexOf(')')) : null };
    if (duration) { dados.duracao = duration.replace(/Concentration, up to /i,'Concentração, até ').replace(/Instantaneous/i,'Instantânea').replace(/minutes?/i,'minuto').replace(/hours?/i,'hora').replace(/days?/i,'dia').replace(/Until dispelled/i,'Até ser dissipada'); dados.concentracao = /Concentration|concentration/.test(duration); dados.ritual = /ritual|Ritual/.test(spell.text.slice(0,400)); }
    result[edicao][nome] = dados;
  }
}
fs.writeFileSync(path.join('src/api/rulesets','magiasRevisadas.json'), JSON.stringify(result,null,2)+'\n');
console.log(Object.fromEntries(Object.entries(result).map(([e,m])=>[e,Object.keys(m).length])));
