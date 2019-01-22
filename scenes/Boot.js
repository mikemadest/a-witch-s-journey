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
    this.language = this.CONFIG.language;
  }

  preload() {
    // Bitmap font for Preload scene
    this.load.setPath(this.URL);
    this.load.bitmapFont("ClickPixel", "assets/fonts/click-pixel.png", "assets/fonts/click-pixel.xml");
    //this.load.script('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont');

    // very basic international support, just to experiment
    if (['en', 'fr'].indexOf(this.language) < 0) {
      this.language = 'en';
    }
    this.load.json('textsData', 'data/texts-' + this.language + '.json');

    this.load.image('titlescreen', 'assets/img/title-bg.png');

    // list of images assets and animations
    this.load.json('preloadData', 'data/preload.json');
  }

  create() {
    this.scene.start("Preload");
  }
}
