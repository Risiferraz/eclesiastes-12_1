class BotaoDispenserCards {
    constructor(id) {
        this.id = id
        this.elemento = document.getElementById(id)
        this.habilitado = false
    }
    habilitaBotao() {
        this.elemento.style.opacity = "1"
        this.habilitado = true
    }
    bloqueiaBotao() {
        this.elemento.style.opacity = window.matchMedia('(max-width: 414px)').matches ? "0" : "0.2"
        this.habilitado = false
    }
}
