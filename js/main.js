const game = {
  teclas: { CIMA: 38, BAIXO: 40, ESPACO: 32 },
  pressionou: [],
  velocidadeInimigo1: 5,
  velocidadeInimigo2: 3,
  posicaoInimigo: parseInt(Math.random() * 334),
  timer: setInterval(() => {
    loop();
  }, 30),
};

var fimdejogo = false;
var podeAtirar = true;
var pontos = 0;
var salvos = 0;
var perdidos = 0;
var energiaAtual = 3;

/* sons */
var somDisparo = document.getElementById("somDisparo");
var somExplosao = document.getElementById("somExplosao");
var musica = document.getElementById("musica");
var somGameover = document.getElementById("somGameover");
var somPerdido = document.getElementById("somPerdido");
var somResgate = document.getElementById("somResgate");

//Música em loop
musica.addEventListener(
  "ended",
  function () {
    musica.currentTime = 0;
    musica.play();
  },
  false
);

musica.play();

function moveFundo() {
  esquerda = parseInt($("#fundoGame").css("background-position"));
  $("#fundoGame").css("background-position", esquerda - 1);
}

//Verifica se o usuário pressionou alguma tecla

$(document).keydown(function (e) {
  game.pressionou[e.which] = true;
});

$(document).keyup(function (e) {
  game.pressionou[e.which] = false;
});

function disparo() {
  if (podeAtirar == true) {
    podeAtirar = false;
    somDisparo.play();

    topo = parseInt($("#jogador").css("top"));
    posicaoX = parseInt($("#jogador").css("left"));
    tiroX = posicaoX + 190;
    topoTiro = topo + 37;
    $("#fundoGame").append("<div id='disparo'></div");
    $("#disparo").css("top", topoTiro);
    $("#disparo").css("left", tiroX);

    var tempoDisparo = window.setInterval(executaDisparo, 30);
  } //Fecha podeAtirar

  function executaDisparo() {
    posicaoX = parseInt($("#disparo").css("left"));
    $("#disparo").css("left", posicaoX + 15);

    if (posicaoX > 900) {
      window.clearInterval(tempoDisparo);
      tempoDisparo = null;
      $("#disparo").remove();
      podeAtirar = true;
    }
  } // Fecha executaDisparo()
}

function movejogador() {
  if (game.pressionou[game.teclas.CIMA]) {
    var topo = parseInt($("#jogador").css("top"));
    if (topo < 15) topo += 10;
    $("#jogador").css("top", topo - 10);
  }

  if (game.pressionou[game.teclas.BAIXO]) {
    var topo = parseInt($("#jogador").css("top"));
    if (topo > 435) topo -= 10;
    $("#jogador").css("top", topo + 10);
  }

  if (game.pressionou[game.teclas.ESPACO]) {
    disparo();
  }
}

function moveInimigo1() {
  let posicaoX = parseInt($("#inimigo1").css("left"));
  $("#inimigo1").css("left", posicaoX - game.velocidadeInimigo1);
  $("#inimigo1").css("top", game.posicaoInimigo1);

  if (posicaoX <= 0) {
    game.posicaoInimigo = parseInt(Math.random() * 334);
    $("#inimigo1").css("left", 694);
    $("#inimigo1").css("top", game.posicaoInimigo1);
  }
}

function moveinimigo2() {
  posicaoX = parseInt($("#inimigo2").css("left"));
  $("#inimigo2").css("left", posicaoX - game.velocidadeInimigo2);

  if (posicaoX <= 0) {
    $("#inimigo2").css("left", 775);
  }
}

function moveamigo() {
  posicaoX = parseInt($("#amigo").css("left"));
  $("#amigo").css("left", posicaoX + 1);

  if (posicaoX > 906) {
    $("#amigo").css("left", 0);
  }
}

function colisao() {
  const colisao1 = $("#jogador").collision($("#inimigo1"));
  const colisao2 = $("#jogador").collision($("#inimigo2"));
  const colisao3 = $("#disparo").collision($("#inimigo1"));
  const colisao4 = $("#disparo").collision($("#inimigo2"));
  const colisao5 = $("#jogador").collision($("#amigo"));
  const colisao6 = $("#inimigo2").collision($("#amigo"));

  // jogador com o inimigo1
  if (colisao1.length > 0) {
    energiaAtual--;
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));
    explosao1(inimigo1X, inimigo1Y);

    posicaoY = parseInt(Math.random() * 334);
    $("#inimigo1").css("left", 694);
    $("#inimigo1").css("top", posicaoY);
  }

  // jogador com o inimigo2
  if (colisao2.length > 0) {
    energiaAtual--;
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    explosao2(inimigo2X, inimigo2Y);

    $("#inimigo2").remove();

    reposicionaInimigo2();
  }

  if (colisao3.length > 0) {
    pontos = pontos + 100;
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));

    explosao1(inimigo1X, inimigo1Y);
    $("#disparo").css("left", 950);

    posicaoY = parseInt(Math.random() * 334);
    $("#inimigo1").css("left", 694);
    $("#inimigo1").css("top", posicaoY);
  }

  // Disparo com o inimigo2
  if (colisao4.length > 0) {
    pontos = pontos + 50;
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    $("#inimigo2").remove();

    explosao2(inimigo2X, inimigo2Y);
    $("#disparo").css("left", 950);

    reposicionaInimigo2();
  }
  // jogador com o amigo

  if (colisao5.length > 0) {
    salvos++;
    somResgate.play();
    reposicionaAmigo();
    $("#amigo").remove();
  }

  if (colisao6.length > 0) {
    perdidos++;
    somPerdido.play();
    amigoX = parseInt($("#amigo").css("left"));
    amigoY = parseInt($("#amigo").css("top"));
    explosao3(amigoX, amigoY);
    $("#amigo").remove();

    reposicionaAmigo();
  }
}

