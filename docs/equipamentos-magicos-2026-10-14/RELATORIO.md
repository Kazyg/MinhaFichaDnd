# Equipamentos mágicos — revisão de 2026-10-14

Analisados os 2812 registros de ItensIngles.ts e os 2812 registros correspondentes de Itens.ts, verificando o alinhamento de todas as posições e usando a tradução real de ItensTraduzidos.ts. São 2094 nomes ingleses distintos; edições e variantes contam como registros separados.

A triagem por categorias estruturadas identificou 594 candidatos. Foram integrados 345 registros (282 nomes), incluindo 336 equipamentos completos e 9 melhorias genéricas. 92 registros permanecem sem criação automática por falta de dados seguros; 157 foram descartados por serem equipamentos comuns, munição ou outros itens.

## Modelagem e comportamento

- Metadados e edição são registrados no catálogo; a ficha persiste o snapshot, a base escolhida e o vínculo por ID de instância. Nomes traduzidos também são reconhecidos na migração de fichas antigas.
- Armas, escudos e armaduras específicos geram uma única representação. Bases alternativas exigem escolha compatível; melhorias +1/+2/+3 continuam vinculadas a equipamentos existentes.
- Equipamento e sintonização continuam independentes. Requisitos narrativos são informativos, sem confirmação nem bloqueio.
- CA, ataque e dano usam seletores existentes. A Foice Lunar concede bônus locais e de magias somente para druida/patrulheiro enquanto equipada e sintonizada.
- Propriedades aparecem em spans compactos com tooltips acessíveis por hover, teclado e toque. Reações, cargas, ativações, efeitos de vantagem e danos condicionais não criam um sistema de combate.

## Fontes

- https://www.dndbeyond.com/sources/dnd/basic-rules-2014/magic-items
- https://www.dndbeyond.com/sources/dnd/br-2024/magic-items-a-z
- https://www.dndbeyond.com/magic-items/5389-holy-avenger
- https://www.dndbeyond.com/magic-items/5384-defender
- https://www.dndbeyond.com/posts/1244-ranger-201-the-best-magic-items-for-rangers
- Dados específicos e descrições já presentes no catálogo inglês do projeto. Descrições integrais não são duplicadas neste relatório nem no registro estruturado.

## Limitações

- Há descrições com marcadores não resolvidos (XPHB, XDMG e referências de livros) e variantes vazias. Campos não verificáveis não recebem valores presumidos.
- Animação do escudo e transferência de bônus da Defensora são temporárias e informativas; o estado permanente não libera mãos nem acrescenta CA automaticamente.
- Cargas, runas adicionais, efeitos condicionais e transformações em combate permanecem sob controle do jogador e mestre.
- Snapshots antigos com metadados próprios são preservados; quando uma edição duplicada não está identificada num snapshot sem origem, a migração reconhece a primeira variante conhecida e registra a edição nos metadados.

## Arquivos desta implementação

- src/bibliotecas/Itens.ts, ItensMagicos.ts, equipamentosMagicosCatalogo.json
- src/api/fichaPersonagem/FichaPersonagem.ts, fichaEquipamentosMagicos.ts, fichaEfeitosUtils.ts, fichaSeletores.ts, fichaStorage.ts
- src/pages/components/components_inventario/AbaItens.tsx, AbaArmas.tsx, AbaArmaduras.tsx, VinculacaoMagica.tsx, PropriedadesMagicas.tsx
- src/pages/css/ArmaInventario.css
- src/api/fichaPersonagem/fichaEquipamentosMagicos.test.tsx, catalogoEquipamentosMagicos.test.tsx
- scripts/auditar-equipamentos-magicos.cjs e documentos desta pasta

## Validação executada

- Suíte completa: **25 suítes, 1.161 testes aprovados** (`CI=true npm test -- --watchAll=false --runInBand --silent`).
- Testes do catálogo: cobertura de todos os 345 registros integrados, versões, seleção de bases, cópias independentes, JSON, exclusão, sintonização e controles de interface.
- Cenários específicos: Foice Lunar +1/+2/+3, druida com proficiência em foice, bônus de magia por classe sem acumulação entre classes, escudos sem CA condicional permanente, dano e propriedades de Lâmina Solar, armadura sem limite de Destreza, cajados e objetos que funcionam como maça, dados próprios de armas especiais.
- `npm run typecheck`, `npm run lint` e `git diff --check`: aprovados.
- `npm run build` e `npm run build:verify`: concluídos com sucesso. O build conserva o aviso de tamanho do bundle do projeto.
- Hover, foco, teclado, toque/click e leitura de tooltip rolável foram verificados por testes DOM. Não houve inspeção visual real em navegador.
- Reconhecimento de proficiência normaliza sinônimos existentes no projeto (por exemplo, “foice”/“Foice Curta” e “cajado”/“Bordão”) para preservar as proficiências aplicáveis.

## Registros integrados

