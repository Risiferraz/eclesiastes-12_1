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
const mediaQueryMax590 = window.matchMedia('(max-width: 590px)')
const IDS_DE_PAGINA_ESCALA = ['capa', 'tela-inicial', 'jogo-em-andamento', 'jogo-finalizado']
const rotateCard = "rotate(270deg)";
const listaDeIdsParaRotacionar = [
  "lembra-te", "neles", "dizer", "antes", "dias"
]
let frameAjusteDeCards = null

function ajustaTamanhoDosCardsParaDropzonesNoMobile(mediaQuery) {
  if (typeof gabaritoDeDropagem === 'undefined') {
    return
  }

  Object.entries(gabaritoDeDropagem).forEach(([dropzoneId, cardId]) => {
    const dropzone = document.getElementById(dropzoneId)
    const card = document.getElementById(cardId)

    if (!card) {
      return
    }

    if (!mediaQuery.matches) {
      card.style.removeProperty('width')
      card.style.removeProperty('height')
      return
    }

    if (!dropzone) {
      return
    }

    const { width, height } = dropzone.getBoundingClientRect()

    if (!width || !height) {
      return
    }

    const larguraDropzone = Math.round(width)
    const alturaDropzone = Math.round(height)
    const cardRotacionado = listaDeIdsParaRotacionar.includes(cardId)

    if (cardRotacionado) {
      // Para cards rotacionados em 270deg, inverte largura/altura base
      // para que a caixa visual final coincida com o dropzone.
      card.style.width = `${alturaDropzone}px`
      card.style.height = `${larguraDropzone}px`
      return
    }

    card.style.removeProperty('transform-origin')
    card.style.width = `${larguraDropzone}px`
    card.style.height = `${alturaDropzone}px`
  })
}

function agendaAjusteDeCardsNoMobile() {
  if (frameAjusteDeCards !== null) {
    cancelAnimationFrame(frameAjusteDeCards)
  }

  // Dois frames: o primeiro permite aplicar transformações pendentes;
  // o segundo mede o tamanho visual final já escalado na tela.
  frameAjusteDeCards = requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      frameAjusteDeCards = null
      ajustaTamanhoDosCardsParaDropzonesNoMobile(mediaQueryMax590)
    })
  })
}

botaoDispenserCardsParaTelasPequenas(mediaQueryMax414)
agendaAjusteDeCardsNoMobile()
mediaQueryMax414.addEventListener('change', () => {
  botaoDispenserCardsParaTelasPequenas(mediaQueryMax414)
  agendaAjusteDeCardsNoMobile()
})
mediaQueryMax590.addEventListener('change', agendaAjusteDeCardsNoMobile)
window.addEventListener('resize', agendaAjusteDeCardsNoMobile)
window.addEventListener('load', agendaAjusteDeCardsNoMobile)

const observadorDeEscalaMobile = new MutationObserver(() => {
  agendaAjusteDeCardsNoMobile()
})

IDS_DE_PAGINA_ESCALA.forEach((id) => {
  const pagina = document.getElementById(id)

  if (pagina) {
    observadorDeEscalaMobile.observe(pagina, {
      attributes: true,
      attributeFilter: ['style', 'class']
    })
  }
})

