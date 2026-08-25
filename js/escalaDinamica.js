// Função para dimensionamento proporcional de toda a área de jogo
// Essa função é uma IIFE auto-contida — não depende de nenhuma variável ou função definida
// em outro lugar (ou arquivo).
// Ela usa apenas APIs nativas do DOM (getElementById, window.addEventListener).
(function escalaDinamicaPagina() {
  const MAX_VISUAL_WIDTH = 800;
  const MOBILE_BREAKPOINT = 414;
  const PAGE_IDS = ['capa', 'tela-inicial', 'jogo-em-andamento', 'jogo-finalizado'];
  let frameDeEscala = null;

  function limpaTransformacao(elemento) {
    elemento.style.transform = '';
    elemento.style.transformOrigin = '';
  }

  function aplicaEscala(elemento, larguraDisponivel, alturaDisponivel) {
    limpaTransformacao(elemento);

    const larguraBase = elemento.offsetWidth;
    const alturaBase = elemento.offsetHeight;

    if (!larguraBase || !alturaBase) {
      return;
    }

    const larguraLimite = Math.min(larguraDisponivel, MAX_VISUAL_WIDTH);
    const escala = Math.min(larguraLimite / larguraBase, alturaDisponivel / alturaBase);

    if (!Number.isFinite(escala) || escala >= 1) {
      return;
    }

    const larguraEscalada = larguraBase * escala;
    const deslocamentoX = Math.max(0, (larguraDisponivel - larguraEscalada) / 2);

    // Origem no topo esquerdo + deslocamento horizontal para manter o centro visual na tela.
    elemento.style.transformOrigin = 'top left';
    elemento.style.transform = `translate(${deslocamentoX}px, 0) scale(${escala})`;
  }

  function scaleStage() {
    const stageWrapper = document.querySelector('.stage');
    const paginas = PAGE_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!stageWrapper || paginas.length === 0) {
      return;
    }

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      paginas.forEach(limpaTransformacao);
      return;
    }

    const larguraDisponivel = stageWrapper.clientWidth;
    const alturaDisponivel = stageWrapper.clientHeight;

    paginas.forEach((pagina) => {
      const estilo = window.getComputedStyle(pagina);

      if (estilo.display === 'none') {
        limpaTransformacao(pagina);
        return;
      }

      aplicaEscala(pagina, larguraDisponivel, alturaDisponivel);
    });
  }

  function agendaEscala(origem) {
    if (frameDeEscala !== null) {
      cancelAnimationFrame(frameDeEscala);
    }

    frameDeEscala = window.requestAnimationFrame(() => {
      frameDeEscala = null;
      scaleStage();
    });
  }

  window.addEventListener('resize', () => agendaEscala('resize'));
  window.addEventListener('DOMContentLoaded', () => agendaEscala('DOMContentLoaded'));
  window.addEventListener('load', () => agendaEscala('load'));

  const observadorDeTela = new MutationObserver((mutacoes) => {
    agendaEscala('mutation');
  });

  PAGE_IDS.forEach((id) => {
    const pagina = document.getElementById(id);

    if (pagina) {
      observadorDeTela.observe(pagina, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
  });
})();