| Item | Nome original | Edição | Tipo | Base / escolha |
| --- | --- | --- | --- | --- |
| +1 Armadura | +1 Armor | 2014 | armadura (melhoria) | Vincular a instância existente |
| +1 Foice Lunar | +1 Moon Sickle | 2014 | arma (especifico) | Foice Curta |
| +1 Escudo (*) | +1 Shield (*) | 2014 | escudo (melhoria) | Vincular a instância existente |
| +1 Arma | +1 Weapon | 2014 | arma (melhoria) | Vincular a instância existente |
| +2 Armadura | +2 Armor | 2014 | armadura (melhoria) | Vincular a instância existente |
| +2 Foice Lunar | +2 Moon Sickle | 2014 | arma (especifico) | Foice Curta |
| +2 Escudo (*) | +2 Shield (*) | 2014 | escudo (melhoria) | Vincular a instância existente |
| +2 Arma | +2 Weapon | 2014 | arma (melhoria) | Vincular a instância existente |
| +3 Armadura | +3 Armor | 2014 | armadura (melhoria) | Vincular a instância existente |
| +3 Foice Lunar | +3 Moon Sickle | 2014 | arma (especifico) | Foice Curta |
| +3 Escudo (*) | +3 Shield (*) | 2014 | escudo (melhoria) | Vincular a instância existente |
| +3 Arma | +3 Weapon | 2014 | arma (melhoria) | Vincular a instância existente |
| Adamantina Armadura | Adamantine Armor | 2014 | armadura (especifico) | Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Adze De Annam | Adze of Annam | 2014 | arma (especifico) | Machado Grande |
| Akmon, Martelo De Purphoros | Akmon, Hammer of Purphoros | 2014 | arma (especifico) | Martelo de Guerra |
| Escudo Animado | Animated Shield | 2014 | escudo (especifico) | Escudo |
| Escudo Animado | Animated Shield | 2024 | escudo (especifico) | Escudo |
| Armadura De Acid Resistência | Armor of Acid Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Cold Resistência | Armor of Cold Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Fogo Resistência | Armor of Fire Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Força Resistência | Armor of Force Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Gleaming | Armor of Gleaming | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Invulnerability | Armor of Invulnerability | 2014 | armadura (especifico) | Placas |
| Armadura De Invulnerability | Armor of Invulnerability | 2024 | armadura (especifico) | Placas |
| Armadura De Relâmpago Resistência | Armor of Lightning Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Necrotic Resistência | Armor of Necrotic Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Poison Resistência | Armor of Poison Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Psychic Resistência | Armor of Psychic Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Radiant Resistência | Armor of Radiant Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Thunder Resistência | Armor of Thunder Resistance | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Vulnerability (Bludgeoning) | Armor of Vulnerability (Bludgeoning) | 2014 | armadura (especifico) | Placas |
| Armadura De Vulnerability (Bludgeoning) | Armor of Vulnerability (Bludgeoning) | 2024 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Vulnerability (Piercing) | Armor of Vulnerability (Piercing) | 2014 | armadura (especifico) | Placas |
| Armadura De Vulnerability (Piercing) | Armor of Vulnerability (Piercing) | 2024 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Armadura De Vulnerability (Slashing) | Armor of Vulnerability (Slashing) | 2014 | armadura (especifico) | Placas |
| Armadura De Vulnerability (Slashing) | Armor of Vulnerability (Slashing) | 2024 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Escudo Atrai-Flechas | Arrow-Catching Shield | 2014 | escudo (especifico) | Escudo |
| Escudo Atrai-Flechas | Arrow-Catching Shield | 2024 | escudo (especifico) | Escudo |
| Machado De O Dwarvish Lords | Axe of the Dwarvish Lords | 2014 | arma (especifico) | Machado de Batalha |
| Machado De O Dwarvish Lords | Axe of the Dwarvish Lords | 2024 | arma (especifico) | Machado de Batalha |
| Azuredge | Azuredge | 2014 | arma (especifico) | Machado de Batalha |
| Baba Yaga's Pestle | Baba Yaga's Pestle | 2014 | arma (especifico) | Bordão |
| Baleful Talon | Baleful Talon | 2014 | arma (especifico) | Adaga |
| Battering Escudo | Battering Shield | 2014 | escudo (especifico) | Escudo |
| Berserker Machado | Berserker Axe | 2014 | arma (especifico) | Machadinha, Machado de Batalha, Machado Grande |
| Negro Dragão Scale Mail | Black Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Negro Dragão Scale Mail | Black Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Negrorazor | Blackrazor | 2014 | arma (especifico) | Espada Grande |
| Negrorazor | Blackrazor | 2024 | arma (especifico) | Espada Grande |
| Negrostaff | Blackstaff | 2014 | arma (especifico) | Bordão |
| Lâmina De Broken Mirrors (Dormant) | Blade of Broken Mirrors (Dormant) | 2014 | arma (especifico) | Adaga |
| Sangue Spear | Blood Spear | 2014 | arma (especifico) | Lança |
| Sangueaxe | Bloodaxe | 2014 | arma (especifico) | Machado Grande |
| Sanguerage Greataxe | Bloodrage Greataxe | 2014 | arma (especifico) | Machado Grande |
| Azul Dragão Scale Mail | Blue Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Azul Dragão Scale Mail | Blue Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Bob | Bob | 2014 | arma (especifico) | Machado de Batalha |
| Bonecounter | Bonecounter | 2014 | arma (especifico) | Maça |
| Livromark | Bookmark | 2014 | arma (especifico) | Adaga |
| Boomerang Escudo | Boomerang Shield | 2014 | escudo (especifico) | Escudo |
| Brass Dragão Scale Mail | Brass Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Brass Dragão Scale Mail | Brass Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Peitoral De Balance | Breastplate of Balance | 2014 | armadura (especifico) | Peitoral |
| Bronze Dragão Scale Mail | Bronze Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Bronze Dragão Scale Mail | Bronze Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Vela Maça | Candle Mace | 2014 | arma (especifico) | Maça |
| Cast-Off Armadura | Cast-Off Armor | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Copper Dragão Scale Mail | Copper Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Copper Dragão Scale Mail | Copper Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Crusader's Shortsword | Crusader's Shortsword | 2014 | arma (especifico) | Espada Curta |
| Adaga De Blindsight | Dagger of Blindsight | 2014 | arma (especifico) | Adaga |
| Adaga De Guitar Solos | Dagger of Guitar Solos | 2014 | arma (especifico) | Adaga |
| Adaga De Venom | Dagger of Venom | 2014 | arma (especifico) | Adaga |
| Adaga De Venom | Dagger of Venom | 2024 | arma (especifico) | Adaga |
| Dancing Espada | Dancing Sword | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Dawnbringer | Dawnbringer | 2014 | arma (especifico) | Espada Longa |
| Defender | Defender | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Dekella, Bident De Thassa | Dekella, Bident of Thassa | 2014 | arma (especifico) | Tridente |
| Demon Armadura | Demon Armor | 2014 | armadura (especifico) | Placas |
| Demon Armadura | Demon Armor | 2024 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Devotee's Censer | Devotee's Censer | 2014 | arma (especifico) | Mangual |
| Draconic Longsword | Draconic Longsword | 2014 | arma (especifico) | Espada Longa |
| Dragão Sensing Longsword | Dragon Sensing Longsword | 2014 | arma (especifico) | Espada Longa |
| Dragão Slayer | Dragon Slayer | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Dragão Thighbone Clava | Dragon Thighbone Club | 2014 | arma (especifico) | Clava Grande |
| Dragãogleam | Dragongleam | 2014 | arma (especifico) | Lança |
| Dragãoguard | Dragonguard | 2014 | armadura (especifico) | Peitoral |
| Dragãoguard | Dragonguard | 2014 | armadura (especifico) | Peitoral |
| Dragãostaff De Ahghairon | Dragonstaff of Ahghairon | 2014 | arma (especifico) | Bordão |
| Dragãotooth Adaga | Dragontooth Dagger | 2014 | arma (especifico) | Adaga |
| Drown | Drown | 2014 | arma (especifico) | Tridente |
| Duskcrusher | Duskcrusher | 2014 | arma (especifico) | Martelo de Guerra |
| Anão Placas | Dwarven Plate | 2014 | armadura (especifico) | Placas |
| Anão Placas | Dwarven Plate | 2024 | armadura (especifico) | Meia-Armadura, Placas |
| Anão Thrower | Dwarven Thrower | 2014 | arma (especifico) | Martelo de Guerra |
| Anão Thrower | Dwarven Thrower | 2024 | arma (especifico) | Martelo de Guerra |
| Dyrrn's Tendaacle Whip | Dyrrn's Tentacle Whip | 2014 | arma (especifico) | Chicote |
| Efreeti Corrente | Efreeti Chain | 2014 | armadura (especifico) | Cota de Malha |
| Efreeti Corrente | Efreeti Chain | 2024 | armadura (especifico) | Camisão de Malha, Cota de Malha |
| Eldritch Cajado | Eldritch Staff | 2014 | arma (especifico) | Bordão |
| Élfico Corrente | Elven Chain | 2014 | armadura (especifico) | Camisão de Malha |
| Élfico Corrente | Elven Chain | 2024 | armadura (especifico) | Camisão de Malha, Cota de Malha |
| Élfico Thrower | Elven Thrower | 2014 | arma (especifico) | Martelo Leve |
| Energy Bow | Energy Bow | 2024 | arma (especifico) | Arco Curto, Arco Longo |
| Enspelled Cajado (Cantrip) | Enspelled Staff (Cantrip) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 1) | Enspelled Staff (Level 1) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 2) | Enspelled Staff (Level 2) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 3) | Enspelled Staff (Level 3) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 4) | Enspelled Staff (Level 4) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 5) | Enspelled Staff (Level 5) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 6) | Enspelled Staff (Level 6) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 7) | Enspelled Staff (Level 7) | 2024 | arma (especifico) | Bordão |
| Enspelled Cajado (Level 8) | Enspelled Staff (Level 8) | 2024 | arma (especifico) | Bordão |
| Ephixis, Bow De Nylea | Ephixis, Bow of Nylea | 2014 | arma (especifico) | Arco Curto |
| Euryale's Aegis | Euryale's Aegis | 2014 | escudo (especifico) | Escudo |
| Fane-Eater | Fane-Eater | 2014 | arma (especifico) | Machado de Batalha |
| Fate Cutter Shears | Fate Cutter Shears | 2014 | arma (especifico) | Adaga |
| Flail De Tiamat | Flail of Tiamat | 2014 | arma (especifico) | Mangual |
| Flame Tongue | Flame Tongue | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Flame Tongue Shortsword De Greed | Flame Tongue Shortsword of Greed | 2014 | arma (especifico) | Espada Curta |
| Flayer Slayer | Flayer Slayer | 2014 | arma (especifico) | Machado Grande |
| Frost Brand | Frost Brand | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Gigante Slayer | Giant Slayer | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira, Machadinha, Machado de Batalha, Machado Grande |
| Glamoured Studded Leather | Glamoured Studded Leather | 2014 | armadura (especifico) | Couro Batido |
| Glamoured Studded Leather | Glamoured Studded Leather | 2024 | armadura (especifico) | Couro Batido |
| Ouro Dragão Scale Mail | Gold Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Ouro Dragão Scale Mail | Gold Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Grasping Whip | Grasping Whip | 2014 | arma (especifico) | Chicote |
| Greater Prata Espada | Greater Silver Sword | 2014 | arma (especifico) | Espada Grande |
| Verde Dragão Scale Mail | Green Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Verde Dragão Scale Mail | Green Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Grovelthrash (Dormant) | Grovelthrash (Dormant) | 2014 | arma (especifico) | Martelo de Guerra |
| Gulthias Cajado | Gulthias Staff | 2014 | arma (especifico) | Bordão |
| Gurt's Greataxe | Gurt's Greataxe | 2014 | arma (especifico) | Machado Grande |
| Martelo De Thunderbolts | Hammer of Thunderbolts | 2014 | arma (especifico) | Malho |
| Martelo De Thunderbolts | Hammer of Thunderbolts | 2024 | arma (especifico) | Malho |
| Hazirawn | Hazirawn | 2014 | arma (especifico) | Espada Grande |
| Heretic | Heretic | 2014 | arma (especifico) | Espada Longa |
| Hew | Hew | 2014 | arma (especifico) | Machado de Batalha |
| Hew | Hew | 2014 | arma (especifico) | Machado de Batalha |
| Heward's Hireling Armadura | Heward's Hireling Armor | 2014 | armadura (especifico) | Couro Batido |
| Hide De O Feral Guardian (Dormant) | Hide of the Feral Guardian (Dormant) | 2014 | armadura (especifico) | Couro Batido |
| Hither-Thither Cajado | Hither-Thither Staff | 2014 | arma (especifico) | Bordão |
| Sagrado Avenger | Holy Avenger | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Hunter's Coat | Hunter's Coat | 2014 | armadura (especifico) | Couro Batido |
| Infernal Placas Armadura | Infernal Plate Armor | 2014 | armadura (especifico) | Placas |
| Ferrofang | Ironfang | 2014 | arma (especifico) | Picareta de Guerra |
| Javelin De Backbiting | Javelin of Backbiting | 2014 | arma (especifico) | Azagaia |
| Javelin De Relâmpago | Javelin of Lightning | 2014 | arma (especifico) | Azagaia |
| Javelin De Relâmpago | Javelin of Lightning | 2024 | arma (especifico) | Azagaia |
| Junky +1 Adaga | Junky +1 Dagger | 2014 | arma (especifico) | Adaga |
| Khrusor, Spear De Heliod | Khrusor, Spear of Heliod | 2014 | arma (especifico) | Lança |
| Knife De Stolen Resistência | Knife of Stolen Resistance | 2014 | arma (especifico) | Adaga |
| Korolnor Scepter | Korolnor Scepter | 2014 | arma (especifico) | Porrete |
| Lash De Immolation | Lash of Immolation | 2014 | arma (especifico) | Chicote |
| Lash De Sombras (Dormant) | Lash of Shadows (Dormant) | 2014 | arma (especifico) | Chicote |
| Leather Golem Armadura | Leather Golem Armor | 2014 | armadura (especifico) | Couro |
| Lightbringer | Lightbringer | 2014 | arma (especifico) | Maça |
| Lightbringer | Lightbringer | 2014 | arma (especifico) | Maça |
| Longbow De O Healing Hearth | Longbow of the Healing Hearth | 2014 | arma (especifico) | Arco Longo |
| Sorte Lâmina | Luck Blade | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Luminous Guerra Pick | Luminous War Pick | 2014 | arma (especifico) | Picareta de Guerra |
| Lute De Thunderous Thumping | Lute of Thunderous Thumping | 2024 | arma (especifico) | Porrete |
| Maça De Disruption | Mace of Disruption | 2014 | arma (especifico) | Maça |
| Maça De Disruption | Mace of Disruption | 2024 | arma (especifico) | Maça |
| Maça De Smiting | Mace of Smiting | 2014 | arma (especifico) | Maça |
| Maça De Smiting | Mace of Smiting | 2024 | arma (especifico) | Maça |
| Maça De Terror | Mace of Terror | 2014 | arma (especifico) | Maça |
| Maça De Terror | Mace of Terror | 2024 | arma (especifico) | Maça |
| Maça De O Negro Crown (Dormant) | Mace of the Black Crown (Dormant) | 2014 | arma (especifico) | Maça |
| Macuahuitl | Macuahuitl | 2014 | arma (especifico) | Espada Longa |
| Mariner's Armadura | Mariner's Armor | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Mastix, Whip De Erebos | Mastix, Whip of Erebos | 2014 | arma (especifico) | Chicote |
| Matalotok | Matalotok | 2014 | arma (especifico) | Martelo de Guerra |
| Mente Lash | Mind Lash | 2014 | arma (especifico) | Chicote |
| Mithral Armadura | Mithral Armor | 2014 | armadura (especifico) | Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Luablade | Moonblade | 2014 | arma (especifico) | Espada Longa |
| Lua-Touched Espada | Moon-Touched Sword | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Needle De Mending | Needle of Mending | 2014 | arma (especifico) | Adaga |
| Noitebringer | Nightbringer | 2014 | arma (especifico) | Maça |
| Niko's Maça | Niko's Mace | 2014 | arma (especifico) | Maça |
| Nine Lives Stealer | Nine Lives Stealer | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Oathbow | Oathbow | 2014 | arma (especifico) | Arco Longo |
| Oathbow | Oathbow | 2024 | arma (especifico) | Arco Longo |
| Obsidian Flint Dragão Placas | Obsidian Flint Dragon Plate | 2014 | armadura (especifico) | Placas |
| Orcsplitter | Orcsplitter | 2014 | arma (especifico) | Machado Grande |
| Oversized Longbow | Oversized Longbow | 2014 | arma (especifico) | Arco Longo |
| Pariah's Escudo | Pariah's Shield | 2014 | escudo (especifico) | Escudo |
| Pathfinder's Greataxe | Pathfinder's Greataxe | 2014 | arma (especifico) | Machado Grande |
| Piercer | Piercer | 2014 | arma (especifico) | Rapieira |
| Placas Armadura De Etherealness | Plate Armor of Etherealness | 2014 | armadura (especifico) | Placas |
| Placas Armadura De Etherealness (*) | Plate Armor of Etherealness (*) | 2024 | armadura (especifico) | Meia-Armadura, Placas |
| Placas De Knight's Fellowship | Plate of Knight's Fellowship | 2014 | armadura (especifico) | Placas |
| Poison Soaked Kukri | Poison Soaked Kukri | 2024 | arma (especifico) | Adaga |
| Podered Armadura | Powered Armor | 2014 | armadura (especifico) | Placas |
| Quarterstaff De O Acrobat | Quarterstaff of the Acrobat | 2024 | arma (especifico) | Bordão |
| Rakdos Riteknife | Rakdos Riteknife | 2014 | arma (especifico) | Adaga |
| Ranseur De Torture | Ranseur of Torture | 2014 | arma (especifico) | Lança Longa |
| Reaper's Scream | Reaper's Scream | 2014 | arma (especifico) | Maça Estrela |
| Vermelho Dragão Scale Mail | Red Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Vermelho Dragão Scale Mail | Red Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Vermelho Wizard Lâmina | Red Wizard Blade | 2014 | arma (especifico) | Adaga |
| Repulsion Escudo | Repulsion Shield | 2024 | escudo (especifico) | Escudo |
| Reszur | Reszur | 2014 | arma (especifico) | Adaga |
| Vara De Lordly Might | Rod of Lordly Might | 2014 | arma (especifico) | Maça |
| Vara De Lordly Might | Rod of Lordly Might | 2024 | arma (especifico) | Maça |
| Ruidium Escudo | Ruidium Shield | 2014 | escudo (especifico) | Escudo |
| Ruinblade | Ruinblade | 2014 | arma (especifico) | Espada Grande |
| Ruinous Flail | Ruinous Flail | 2014 | arma (especifico) | Mangual |
| Ruin's Wake (Dormant) | Ruin's Wake (Dormant) | 2014 | arma (especifico) | Lança |
| Saint Markovia's Thighbone | Saint Markovia's Thighbone | 2014 | arma (especifico) | Maça |
| Sapphire Buckler | Sapphire Buckler | 2014 | escudo (especifico) | Escudo |
| Scimitar De Velocidade | Scimitar of Speed | 2014 | arma (especifico) | Cimitarra |
| Scimitar De Velocidade | Scimitar of Speed | 2024 | arma (especifico) | Cimitarra |
| Scorpion Armadura | Scorpion Armor | 2014 | armadura (especifico) | Placas |
| Scourge De Sombra | Scourge of Shadow | 2014 | arma (especifico) | Chicote |
| Seeker Dart | Seeker Dart | 2014 | arma (especifico) | Dardo |
| Sentinel Escudo | Sentinel Shield | 2014 | escudo (especifico) | Escudo |
| Sentinel Escudo | Sentinel Shield | 2024 | escudo (especifico) | Escudo |
| Serpent Scale Armadura | Serpent Scale Armor | 2014 | armadura (especifico) | Brunea |
| Shatterspike | Shatterspike | 2014 | arma (especifico) | Espada Longa |
| Escudo De Expression | Shield of Expression | 2024 | escudo (especifico) | Escudo |
| Escudo De Expression | Shield of Expression | 2014 | escudo (especifico) | Escudo |
| Escudo De Far Sight | Shield of Far Sight | 2014 | escudo (especifico) | Escudo |
| Escudo da Atração de Mísseis | Shield of Missile Attraction | 2014 | escudo (especifico) | Escudo |
| Escudo da Atração de Mísseis | Shield of Missile Attraction | 2024 | escudo (especifico) | Escudo |
| Escudo De Shouting | Shield of Shouting | 2014 | escudo (especifico) | Escudo |
| Escudo De O Blazing Dreadnought | Shield of the Blazing Dreadnought | 2014 | escudo (especifico) | Escudo |
| Escudo De O Cavalier | Shield of the Cavalier | 2024 | escudo (especifico) | Escudo |
| Escudo De O Hidden Lord | Shield of the Hidden Lord | 2014 | escudo (especifico) | Escudo |
| Escudo De O Prata Dragão | Shield of the Silver Dragon | 2014 | escudo (especifico) | Escudo |
| Escudo De O Tortoise | Shield of the Tortoise | 2014 | escudo (especifico) | Escudo |
| Escudo De O Uven Rune | Shield of the Uven Rune | 2014 | escudo (especifico) | Escudo |
| Silken Spite (Dormant) | Silken Spite (Dormant) | 2014 | arma (especifico) | Rapieira |
| Prata Dragão Scale Mail | Silver Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Prata Dragão Scale Mail | Silver Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Prata Espada | Silver Sword | 2014 | arma (especifico) | Espada Grande |
| Skyblinder Cajado | Skyblinder Staff | 2014 | arma (especifico) | Bordão |
| Sling De Gigante Felling | Sling of Giant Felling | 2014 | arma (especifico) | Funda |
| Smoldering Armadura | Smoldering Armor | 2014 | armadura (especifico) | Acolchoada, Couro, Couro Batido, Gibão de Peles, Camisão de Malha, Brunea, Peitoral, Meia-Armadura, Cota de Anéis, Cota de Malha, Cota de Talas, Placas |
| Snicker-Snack | Snicker-Snack | 2014 | arma (especifico) | Espada Grande |
| Spear De Backbiting | Spear of Backbiting | 2014 | arma (especifico) | Lança |
| Magiaguard Escudo | Spellguard Shield | 2014 | escudo (especifico) | Escudo |
| Magiaguard Escudo | Spellguard Shield | 2024 | escudo (especifico) | Escudo |
| Aranha Cajado | Spider Staff | 2014 | arma (especifico) | Bordão |
| Aranha Cajado | Spider Staff | 2014 | arma (especifico) | Bordão |
| Spiked Escudo | Spiked Shield | 2024 | escudo (especifico) | Escudo |
| Cajado De Adornment | Staff of Adornment | 2024 | arma (especifico) | Bordão |
| Cajado De Adornment | Staff of Adornment | 2014 | arma (especifico) | Bordão |
| Cajado De Birdcalls | Staff of Birdcalls | 2024 | arma (especifico) | Bordão |
| Cajado De Birdcalls | Staff of Birdcalls | 2014 | arma (especifico) | Bordão |
| Cajado De Encantoing | Staff of Charming | 2014 | arma (especifico) | Bordão |
| Cajado De Encantoing | Staff of Charming | 2024 | arma (especifico) | Bordão |
| Cajado De Defesa | Staff of Defense | 2014 | arma (especifico) | Bordão |
| Cajado De Defesa | Staff of Defense | 2014 | arma (especifico) | Bordão |
| Cajado De Dunamancy | Staff of Dunamancy | 2014 | arma (especifico) | Bordão |
| Cajado De Fate | Staff of Fate | 2014 | arma (especifico) | Bordão |
| Cajado De Fogo | Staff of Fire | 2014 | arma (especifico) | Bordão |
| Cajado De Fogo | Staff of Fire | 2024 | arma (especifico) | Bordão |
| Cajado De Flowers | Staff of Flowers | 2024 | arma (especifico) | Bordão |
| Cajado De Flowers | Staff of Flowers | 2014 | arma (especifico) | Bordão |
| Cajado De Frost | Staff of Frost | 2014 | arma (especifico) | Bordão |
| Cajado De Frost | Staff of Frost | 2024 | arma (especifico) | Bordão |
| Cajado De Healing | Staff of Healing | 2014 | arma (especifico) | Bordão |
| Cajado De Healing | Staff of Healing | 2024 | arma (especifico) | Bordão |
| Cajado do Poder | Staff of Power | 2014 | arma (especifico) | Bordão |
| Cajado do Poder | Staff of Power | 2024 | arma (especifico) | Bordão |
| Cajado De Ruling | Staff of Ruling | 2014 | arma (especifico) | Bordão |
| Cajado do Golpe | Staff of Striking | 2014 | arma (especifico) | Bordão |
| Cajado do Golpe | Staff of Striking | 2024 | arma (especifico) | Bordão |
| Cajado De Swarming Insects | Staff of Swarming Insects | 2014 | arma (especifico) | Bordão |
| Cajado De Swarming Insects | Staff of Swarming Insects | 2024 | arma (especifico) | Bordão |
| Cajado De O Adder | Staff of the Adder | 2014 | arma (especifico) | Bordão |
| Cajado De O Adder | Staff of the Adder | 2024 | arma (especifico) | Bordão |
| Cajado De O Forgotten One | Staff of the Forgotten One | 2014 | arma (especifico) | Bordão |
| Cajado De O Marfim Claw | Staff of the Ivory Claw | 2014 | arma (especifico) | Bordão |
| Cajado do Mago | Staff of the Magi | 2014 | arma (especifico) | Bordão |
| Cajado do Mago | Staff of the Magi | 2024 | arma (especifico) | Bordão |
| Cajado De O Python | Staff of the Python | 2014 | arma (especifico) | Bordão |
| Cajado De O Python | Staff of the Python | 2024 | arma (especifico) | Bordão |
| Cajado De O Rooted Hills | Staff of the Rooted Hills | 2014 | arma (especifico) | Bordão |
| Cajado De O Woodlands | Staff of the Woodlands | 2014 | arma (especifico) | Bordão |
| Cajado De O Woodlands | Staff of the Woodlands | 2024 | arma (especifico) | Bordão |
| Cajado De Thunder E Relâmpago | Staff of Thunder and Lightning | 2014 | arma (especifico) | Bordão |
| Cajado De Thunder E Relâmpago | Staff of Thunder and Lightning | 2024 | arma (especifico) | Bordão |
| Cajado De Withering | Staff of Withering | 2014 | arma (especifico) | Bordão |
| Cajado De Withering | Staff of Withering | 2024 | arma (especifico) | Bordão |
| Aço | Steel | 2014 | arma (especifico) | Espada Longa |
| Pedrabreaker's Peitoral | Stonebreaker's Breastplate | 2014 | armadura (especifico) | Peitoral |
| Pedramaker Guerra Pick | Stonemaker War Pick | 2014 | arma (especifico) | Picareta de Guerra |
| Lâmina Solar | Sun Blade | 2014 | arma (especifico) | Espada Longa |
| Lâmina Solar | Sun Blade | 2024 | arma (especifico) | Espada Longa |
| Sun Cajado | Sun Staff | 2014 | arma (especifico) | Bordão |
| Sunforger | Sunforger | 2014 | arma (especifico) | Martelo de Guerra |
| Sunsword | Sunsword | 2014 | arma (especifico) | Espada Longa |
| Survival Mantle | Survival Mantle | 2014 | armadura (especifico) | Meia-Armadura |
| Espada De Answering | Sword of Answering | 2024 | arma (especifico) | Espada Longa |
| Espada De Answering (Answerer) | Sword of Answering (Answerer) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Back Talker) | Sword of Answering (Back Talker) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Concluder) | Sword of Answering (Concluder) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Last Quip) | Sword of Answering (Last Quip) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Rebutter) | Sword of Answering (Rebutter) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Replier) | Sword of Answering (Replier) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Retorter) | Sword of Answering (Retorter) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Scather) | Sword of Answering (Scather) | 2014 | arma (especifico) | Espada Longa |
| Espada De Answering (Squelcher) | Sword of Answering (Squelcher) | 2014 | arma (especifico) | Espada Longa |
| Espada De Kas | Sword of Kas | 2014 | arma (especifico) | Espada Longa |
| Espada De Kas | Sword of Kas | 2024 | arma (especifico) | Espada Longa |
| Espada De Vida Stealing | Sword of Life Stealing | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Espada De Sharpness | Sword of Sharpness | 2014 | arma (especifico) | Espada Grande, Espada Longa, Cimitarra |
| Espada De O Paruns | Sword of the Paruns | 2014 | arma (especifico) | Espada Longa |
| Espada De Vengeance | Sword of Vengeance | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Espada De Feridaing | Sword of Wounding | 2014 | arma (especifico) | Espada Longa, Espada Curta, Espada Grande, Cimitarra, Rapieira |
| Espada De Zariel | Sword of Zariel | 2014 | arma (especifico) | Espada Longa |
| Tearulai | Tearulai | 2014 | arma (especifico) | Espada Longa |
| The Sanguey End (Dormant) | The Bloody End (Dormant) | 2014 | arma (especifico) | Maça Estrela |
| Thunderous Greatclub | Thunderous Greatclub | 2024 | arma (especifico) | Clava Grande |
| Tidecaller Trident | Tidecaller Trident | 2014 | arma (especifico) | Tridente |
| Tinderstrike | Tinderstrike | 2014 | arma (especifico) | Adaga |
| Trident De Fish Command | Trident of Fish Command | 2014 | arma (especifico) | Tridente |
| Trident De Fish Command | Trident of Fish Command | 2024 | arma (especifico) | Tridente |
| True-Ice Shards (Adaga) | True-Ice Shards (Dagger) | 2014 | arma (especifico) | Adaga |
| True-Ice Shards (Rapier) | True-Ice Shards (Rapier) | 2014 | arma (especifico) | Rapieira |
| Two-Birds Sling | Two-Birds Sling | 2014 | arma (especifico) | Funda |
| Vanrak's Mithral Shirt | Vanrak's Mithral Shirt | 2014 | armadura (especifico) | Camisão de Malha |
| Vicious +1 Weapon | Vicious +1 Weapon | 2014 | arma (especifico) | Adaga, Foice Curta, Espada Longa, Espada Curta, Espada Grande, Rapieira, Cimitarra, Machado de Batalha, Machado Grande, Machadinha, Martelo de Guerra, Martelo Leve, Malho, Maça, Maça Estrela, Mangual, Chicote, Glaive, Alabarda, Lança Longa, Lança de Montaria, Lança, Azagaia, Tridente, Bordão, Clava Grande, Porrete, Arco Longo, Arco Curto, Besta Leve, Besta Pesada, Besta de Mão, Funda, Dardo, Picareta de Guerra |
| Vicious Weapon | Vicious Weapon | 2014 | arma (especifico) | Adaga, Foice Curta, Espada Longa, Espada Curta, Espada Grande, Rapieira, Cimitarra, Machado de Batalha, Machado Grande, Machadinha, Martelo de Guerra, Martelo Leve, Malho, Maça, Maça Estrela, Mangual, Chicote, Glaive, Alabarda, Lança Longa, Lança de Montaria, Lança, Azagaia, Tridente, Bordão, Clava Grande, Porrete, Arco Longo, Arco Curto, Besta Leve, Besta Pesada, Besta de Mão, Funda, Dardo, Picareta de Guerra |
| Voidwalker Armadura | Voidwalker Armor | 2014 | armadura (especifico) | Couro Batido |
| Vorpal Espada | Vorpal Sword | 2014 | arma (especifico) | Espada Grande, Espada Longa, Cimitarra |
| Voyager Cajado | Voyager Staff | 2014 | arma (especifico) | Bordão |
| Wave | Wave | 2014 | arma (especifico) | Tridente |
| Wave | Wave | 2024 | arma (especifico) | Tridente |
| Waythe | Waythe | 2014 | arma (especifico) | Espada Grande |
| Weapon De Guerraning | Weapon of Warning | 2014 | arma (especifico) | Adaga, Foice Curta, Espada Longa, Espada Curta, Espada Grande, Rapieira, Cimitarra, Machado de Batalha, Machado Grande, Machadinha, Martelo de Guerra, Martelo Leve, Malho, Maça, Maça Estrela, Mangual, Chicote, Glaive, Alabarda, Lança Longa, Lança de Montaria, Lança, Azagaia, Tridente, Bordão, Clava Grande, Porrete, Arco Longo, Arco Curto, Besta Leve, Besta Pesada, Besta de Mão, Funda, Dardo, Picareta de Guerra |
| Whelm | Whelm | 2014 | arma (especifico) | Martelo de Guerra |
| Whelm | Whelm | 2024 | arma (especifico) | Martelo de Guerra |
| Branco Dragão Scale Mail | White Dragon Scale Mail | 2014 | armadura (especifico) | Brunea |
| Branco Dragão Scale Mail | White Dragon Scale Mail | 2024 | armadura (especifico) | Brunea |
| Will De O Talon (Dormant) | Will of the Talon (Dormant) | 2014 | arma (especifico) | Picareta de Guerra |
| Windvane | Windvane | 2014 | arma (especifico) | Lança |
| Winter's Dark Bite | Winter's Dark Bite | 2014 | arma (especifico) | Espada Grande |
| Witchlight Vane | Witchlight Vane | 2014 | arma (especifico) | Maça |
| Woodcutter's Machado | Woodcutter's Axe | 2014 | arma (especifico) | Machadinha |
| Wrought-Ferro Torre | Wrought-Iron Tower | 2014 | arma (especifico) | Martelo de Guerra |
| Yester Hill Machado | Yester Hill Axe | 2014 | arma (especifico) | Machado de Batalha |

