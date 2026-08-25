class Pontuacao {
  constructor() {
    this.pontuacaoAtual = 0;
    this.pontuacaoPorCard = 2; // Pontos por cada card correto
    this.elementoIndicador = document.getElementById('indicador');
  }

  /**
   * Adiciona pontuação quando um card é encaixado corretamente
   */
  adicionaPontuacao() {
    this.pontuacaoAtual += this.pontuacaoPorCard;
    this.atualizaIndicadorDePontuacao();
  }

  /**
   * Atualiza a exibição da pontuação na tela
   */
  atualizaIndicadorDePontuacao() {
    if (this.elementoIndicador) {
      this.elementoIndicador.textContent = this.pontuacaoAtual;
    }
  }

  /**
   * Obtém a pontuação atual
   */
  obtemPontuacaoAtual() {
    return this.pontuacaoAtual;
  }

  /**
   * Calcula a pontuação final baseada no tempo decorrido
   * @param {number} tempoEmSegundos - Tempo total do jogo em segundos
   * @returns {number} Pontuação final ajustada
   */
  calculaPontuacaoFinal(tempoEmSegundos) {
    let bonusDeVelocidade = 0;

    // Bônus se completar em menos de 60 segundos
    if (tempoEmSegundos < 60) {
      bonusDeVelocidade = 500;
    }
    // Bônus se completar em menos de 120 segundos
    else if (tempoEmSegundos < 120) {
      bonusDeVelocidade = 250;
    }
    // Bônus se completar em menos de 300 segundos (5 minutos)
    else if (tempoEmSegundos < 300) {
      bonusDeVelocidade = 100;
    }

    const pontuacaoFinal = this.pontuacaoAtual + bonusDeVelocidade;
    return pontuacaoFinal;
  }

  /**
   * Reseta a pontuação para iniciar um novo jogo
   */
  resetaPontuacao() {
    this.pontuacaoAtual = 0;
    this.atualizaIndicadorDePontuacao();
  }

  /**
   * Define um valor de pontuação customizado
   * @param {number} valor - Novo valor de pontuação
   */
  defineValorDePontuacao(valor) {
    this.pontuacaoAtual = valor;
    this.atualizaIndicadorDePontuacao();
  }

  /**
   * Remove pontuação (para casos de erros ou penalidades)
   * @param {number} quantidade - Quantidade de pontos a remover
   */
  removePontuacao(quantidade) {
    this.pontuacaoAtual -= quantidade;
    this.atualizaIndicadorDePontuacao();
  }

  /**
   * Converte um texto de cronômetro no formato mm:ss para segundos.
   * @param {string} cronometroTexto - Texto exibido no cronômetro
   * @returns {number} Tempo total em segundos
   */
  converteCronometroParaSegundos(cronometroTexto) {
    const valorPadrao = 0;

    if (!cronometroTexto || !cronometroTexto.includes(':')) {
      return valorPadrao;
    }

    const [minutosTexto, segundosTexto] = cronometroTexto.split(':');
    const minutos = parseInt(minutosTexto, 10);
    const segundos = parseInt(segundosTexto, 10);

    if (Number.isNaN(minutos) || Number.isNaN(segundos)) {
      return valorPadrao;
    }

    return (minutos * 60) + segundos;
  }

  /**
   * Extrai apenas os algarismos do cronômetro e os converte em número.
   * Ex.: 08:35 -> 835 | 12:40 -> 1240
   * @param {string} cronometroTexto - Texto exibido no cronômetro
   * @returns {number} Número formado pelos algarismos do cronômetro
   */
  converteCronometroParaNumero(cronometroTexto) {
    const cronometroSomenteDigitos = (cronometroTexto || '').replace(/\D/g, '');

    if (cronometroSomenteDigitos === '') {
      return 0;
    }

    return parseInt(cronometroSomenteDigitos, 10);
  }

  /**
   * Aplica a pontuação final somando um bônus derivado dos algarismos do cronômetro:
   * pontuacaoAtual + ((1000 - numeroCronometro) / 100)
   * @param {string} cronometroTexto - Texto do cronômetro no formato mm:ss
   * @returns {number} Pontuação final calculada
   */
  aplicaPontuacaoFinalComTempo(cronometroTexto) {
    const numeroCronometro = this.converteCronometroParaNumero(cronometroTexto);
    const bonusBruto = 1000 - numeroCronometro;
    const bonusDeTempo = bonusBruto / 100;
    const pontuacaoFinal = Number((this.pontuacaoAtual + bonusDeTempo).toFixed(2));

    console.log('[PontuacaoFinal] Detalhamento do calculo:');
    console.log(`pontuacaoAtual = ${this.pontuacaoAtual}`);
    console.log(`cronometroTexto = ${cronometroTexto}`);
    console.log(`numeroCronometro = ${numeroCronometro}`);
    console.log(`bonusBruto = 1000 - ${numeroCronometro} = ${bonusBruto}`);
    console.log(`bonusDeTempo = ${bonusBruto} / 100 = ${bonusDeTempo}`);
    console.log(`pontuacaoFinal = ${this.pontuacaoAtual} + ${bonusDeTempo} = ${pontuacaoFinal}`);

    this.pontuacaoAtual = pontuacaoFinal;
    this.atualizaIndicadorDePontuacao();

    return pontuacaoFinal;
  }
}

// Cria uma instância global da classe Pontuacao
const pontuacao = new Pontuacao();
