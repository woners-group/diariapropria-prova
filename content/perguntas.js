/* =========================================================
   PERGUNTAS DA PROVA — EDITE POR AQUI
   ---------------------------------------------------------
   • Em cada pergunta, a PRIMEIRA alternativa é a CORRETA.
     (Não se preocupe: a ordem é embaralhada na tela.)
   • O banco pode ter mais perguntas que a prova: a cada
     tentativa são sorteadas "quantidade" perguntas.
   • Não apague vírgulas, chaves { } nem colchetes [ ].
   ========================================================= */

window.PROVA_CONFIG = {
  curso: "Diária Própria",
  subtituloCurso: "Do alicerce ao reboco",
  quantidade: 15,          // perguntas por tentativa
  aprovacao: 0.65,         // 65% para passar
  // endereço da landing (logo no topo da prova). Em produção, troque pela URL do site,
  // ex.: "https://diariapropria.com.br"
  linkSite: "../site/index.html",
};

window.PROVA_PERGUNTAS = [
  {
    pergunta: "Qual instrumento é usado para verificar se uma parede está no prumo (alinhada na vertical)?",
    alternativas: ["Prumo de face", "Nível de mangueira", "Trena", "Desempenadeira dentada"],
  },
  {
    pergunta: "Como funciona o nível de mangueira (nível hidráulico)?",
    alternativas: [
      "Uma mangueira transparente com água mostra dois pontos na mesma altura",
      "Um laser projeta uma linha reta na parede",
      "Um peso preso a um fio aponta para o centro",
      "Uma régua dobrável marca o comprimento da parede",
    ],
  },
  {
    pergunta: "Qual é a forma correta de estocar sacos de cimento na obra?",
    alternativas: [
      "Sobre estrados de madeira, em pilhas de no máximo 10 sacos, afastados das paredes",
      "Direto no chão, encostados na parede para não cair",
      "Em pilhas bem altas para economizar espaço",
      "Ao ar livre, cobertos apenas por uma lona",
    ],
  },
  {
    pergunta: "O que acontece quando se coloca água demais no concreto ou na argamassa?",
    alternativas: [
      "Fica mais fácil de trabalhar, mas perde resistência e durabilidade",
      "Fica mais resistente depois de seco",
      "Endurece mais rápido",
      "Nada muda no resultado final",
    ],
  },
  {
    pergunta: "A areia é classificada como agregado miúdo porque:",
    alternativas: [
      "Seus grãos passam pela peneira de 4,8 mm",
      "É sempre retirada de rios",
      "Tem grãos maiores que os da brita",
      "É vendida já misturada com cal",
    ],
  },
  {
    pergunta: "O que a planta baixa de uma casa representa?",
    alternativas: [
      "A vista de cima da construção, como se o telhado fosse retirado",
      "A fachada da frente da casa",
      "Um corte lateral mostrando as alturas",
      "Somente o desenho do telhado",
    ],
  },
  {
    pergunta: "No método 3-4-5 para conferir o esquadro, se um lado mede 3 m e o outro 4 m, quanto deve medir a diagonal entre eles?",
    alternativas: ["5 m", "6 m", "7 m", "4,5 m"],
  },
  {
    pergunta: "Segundo a NR-18, quem deve fornecer os EPIs ao trabalhador contratado?",
    alternativas: [
      "O empregador, sem nenhum custo para o trabalhador",
      "O próprio trabalhador, com o seu salário",
      "O dono do terreno vizinho",
      "A prefeitura da cidade",
    ],
  },
  {
    pergunta: "A partir de qual altura o uso do cinto de segurança passa a ser obrigatório?",
    alternativas: ["Acima de 2 metros", "Acima de 5 metros", "Acima de 10 metros", "Somente em prédios com elevador"],
  },
  {
    pergunta: "Qual tipo de estaca é normalmente feito à mão pelo pedreiro, perfurando o solo com trado?",
    alternativas: ["Estaca broca", "Tubulão a ar comprimido", "Estaca metálica cravada", "Estaca pré-moldada cravada por máquina"],
  },
  {
    pergunta: "Qual é a função da viga baldrame?",
    alternativas: [
      "Ligar as fundações e distribuir o peso das paredes, servindo de base nivelada para a alvenaria",
      "Sustentar as telhas do telhado",
      "Dar acabamento liso ao reboco",
      "Servir de soleira para as portas",
    ],
  },
  {
    pergunta: "Por que os tijolos são assentados com as juntas verticais desencontradas entre uma fiada e outra?",
    alternativas: [
      "Para dar mais estabilidade e resistência à parede",
      "Apenas por estética",
      "Para gastar menos argamassa",
      "Para facilitar a passagem da fiação elétrica",
    ],
  },
  {
    pergunta: "Onde fica a verga e para que ela serve?",
    alternativas: [
      "Acima de portas e janelas, distribuindo o peso da parede que fica em cima do vão",
      "Embaixo do contrapiso, para nivelar o chão",
      "Dentro do pilar, substituindo a armadura",
      "No topo da parede, para prender as telhas",
    ],
  },
  {
    pergunta: "Qual é a ordem correta das camadas de revestimento de uma parede?",
    alternativas: [
      "Chapisco, emboço e reboco",
      "Reboco, chapisco e emboço",
      "Emboço, reboco e chapisco",
      "Chapisco, reboco e emboço",
    ],
  },
  {
    pergunta: "Depois de concretar uma laje ou um radier, o que fazer para uma boa cura do concreto?",
    alternativas: [
      "Manter a superfície úmida por pelo menos 7 dias",
      "Deixar secar no sol o mais rápido possível",
      "Jogar cimento seco por cima",
      "Colocar peso em cima logo no dia seguinte",
    ],
  },
  {
    pergunta: "Qual é o traço mais usado para o chapisco (cimento : areia)?",
    alternativas: ["1 : 3", "1 : 10", "3 : 1", "1 : 1 : 12"],
  },
  {
    pergunta: "Ao preparar concreto na betoneira, depois de colocar todos os materiais, por quanto tempo ela deve continuar girando?",
    alternativas: ["Cerca de 3 minutos", "Apenas 10 segundos", "Cerca de 1 hora", "Até o concreto começar a endurecer"],
  },
  {
    pergunta: "Em banheiros e áreas externas, como deve ser feito o contrapiso?",
    alternativas: [
      "Com um leve caimento em direção aos ralos, para a água escoar",
      "Totalmente plano, sem nenhuma inclinação",
      "Com inclinação para longe dos ralos",
      "Mais alto no centro do cômodo",
    ],
  },
];
