console.log("%c start game Resgate", "color: blue; font-size: 20px");

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
}