//******* FUNÇÕES QUE ACONTECEM AO CLICAR NO "START" *******/
function clicar() {
  document.getElementById("tela-inicial").style.display = "none"
  document.getElementById("jogo-em-andamento").style.display = "grid"
  agendaAjusteDeCardsNoMobile()
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
let activePointerDrag = null;
let dragImageAtiva = null;

function deveCentralizarPivoNoMobile(card) {
  return Boolean(card)
    && mediaQueryMax414.matches
    && listaDeIdsParaRotacionar.includes(card.id)
}

function aplicaRotacaoSeNecessario(card) {
  if (!card) {
    return
  }

  if (listaDeIdsParaRotacionar.includes(card.id)) {
    card.style.setProperty('transform-origin', 'center center', 'important');
    card.style.setProperty('-webkit-transform-origin', 'center center', 'important');
    const transformFinal = rotateCard
    card.style.setProperty('transform', transformFinal, 'important');
    card.style.setProperty('-webkit-transform', transformFinal, 'important');
    return
  }

  card.style.removeProperty('transform-origin')
  card.style.removeProperty('-webkit-transform-origin')
}

function processaDropNoAlvo(alvoDrop) {
  if (!dragged) {
    return
  }

  if (listaDeNumerosAleatoriosJaSorteados.length != quantidadeDeCards && !existeCardVisivelNoContainerPecas()) {
    botaoDispenserCards.habilitaBotao()
  }

  if (gerenciadorDeAreaDeEspera.verificaSeCardVeioDaAreaDeEspera(dragged.id)) {
    gerenciadorDeAreaDeEspera.removeCardDaAreaDeEspera(dragged.id)
  }

  if (alvoDrop && dragged.id == gabaritoDeDropagem[alvoDrop.id]) {
    dragged.parentNode.removeChild(dragged);
    alvoDrop.style.opacity = "0"
    dragged.style.opacity = "1";
    quantidadeDeCardsEncaixadosCorretamente++
    pontuacao.adicionaPontuacao()
    verificaFimDeJogo()
  }
  else {
    dragged.style.display = "none"
    pontuacao.removePontuacao(1)
    setTimeout(() => gerenciadorDeAreaDeEspera.incluiCardNaAreaDeEspera(dragged), 200)
  }
}

document.addEventListener("dragend", event => {
  dragged = event.target;
  if (dragged) {
    dragged.style.opacity = "1";
  }

  if (dragImageAtiva && dragImageAtiva.parentNode) {
    dragImageAtiva.parentNode.removeChild(dragImageAtiva)
  }
  dragImageAtiva = null
  // sorteiaCardDaVez()
});
  document.addEventListener("dragstart", event => { //ao iniciar o arrasto de um elemento
    dragged = event.target;
    aplicaRotacaoSeNecessario(dragged)

    if (deveCentralizarPivoNoMobile(dragged)) {
      dragged.style.setProperty('transform-origin', 'center center', 'important');
      dragged.style.setProperty('-webkit-transform-origin', 'center center', 'important');
      dragged.style.setProperty('transform', rotateCard, 'important');
      dragged.style.setProperty('-webkit-transform', rotateCard, 'important');

      if (event.dataTransfer) {
        const estiloComputado = window.getComputedStyle(dragged)
        const dragImage = dragged.cloneNode(true)

        dragImage.style.position = 'fixed'
        dragImage.style.left = '-10000px'
        dragImage.style.top = '-10000px'
        dragImage.style.margin = '0'
        dragImage.style.width = estiloComputado.width
        dragImage.style.height = estiloComputado.height
        dragImage.style.transformOrigin = 'center center'
        dragImage.style.webkitTransformOrigin = 'center center'
        dragImage.style.transform = rotateCard
        dragImage.style.webkitTransform = rotateCard
        dragImage.style.opacity = '1'
        dragImage.style.pointerEvents = 'none'
        dragImage.style.zIndex = '99999'
        document.body.appendChild(dragImage)
        dragImageAtiva = dragImage

        const hotspotX = Math.round(dragImage.offsetWidth / 2)
        const hotspotY = Math.round(dragImage.offsetHeight / 2)
        event.dataTransfer.setDragImage(
          dragImage,
          hotspotX,
          hotspotY
        )
      }
    }

    if (window.matchMedia('(max-width: 414px)').matches) { // Se a largura da tela for menor ou igual a 414px ...
      document.getElementById("dispensercards").style.display = "flex" // ... exibe o botão "dispensercards"
    }
  setTimeout(() => { // depois de 0ms, define a opacidade do elemento arrastado para 0 (invisível)
    if (dragged) {
      dragged.style.opacity = "0";
    }
  }, 0);
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
  const alvoDrop = event.target && event.target.closest ? event.target.closest('.dropzone') : null
  processaDropNoAlvo(alvoDrop)
});

function ehPointerDeToque(event) { // para verificar se o evento de ponteiro é do tipo "touch" (toque na tela)
  return event.pointerType === 'touch'
}

document.addEventListener('pointerdown', (event) => { // garante que o restante do código dentro do pointerdown só seja executado quando a interação for feita com o dedo na tela (touchscreen).
  if (!ehPointerDeToque(event)) {
    return
  }

  const card = event.target.closest ? event.target.closest('.card') : null
  if (!card || getComputedStyle(card).display === 'none') {
    return
  }

  event.preventDefault()
  dragged = card
  aplicaRotacaoSeNecessario(card)

  if (window.matchMedia('(max-width: 414px)').matches) {
    document.getElementById('dispensercards').style.display = 'flex'
  }

  const rect = card.getBoundingClientRect()
  const estiloComputadoCard = window.getComputedStyle(card)
  const centralizaPivoNoToque = deveCentralizarPivoNoMobile(card)

  if (centralizaPivoNoToque) {
    card.style.setProperty('transform-origin', 'center center', 'important')
    card.style.setProperty('-webkit-transform-origin', 'center center', 'important')
    card.style.setProperty('transform', rotateCard, 'important')
    card.style.setProperty('-webkit-transform', rotateCard, 'important')
  }

  activePointerDrag = {
    pointerId: event.pointerId,
    offsetX: centralizaPivoNoToque ? rect.width / 2 : event.clientX - rect.left,
    offsetY: centralizaPivoNoToque ? rect.height / 2 : event.clientY - rect.top,
    original: {
      position: card.style.position,
      left: card.style.left,
      top: card.style.top,
      width: card.style.width,
      height: card.style.height,
      zIndex: card.style.zIndex,
      pointerEvents: card.style.pointerEvents,
      opacity: card.style.opacity,
      margin: card.style.margin
    }
  }

  card.style.position = 'fixed'
  if (centralizaPivoNoToque) {
    card.style.left = `${event.clientX - (rect.width / 2)}px`
    card.style.top = `${event.clientY - (rect.height / 2)}px`
  }
  else {
    card.style.left = `${rect.left}px`
    card.style.top = `${rect.top}px`
  }
  card.style.width = estiloComputadoCard.width
  card.style.height = estiloComputadoCard.height
  card.style.margin = '0'
  card.style.zIndex = '9999'
  card.style.pointerEvents = 'none'
  card.style.opacity = '0.95'
}, { passive: false })

document.addEventListener('pointermove', (event) => {
  if (!activePointerDrag || activePointerDrag.pointerId !== event.pointerId || !dragged) {
    return
  }

  if (deveCentralizarPivoNoMobile(dragged)) {
    dragged.style.setProperty('transform-origin', 'center center', 'important')
    dragged.style.setProperty('-webkit-transform-origin', 'center center', 'important')
    dragged.style.setProperty('transform', rotateCard, 'important')
    dragged.style.setProperty('-webkit-transform', rotateCard, 'important')
  }

  event.preventDefault()
  dragged.style.left = `${event.clientX - activePointerDrag.offsetX}px`
  dragged.style.top = `${event.clientY - activePointerDrag.offsetY}px`
}, { passive: false })

function finalizaArrastePorToque(event) {
  if (!activePointerDrag || activePointerDrag.pointerId !== event.pointerId || !dragged) {
    return
  }

  event.preventDefault()
  const elementoNoPonto = document.elementFromPoint(event.clientX, event.clientY)
  const alvoDrop = elementoNoPonto && elementoNoPonto.closest ? elementoNoPonto.closest('.dropzone') : null
  const cardArrastado = dragged

  processaDropNoAlvo(alvoDrop)

  if (cardArrastado && cardArrastado.isConnected) {
    cardArrastado.style.position = activePointerDrag.original.position
    cardArrastado.style.left = activePointerDrag.original.left
    cardArrastado.style.top = activePointerDrag.original.top
    cardArrastado.style.width = activePointerDrag.original.width
    cardArrastado.style.height = activePointerDrag.original.height
    cardArrastado.style.zIndex = activePointerDrag.original.zIndex
    cardArrastado.style.pointerEvents = activePointerDrag.original.pointerEvents
    cardArrastado.style.margin = activePointerDrag.original.margin
    cardArrastado.style.opacity = '1'
  }

  activePointerDrag = null
}

document.addEventListener('pointerup', finalizaArrastePorToque, { passive: false })
document.addEventListener('pointercancel', finalizaArrastePorToque, { passive: false })


