class GerenciadorDeAreaDeEspera {
    constructor() {
        this.listaDeAreasDeEspera = [
            new AreaDeEspera("P1"),
            new AreaDeEspera("P2"),
            new AreaDeEspera("P3"),
            new AreaDeEspera("P4"),
        ]
    }
    incluiCardNaAreaDeEspera(cardDropado) {
        if (cardDropado.id == "lembra-te") {
            const elementoP5 = document.getElementById("P5")
            elementoP5.appendChild(cardDropado);
            cardDropado.style.display="block"
        }
        else {
            const areaDeEsperaAleatoria = this.pegaAreaDeEsperaAleatoria()
            areaDeEsperaAleatoria.recebeCard(cardDropado)
        }
    }
    verificaSeTemAreaDisponivel() {
        if (!this.listaDeAreasDeEspera.filter(a => a.disponivel).length) {
            return false
        }
        else {
            return true
        }
    }
    verificaSeCardVeioDaAreaDeEspera(idDoCardDropado) {
        if (this.listaDeAreasDeEspera.filter(a => a.cardDropadoId == idDoCardDropado).length) {
            return true
        }
        else {
            return false
        }
    }
    pegaAreaDeEsperaAleatoria() {
        const total = this.listaDeAreasDeEspera.length
        const posicaoSorteada = Math.floor(Math.random() * total)
        const areaDeEsperaAleatoria = this.listaDeAreasDeEspera[posicaoSorteada]//pega o elemento das linhas 4 a 8
        if (areaDeEsperaAleatoria.disponivel) {//tá disponível? Beleza
            return areaDeEsperaAleatoria
        }
        else {
            return this.pegaAreaDeEsperaAleatoria() //se não está disponível, sorteia de novo
        }
    }
    removeCardDaAreaDeEspera(idDoCardDropado) {
        this.listaDeAreasDeEspera
            .find(a => a.cardDropadoId == idDoCardDropado)
            .removeCard()
    }
}