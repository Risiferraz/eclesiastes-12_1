class AreaDeEspera {
    constructor(id) {
        this.id=id
        this.elemento=document.getElementById(this.id)
        this.disponivel=true//minha area de espera começa o jogo disponível
        this.cardDropadoId=""//o card dropado Id começa vazio
    }
    recebeCard(cardDropado){
        this.elemento.appendChild(cardDropado);
        cardDropado.style.display="block"
        this.disponivel=false//quando a area de espera recebe o card fica indisponível (false)
        this.cardDropadoId=cardDropado.id
    }
    removeCard(){
        this.disponivel=true
        this.cardDropadoId=""
        // this.elemento.style.backgroundColor = "grey";
    }
}