/**
 *
 **/

class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot", active: true });
  }

  init() {
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
  }

  preload() {
    // Bitmap font for Preload scene
    this.load.setPath(this.URL + "assets/fonts");
    this.load.bitmapFont("ClickPixel", "click-pixel.png", "click-pixel.xml");
  }

  create() {
    this.scene.start("Preload");
  }
}
