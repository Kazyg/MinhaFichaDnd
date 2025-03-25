import React, { useEffect, useState } from "react";
import "../css/PericiasEOutros.css";
import { useFicha } from "../../api/fichaPersonagem/FichaContext.tsx"

export default function PericiasEOutros() {
  const { ficha, refreshKey } = useFicha();
  const [pericias, setPericias] = useState<
    {
      modificador?: { id: number; nome: string; valor: number; tipo: string };
      atributo: string;
      nome: string;
      descricao: string;
      treinado?: boolean;
    }[]
  >([]);
  useEffect(() => {
    if (ficha) {
      const novasPericias = [
        {
          modificador: ficha?.atributosPersonagem?.destreza,
          atributo: "(DES)",
          nome: "Acrobacia",
          descricao: "Um teste de Destreza (Acrobacia) abrange uma tentativa de permanecer de pé em uma situação complicada, como tentar correr sobre uma camada de gelo, equilibrar-se na corda bamba ou ficar de pé no convés de um navio que balança. O Mestre também pode pedir um teste de Destreza (Acrobacia) para ver se você é capaz de realizar acrobacias, como cambalhotas e saltos mortais.",
          treinado: ficha?.pericias?.includes("Acrobacia"),
        },
        {
          modificador: ficha?.atributosPersonagem?.sabedoria,
          atributo: "(SAB)",
          nome: "Adestrar Animais",
          descricao: "Quando houver a necessidade de saber se você pode acalmar um animal domesticado, impedir uma montaria de se assustar, ou intuir as intenções de um animal, o Mestre pode pedir um teste de Sabedoria (Adestrar Animais). Você também realiza um teste de Sabedoria (Adestrar Animais) para controlar sua montaria ao tentar uma manobra arriscada.",
          treinado: ficha?.pericias?.includes("Adestrar Animais")
        },
        {
          modificador: ficha?.atributosPersonagem?.inteligencia,
          atributo: "(INT)",
          nome: "Arcanismo",
          descricao: "Um teste de Inteligência (Arcanismo) mede conhecimento sobre magias, itens mágicos, símbolos sobrenaturais, tradições mágicas, os planos de existência e os habitantes desses planos.",
          treinado: ficha?.pericias?.includes("Arcanismo"),
        },
        {
          modificador: ficha?.atributosPersonagem?.forca,
          atributo: "(FOR)",
          nome: "Atletismo",
          descricao: "Um teste de Força (Atletismo) abrange as situações difíceis que você encontra ao escalar, saltar ou nadar. Os exemplos incluem as seguintes atividades: escalar um penhasco natural ou escorregadio, evitar perigos enquanto escala uma parede, agarrar-se a uma superfície quando algo está tentando derrubá-lo, saltar uma distância excepcionalmente longa ou executar um salto em altura, e lutar para nadar ou manter-se à tona em corredeiras traiçoeiras, ondas agitadas pela tempestade ou áreas com algas espessas.",
          treinado: ficha?.pericias?.includes("Atletismo"),
        },
        {
          modificador: ficha?.atributosPersonagem?.carisma,
          atributo: "(CAR)",
          nome: "Atuação",
          descricao: "Um teste de Carisma (Atuação) determina o quão bem você pode entreter uma plateia com música, dança, atuação, contando histórias ou alguma outra forma de entretenimento. ",
          treinado: ficha?.pericias?.includes("Atuação")
        },
        {
          modificador: ficha?.atributosPersonagem?.carisma,
          atributo: "(CAR)",
          nome: "Enganação",
          descricao: "Um teste de Carisma (Enganação) determina se você pode esconder a verdade de forma convincente, verbalmente ou através de suas ações. Esse engano pode abranger tudo, como iludir os outros através de uma mentira cheia de ambiguidade. Situações típicas incluem tentar ludibriar um guarda, iludir um comerciante, ganhar dinheiro através de jogos de azar, usar um disfarce, amenizar as suspeitas de alguém com falsas garantias ou manter uma cara séria ao contar uma mentira descarada.",
          treinado: ficha?.pericias?.includes("Enganação"),
        },
        {
          modificador: ficha?.atributosPersonagem?.destreza,
          atributo: "(DES)",
          nome: "Furtividade",
          descricao: "Um teste de Destreza (Furtividade) é realizado para tentar esconder-se de inimigos, esgueirar-se por guardas, escapar sem ser notado, ou aproximar-se de alguém sem ser visto ou ouvido.",
          treinado: ficha?.pericias?.includes("Furtividade"),
        },
        {
          modificador: ficha?.atributosPersonagem?.inteligencia,
          atributo: "(INT)",
          nome: "História",
          descricao: "Um teste de Inteligência (História) mede o conhecimento sobre eventos históricos, pessoas lendárias, reinos antigos, disputas passadas, guerras recentes e civilizações perdidas.",
          treinado: ficha?.pericias?.includes("História"),
        },
        {
          modificador: ficha?.atributosPersonagem?.sabedoria,
          atributo: "(SAB)",
          nome: "Intuição",
          descricao: "Um teste de Sabedoria (Intuição) decide se você pode determinar as verdadeiras intenções de uma criatura, perceber uma mentira ou prever o próximo movimento de alguém. Fazer isso envolve recolher pistas a partir da linguagem corporal, os hábitos da fala e as mudanças nos maneirismos.",
          treinado: ficha?.pericias?.includes("Intuição"),
        },
        {
          modificador: ficha?.atributosPersonagem?.carisma,
          atributo: "(CAR)",
          nome: "Intimidação",
          descricao: "Ao tentar influenciar alguém através de ameaças abertas, ações hostis e violência física, o Mestre pode pedir a realização de um teste de Carisma (Intimidação). Exemplos incluem tentar arrancar informações de um prisioneiro, convencer bandidos de rua a recuar de um confronto ou usar uma garrafa quebrada para convencer um vizir sarcástico a reconsiderar uma decisão.",
          treinado: ficha?.pericias?.includes("Intimidação"),
        },
        {
          modificador: ficha?.atributosPersonagem?.inteligencia,
          atributo: "(INT)",
          nome: "Investigação",
          descricao: "Quando você olha ao redor em busca de pistas e faz deduções com base nesses indícios, você realiza um teste de Inteligência (Investigação). Você pode deduzir a localização de um objeto escondido, discernir, a partir da aparência de um ferimento, que tipo de arma o causou, ou determinar o ponto mais fraco em um túnel que poderia causar o seu colapso. Debruçar-se sobre pergaminhos antigos em busca de um fragmento escondido de conhecimento também pode necessitar um teste de Inteligência (Investigação).",
          treinado: ficha?.pericias?.includes("Investigação"),
        },
        {
          modificador: ficha?.atributosPersonagem?.sabedoria,
          atributo: "(SAB)",
          nome: "Medicina",
          descricao: "Um teste de Sabedoria (Medicina) permite tentar estabilizar um companheiro que está morrendo ou diagnosticar uma doença.",
          treinado: ficha?.pericias?.includes("Medicina"),
        },
        {
          modificador: ficha?.atributosPersonagem?.inteligencia,
          atributo: "(INT)",
          nome: "Natureza",
          descricao: "Um teste de Inteligência (Natureza) mede o conhecimento sobre terreno, plantas e animais, clima e ciclos naturais.",
          treinado: ficha?.pericias?.includes("Natureza"),
        },
        {
          modificador: ficha?.atributosPersonagem?.sabedoria,
          atributo: "(SAB)",
          nome: "Percepção",
          descricao: "Um teste de Sabedoria (Percepção) permite observar, ouvir ou detectar a presença de alguma coisa de outra forma. A percepção mede a consciência geral do que está acontecendo ao seu redor e a acuidade de seus sentidos. Por exemplo, você pode tentar ouvir uma conversa através de uma porta fechada, bisbilhotar sob uma janela aberta ou ouvir monstros movendo-se furtivamente na floresta. Ou você pode tentar detectar coisas que são obscurecidas ou que normalmente passariam despercebidas, desde uma emboscada de orcs em uma estrada, bandidos escondidos nas sombras de um beco ou uma porta secreta fechada somente com a luz de velas.",
          treinado: ficha?.pericias?.includes("Percepção"),
        },
        {
          modificador: ficha?.atributosPersonagem?.carisma,
          atributo: "(CAR)",
          nome: "Persuasão",
          descricao: "Quando você tenta influenciar alguém ou um grupo de pessoas com tato, delicadeza ou boa índole, o Mestre pode pedir para você fazer de um teste de Carisma (Persuasão). Normalmente, você usa a Persuasão quando está agindo de boa-fé, para promover amizades, fazer pedidos cordiais ou exibir a etiqueta apropriada. Exemplos de persuadir os outros incluem convencer um mordomo a deixar seu grupo ver o rei, negociar a paz entre duas tribos em conflito ou inspirar uma multidão de pessoas da cidade.",
          treinado: ficha?.pericias?.includes("Persuasão"),
        },
        {
          modificador: ficha?.atributosPersonagem?.destreza,
          atributo: "(DES)",
          nome: "Prestidigitação",
          descricao: "Sempre que você tentar realizar um ato de prestidigitação ou de trapaça manual, como plantar alguma coisa em outra pessoa ou esconder um objeto em sua roupa, você deve fazer um teste de Destreza (Prestidigitação). O Mestre também pode pedir um teste de Destreza (Prestidigitação) para determinar se você pode roubar uma bolsa de moedas de outra pessoa ou pegar algo do bolso de outra pessoa.",
          treinado: ficha?.pericias?.includes("Prestidigitação"),
        },
        {
          modificador: ficha?.atributosPersonagem?.inteligencia,
          atributo: "(INT)",
          nome: "Religião",
          descricao: "Um teste de Inteligência (Religião) mede o conhecimento de lendas sobre divindades, rituais e orações, hierarquias religiosas, símbolos sagrados e práticas de cultos secretos.",
          treinado: ficha?.pericias?.includes("Religião"),
        },
        {
          modificador: ficha?.atributosPersonagem?.sabedoria,
          atributo: "(SAB)",
          nome: "Sobrevivência",
          descricao: "Um teste de Sabedoria (Sobrevivência) é feito para seguir rastros, caçar, orientar o grupo através de terras congeladas, identificar sinais de que ursos-coruja vivem nas proximidades, prever o tempo, ou evitar areia movediça e outros perigos naturais.",
          treinado: ficha?.pericias?.includes("Sobrevivência"),
        },
      ];
      setPericias(novasPericias);
    }
  }, [ficha, refreshKey]);

  // Função para alternar o status de treinado
  const toggleTreinado = (index) => {
    setPericias((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, treinado: !p.treinado } : p
      )
    );
  };

  const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

  return (
    <div key={refreshKey} className="pericias-container">
      {/* Quadro pequeno com informações básicas */}
      <div className="info-extra">
        <div className="info-coluna">
          <div className="info-item"><strong>Iniciativa:</strong> +{ficha?.iniciativa || "0"}</div>
          <div className="info-item"><strong>Speed:</strong> {ficha?.speed || "0"}ft</div>
          <div className="info-item"><strong>Percepção:</strong> +{10 + calcularModificador(ficha?.atributosPersonagem?.sabedoria?.valor ?? 10) + (pericias.find(pericia => pericia.nome === "Percepção")?.treinado ? (ficha?.proeficiencia ?? 0) : 0)}</div>
        </div>
        <div className="info-coluna">
          <div className="info-item"><strong>Proficiência:</strong> +{ficha?.proeficiencia || "0"}</div>
          <div className="info-item"><strong>Tamanho:</strong>{ficha?.tamanho || ""}</div>
        </div>
      </div>

      {/* Quadro grande com perícias */}
      <div className="pericias-lista">
        <h4>Perícias</h4>
        <ul>
          {pericias.map((pericia, index) => (
            <li key={index} className="pericia-item">
              <div className="modificador">
                {calcularModificador(10 + calcularModificador(pericia.modificador?.valor ?? 10) + (pericia.treinado ? (ficha?.proeficiencia ?? 0) : 0))}
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  disabled
                  checked={ficha?.pericias?.includes(pericia.nome)}
                  onChange={() => toggleTreinado(index)}
                />
              </div>
              <div className="pericia">
                <span title={pericia.descricao}>
                  {pericia.nome}
                  {" "}
                  {pericia.atributo}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
