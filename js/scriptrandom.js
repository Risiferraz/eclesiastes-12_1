function embaralhaCards(){
    const total = this.cards.length//length = extensão, duração, quantidade, lista
    const cardEscolhido = Math.floor(Math.random() * total)
    this.card[cardEscolhido].valor
}

// const bolaDaVez = this.card.charAt(cardEscolhido)
// this.card[cardEscolhido].recebeZIndex(bolaDaVez)
// document.getElementsByClassName (cardEscolhido).style.ZIndex = []
