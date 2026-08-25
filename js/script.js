const quantidadeDeCards = 26
//*******CRONOMETRO********
const cronometro = new Cronometro()
setInterval(() => {
  cronometro.atualizaCronometro()
}, 1000);
let isCardAparenteNoDispenserCards = true
const botaoDispenserCards = new BotaoDispenserCards("dispensercards")
//********LISTA DA ÁREA DE ESPERA******** */
const gerenciadorDeAreaDeEspera = new GerenciadorDeAreaDeEspera()
let quantidadeDeCardsEncaixadosCorretamente = 0
//******* FUNÇÕES QUE ACONTECEM AO INICIAR *******/
function passar() {
  document.getElementById("capa").style.display = "none"
  document.getElementById("tela-inicial").style.display = "block"
}

const listaDeCards = document.getElementsByClassName('card');
const listaDeCardsNaoSorteados = Array.from(listaDeCards)
const listaDeNumerosAleatoriosJaSorteados = []
const botaoPreviewFinal = document.getElementById('preview-final')

function existeCardVisivelNoContainerPecas() {
  const containerPecas = document.querySelector('.containerpecas')
  if (!containerPecas) {
    return false
  }

  return Array.from(containerPecas.querySelectorAll('.card')).some((card) => {
    const estilo = getComputedStyle(card)
    return estilo.display !== 'none' && estilo.visibility !== 'hidden' && estilo.opacity !== '0'
  })
}

function botaoDispenserCardsParaTelasPequenas(mediaQuery) {
  const dispensercards = document.getElementById('dispensercards')
  const areaInferior = document.getElementById('area-inferior')
  const containerPecas = document.querySelector('.containerpecas')
  const marcatempo = document.getElementById('marcatempo')
  const marcapontuacao = document.getElementById('marcapontuacao')

  if (!dispensercards || !areaInferior || !containerPecas || !marcatempo || !marcapontuacao) {
    return
  }

  if (mediaQuery.matches) {
    dispensercards.style.display = 'none'
    areaInferior.classList.add('area-inferior-before')
    containerPecas.classList.add('containerpecas-before')
    marcatempo.classList.add('marcatempo-before')
    marcapontuacao.classList.add('marcapontuacao-before')
    return
  }

  if (quantidadeDeCardsEncaixadosCorretamente < quantidadeDeCards) {
    dispensercards.style.display = ''
  }
  areaInferior.classList.remove('area-inferior-before')
  containerPecas.classList.remove('containerpecas-before')
  marcatempo.classList.remove('marcatempo-before')
  marcapontuacao.classList.remove('marcapontuacao-before')
}

const mediaQueryMax414 = window.matchMedia('(max-width: 414px)')
botaoDispenserCardsParaTelasPequenas(mediaQueryMax414)
mediaQueryMax414.addEventListener('change', () => botaoDispenserCardsParaTelasPequenas(mediaQueryMax414))

//******* FUNÇÕES QUE ACONTECEM AO CLICAR NO "START" *******/
function clicar() {
  document.getElementById("tela-inicial").style.display = "none"
  document.getElementById("jogo-em-andamento").style.display = "grid"
  pontuacao.resetaPontuacao()
  cronometro.iniciaCronometro()
  sorteiaCardDaVez()
  botaoDispenserCards.bloqueiaBotao()
}
function sorteiaCardDaVez() {
  const numeroAleatorio = Math.floor(Math.random() * listaDeCardsNaoSorteados.length)
  if (listaDeNumerosAleatoriosJaSorteados.includes(numeroAleatorio)) {
    sorteiaCardDaVez()
  }
  else {
    listaDeCardsNaoSorteados[numeroAleatorio].style.display = "inline";
    listaDeNumerosAleatoriosJaSorteados.push(numeroAleatorio);
  }
}
//*******FUNÇÕES QUE ACONTECEM NO DRAG AND DROP *******/
let dragged = null;