## Registros pendentes de classificação segura

| Item | Categoria original | Motivo |
| --- | --- | --- |
| +1 Weapon (no damage) | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| +2 Weapon (no damage) | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| +3 Weapon (no damage) | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Acheron Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Antimagic Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Armblade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Armor of Fungal Spores | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Armor of Safeguarding | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Armor of the Fallen | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Armor of Weightlessness | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Ascendant Dragon's Wrath Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Blade of Avernus | M, martial, Attunement | A descrição não especifica a base; a consulta pública não permitiu verificá-la com segurança. |
| Blade of the Medusa | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Bloodshed Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Bow of Conflagration | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Bow of Melodies | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Canian Fork | M, martial, Cursed, Attunement | A descrição não especifica a base; a consulta pública não permitiu verificá-la com segurança. |
| Clockwork Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Corpse Slayer | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Crystal Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Dazzling Weapon | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Demon Skin | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Demonbone Polearm | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Dragon Wing Bow | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Dragonlance | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Dried Leech | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Drow +1 Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Drow +1 Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Drow +2 Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Drow +2 Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Drow +3 Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Drow +3 Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Cantrip) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 1) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 2) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 3) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 4) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 5) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 6) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 7) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Armor (Level 8) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Cantrip) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 1) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 2) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 3) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 4) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 5) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 6) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 7) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Enspelled Weapon (Level 8) | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Executioner's Axe | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Feywrought Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Fool's Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Forcebreaker Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Gambler's Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Glimmering Moonbow | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Gloomwrought Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Hammer of Runic Focus | M, martial, Attunement | A descrição não especifica a base; a consulta pública não permitiu verificá-la com segurança. |
| Hellfire Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Hooked Shortspear | M, martial | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Iron Ball | R, simple | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Last Stand Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Living Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Lucent Destroyer | R, martial, renaissance, Attunement, Ammo: renaissance bullet | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Mind Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Mind Carapace Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Mithral +1 Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Mizzium Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Molten Bronze Skin | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Moonblade | GV/XDMG | Registro 2024 sem descrição das runas; não usa automaticamente a versão 2014. |
| Nepenthe | M, martial, Attunement | A descrição não especifica a base; a consulta pública não permitiu verificá-la com segurança. |
| Polymorph Blade | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Returning Weapon | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Ruidium Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Ruidium Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Serpent's Fang | M, martial | A descrição não especifica a base; a consulta pública não permitiu verificá-la com segurança. |
| Slumbering Dragon's Wrath Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Spiked Armor | MA | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Starshot Crossbow | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Stirring Dragon's Wrath Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Storm Boomerang | R, simple | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Stygian Spear | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Sword of Retribution | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Sword of the Planes | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Sylvan Talon | GV/XDMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Thunderbuss | R, martial, renaissance, Ammo: renaissance bullet | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Topaz Annihilator | R, Attunement | Base ausente, equipamento incompleto ou tipo não disponível no modelo; sem criação automática. |
| Wakened Dragon's Wrath Weapon | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Weapon of Agonizing Paralysis | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Weapon of Certain Death | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Weapon of Throne's Command | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
| Zephyr Armor | GV/DMG | Variante sem descrição nem base verificável; precisa de dados oficiais antes da integração. |
