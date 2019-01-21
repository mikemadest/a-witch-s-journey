/**
 *
 **/
function resizeApp(config) {
  // Width-height-ratio of game resolution
  // Replace 360 with your game width, and replace 640 with your game height
  let game_ratio = config.width / config.height;

  // Make div full height of browser and keep the ratio of game resolution
  let div = document.getElementById("phaser-app");
  div.style.width = window.innerHeight * game_ratio + "px";
  div.style.height = window.innerHeight + "px";

  // Check if device DPI messes up the width-height-ratio
  let canvas = document.getElementsByTagName("canvas")[0];

  let dpi_w = parseInt(div.style.width) / canvas.width;
  let dpi_h = parseInt(div.style.height) / canvas.height;

  let height = window.innerHeight * (dpi_w / dpi_h);
  let width = height * game_ratio;

  // Scale canvas
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}


function runApp() {
  "use strict";

  // init the Phaser game app
  const app = new App();
  app.start();

  // scale to device
  //resizeApp(app.config);
  //window.addEventListener("resize", resizeApp);
}

window.onload = function() {

    // Check ES6
    try {
      eval("let i = 0;");
      eval("const _dev = true;");
    } catch (e) {
      alert("This browser is not supported. Use Chrome or Firefox.");
      return false;
    }

    // run game
    runApp();
};