document.addEventListener("dragend", event => {
  dragged = event.target;
  if (dragged) {
    dragged.style.opacity = "1";
  }
  // sorteiaCardDaVez()
});
const rotateCard = "rotate(270deg)";
const listaDeIdsParaRotacionar = [
  "lembra-te", "neles", "dizer", "antes", "dias"
]
  document.addEventListener("dragstart", event => { //ao iniciar o arrasto de um elemento
    dragged = event.target;
    if (window.matchMedia('(max-width: 414px)').matches) {
      document.getElementById("dispensercards").style.display = "flex"
    }
  setTimeout(() => {
    if (dragged) {
      dragged.style.opacity = "0";
    }
  }, 0);

  if (listaDeIdsParaRotacionar.includes(dragged.id)) {//Se a lista de ids inclui o id do card em questão (dragged)
    const escalaMobile = window.matchMedia('(max-width: 393px)').matches ? ' scale(0.875)' : '';
    const transformFinal = `${rotateCard}${escalaMobile}`;
    dragged.style.setProperty('transform', transformFinal, 'important');
  }
});

document.addEventListener("dragover", event => {
  event.preventDefault();
});

document.getElementById('dispensercards').addEventListener("click", event => {
  event.preventDefault();
  if (botaoDispenserCards.habilitado) {
    botaoDispenserCards.bloqueiaBotao()
    verificaSeAcabouOsCards();
    if (gerenciadorDeAreaDeEspera.verificaSeTemAreaDisponivel()) {
      sorteiaCardDaVez();
    }
    else {
      alert("LIBERE ESPAÇO NA ÁREA DE ESPERA ANTES DE DESPENSAR OUTRA PEÇA")
    }
  }
});

function verificaFimDeJogo() {
  if (quantidadeDeCardsEncaixadosCorretamente == quantidadeDeCards) {
    document.getElementById("dispensercards").style.display = "none"
    document.getElementById("marcapontuacao").style.gridColumn = "1"
    document.querySelectorAll(".containerpecas").forEach((container) => {
      container.style.backgroundColor = "transparent"
    })
    document.getElementById("area-de-espera").style.backgroundColor = "transparent"
    document.getElementById("jogo-finalizado").style.display = "block"
    cronometro.pararCronometro()
    const cronometroEl = document.getElementById('cronometro')
    const textoCronometro = cronometroEl ? cronometroEl.textContent.trim() : '00:00'
    pontuacao.aplicaPontuacaoFinalComTempo(textoCronometro)
  }
}

if (botaoPreviewFinal) {
  botaoPreviewFinal.addEventListener('click', () => {
    quantidadeDeCardsEncaixadosCorretamente = quantidadeDeCards
    verificaFimDeJogo()
  })
}

function verificaSeAcabouOsCards() {
  if (listaDeNumerosAleatoriosJaSorteados.length == (quantidadeDeCards - 1)) {
    // alert("ACABARAM OS CARDS!")
    document.getElementById("dispensercards").style.opacity = "0.2"
  }
}

document.addEventListener("drop", event => { 
  event.preventDefault();  // impedir a ação padrão (default) e assim permitir dropagem para elementos dragaveis)
  if (listaDeNumerosAleatoriosJaSorteados.length != quantidadeDeCards && !existeCardVisivelNoContainerPecas()) {
    botaoDispenserCards.habilitaBotao()
  }
  //mover o elemento arrastado para o destino de soltar selecionado
  if (gerenciadorDeAreaDeEspera.verificaSeCardVeioDaAreaDeEspera(dragged.id)) {// se o gerenciador... verificar que o card veio da 'área de espera' neste caso apareça no console 'VEIO'
    gerenciadorDeAreaDeEspera.removeCardDaAreaDeEspera(dragged.id)
  }

  //*******FUNÇÕES QUE ACONTECEM NO DROP *******/

  if (dragged.id == gabaritoDeDropagem[event.target.id]) {//se o elemento arrastado corresponder (seu id) a algum constante do gabarito de dropagem
    dragged.parentNode.removeChild(dragged);
    event.target.style.opacity = "0" // deixa a div dropada transparente, possibilitando ver parte da imagem de fundo por baixo
    dragged.style.opacity = "1"; //deixa o card arrastado visível novamente
    quantidadeDeCardsEncaixadosCorretamente++ //aumenta a quantidade de cards encaixados corretamente
    pontuacao.adicionaPontuacao()
    verificaFimDeJogo()
  }
  else { // se o elemento arrastado não corresponder a algum constante do gabarito de dropagem
    dragged.style.display = "none" //esconde o card arrastado
    pontuacao.removePontuacao(1)
    setTimeout(() => gerenciadorDeAreaDeEspera.incluiCardNaAreaDeEspera(dragged), 200)
  }
});


