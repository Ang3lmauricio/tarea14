class Puzzle {
  constructor() {
    this.puzzleContainer = document.getElementById('puzzle');
    this.btnJugar = document.getElementById('jugar');
    this.movimientosSpan = document.getElementById('movimientos');
    this.tiempoSpan = document.getElementById('tiempo');
    this.finMensaje = document.getElementById('fin');

    this.n = 4; 
    this.tiles = [];
    this.movimientos = 0;
    this.tiempo = 0;
    this.timer = null;

    this.btnJugar.addEventListener('click', () => this.iniciarJuego());
  }

  iniciarJuego() {
    this.tiles = [...Array(15).keys()].map(n => n + 1);
    this.tiles.push(null);
    this.mezclar();
    this.movimientos = 0;
    this.tiempo = 0;
    this.finMensaje.textContent = '';
    this.actualizarVista();

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.tiempo++;
      this.tiempoSpan.textContent = this.tiempo;
    }, 1000);
  }

  mezclar() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
    if (this.estaResuelto()) this.mezclar();
  }

  actualizarVista() {
    this.puzzleContainer.innerHTML = '';
    this.tiles.forEach((valor, index) => {
      const btn = document.createElement('button');
      if (valor) {
        btn.textContent = valor;
        btn.addEventListener('click', () => this.mover(index));
      } else {
        btn.className = 'empty';
      }
      this.puzzleContainer.appendChild(btn);
    });
    this.movimientosSpan.textContent = this.movimientos;
  }

  mover(index) {
    const vacio = this.tiles.indexOf(null);
    if (this.puedeMover(index, vacio)) {
      [this.tiles[index], this.tiles[vacio]] = [this.tiles[vacio], this.tiles[index]];
      this.movimientos++;
      this.actualizarVista();
      if (this.estaResuelto()) this.finalizarJuego();
    }
  }

  puedeMover(index, vacio) {
    const fila = Math.floor(index / this.n);
    const col = index % this.n;
    const filaV = Math.floor(vacio / this.n);
    const colV = vacio % this.n;
    return (fila === filaV && Math.abs(col - colV) === 1) ||
           (col === colV && Math.abs(fila - filaV) === 1);
  }

  estaResuelto() {
    for (let i = 0; i < 15; i++) {
      if (this.tiles[i] !== i + 1) return false;
    }
    return true;
  }

  finalizarJuego() {
    clearInterval(this.timer);
    this.finMensaje.textContent = `¡Juego finalizado en ${this.movimientos} movimientos y ${this.tiempo} segundos!`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Puzzle();
});
