import { Scene } from 'phaser';

class BaseScene extends Scene {
  init() {
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
    this.language = this.CONFIG.language;
  }

  preload() {}

  create() {
    // Call the resize so the game resizes correctly on scene start
    this.sys.game.events.on(
      'resize',
      () => this.resizeApp(this.sys.game.CONFIG),
      this
    );
    this.resizeApp(this.sys.game.CONFIG);
  }

  update() {}

  resizeApp(config) {
    // Width-height-ratio of game resolution
    const game_ratio = config.width / config.height;

    // Make div full height of browser and keep the ratio of game resolution
    const div = document.getElementById('phaser-app');
    div.style.width = window.innerHeight * game_ratio + 'px';
    div.style.height = window.innerHeight + 'px';

    // Check if device DPI messes up the width-height-ratio
    const canvas = document.getElementsByTagName('canvas')[0];

    const dpi_w = parseInt(div.style.width) / canvas.width;
    const dpi_h = parseInt(div.style.height) / canvas.height;

    const height = window.innerHeight * (dpi_w / dpi_h);
    const width = height * game_ratio;

    // Scale canvas
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
}

export default BaseScene;