function explosao1(inimigo1X, inimigo1Y) {
  somExplosao.play();
  $("#fundoGame").append("<div id='explosao1'></div");
  $("#explosao1").css("background-image", "url(imgs/explosao.png)");
  var div = $("#explosao1");
  div.css("top", inimigo1Y);
  div.css("left", inimigo1X);
  div.animate({ width: 200, opacity: 0 }, "slow");

  var tempoExplosao = window.setInterval(removeExplosao, 1000);

  function removeExplosao() {
    div.remove();
    window.clearInterval(tempoExplosao);
    tempoExplosao = null;
  }
}

function explosao2(inimigo2X, inimigo2Y) {
  somExplosao.play();
  $("#fundoGame").append("<div id='explosao2'></div");
  $("#explosao2").css("background-image", "url(imgs/explosao.png)");
  var div2 = $("#explosao2");
  div2.css("top", inimigo2Y);
  div2.css("left", inimigo2X);
  div2.animate({ width: 200, opacity: 0 }, "slow");

  var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

  function removeExplosao2() {
    div2.remove();
    window.clearInterval(tempoExplosao2);
    tempoExplosao2 = null;
  }
}

function explosao3(amigoX, amigoY) {
  $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
  $("#explosao3").css("top", amigoY);
  $("#explosao3").css("left", amigoX);
  var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
  function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3 = null;
  }
}

function reposicionaInimigo2() {
  var tempoColisao4 = window.setInterval(reposiciona4, 5000);

  function reposiciona4() {
    window.clearInterval(tempoColisao4);
    tempoColisao4 = null;

    if (fimdejogo == false) {
      $("#fundoGame").append("<div id=inimigo2></div");
    }
  }
}

//Reposiciona Amigo

function reposicionaAmigo() {
  var tempoAmigo = window.setInterval(reposiciona6, 6000);

  function reposiciona6() {
    window.clearInterval(tempoAmigo);
    tempoAmigo = null;

    if (fimdejogo == false) {
      $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    }
  }
}

function placar() {
  $("#placar").html(
    "<h2 class='info-placar'> Pontos: " +
      pontos +
      " Salvos: " +
      salvos +
      " Perdidos: " +
      perdidos +
      "</h2>"
  );
}

function gameOver() {
  fimdejogo = true;
  musica.pause();
  somGameover.play();

  window.clearInterval(game.timer);
  game.timer = null;

  $("#jogador").remove();
  $("#inimigo1").remove();
  $("#inimigo2").remove();
  $("#amigo").remove();

  $("#fundoGame").append("<div id='fim'></div>");

  $("#fim").html(
    "<h1 class='title'> Game Over </h1><p class'text'>Sua pontuação foi: " +
      pontos +
      "</p>" +
      "<button id='reinicia' class='text text-link' onClick=reiniciaJogo()>Jogar Novamente</button>"
  );
}

function energia() {
  if (energiaAtual == 3) {
    $("#energia").css("background-image", "url(imgs/energia3.png)");
  }

  if (energiaAtual == 2) {
    $("#energia").css("background-image", "url(imgs/energia2.png)");
  }

  if (energiaAtual == 1) {
    $("#energia").css("background-image", "url(imgs/energia1.png)");
  }

  if (energiaAtual == 0) {
    $("#energia").css("background-image", "url(imgs/energia0.png)");

    gameOver();
  }
}

function velocidade() {
  game.velocidadeInimigo1 += 0.001;
  game.velocidadeInimigo2 += 0.0005;
}

function reiniciaJogo() {
  location.reload();
}

const loop = () => {
  moveFundo();
  movejogador();
  moveInimigo1();
  moveinimigo2();
  moveamigo();
  colisao();
  energia();
  placar();
  velocidade();
};

function start() {
  $("#inicio").hide();

  $("#fundoGame").append(
    "<div id='jogador' class='animacao animacao-1' ></div>"
  );
  $("#fundoGame").append(
    "<div id='inimigo1' class='animacao animacao-2' ></div>"
  );
  $("#fundoGame").append("<div id='inimigo2' ></div>");
  $("#fundoGame").append("<div id='amigo' class='animacao-3' ></div>");
  $("#disparo").append("<div id='disparo'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

  game.timer();
}
