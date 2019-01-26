/**
 *
 **/
import { Scene } from 'phaser';


class Boot extends Scene {
  constructor() {
    super({ key: "Boot", active: true });
  }

  init() {
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
    this.language = this.CONFIG.language;
  }

  preload() {
    // Bitmap font for Preload scene
    this.load.setPath(this.URL);
    this.load.bitmapFont(
      "ClickPixel",
      "assets/fonts/click-pixel.png",
      "assets/fonts/click-pixel.xml"
    );
    //this.load.script('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont');

    // very basic international support, just to experiment
    if (["en", "fr"].indexOf(this.language) < 0) {
      this.language = "en";
    }
    this.load.json("textsData", "assets/data/texts-" + this.language + ".json");

    this.load.image("titlescreen", "assets/img/title-bg.png");

    // list of images assets and animations
    this.load.json("preloadData", "assets/data/preload.json");
  }

  create() {

    this.sys.game.events.on('resize', this.resizeApp, this);
    // Call the resize so the game resizes correctly on scene start
    //this.resize();
    this.resizeApp(this.sys.game.CONFIG);
    this.scene.start("Preload");
  }



    resizeApp(config) {
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

}


export default Boot;