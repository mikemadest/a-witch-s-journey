/**
 *
 **/

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "Menu", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  create() {
    this.createBackground();

    this.title = new Text(
      this, // ctx argument, reference to the Preload scene
      this.CONFIG.centerX, // x-coordinate
      50, // y-coordinate
      "A \r\nWitch\nJourney", // string to write
      "title", // styling key
      0.5 // origin
    );

    this.txt_progress = new Text(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY + 100,
      "Click to start",
      "preload",
      { x: 0.5, y: 1 }
    );

    this.createMouseInput();
    this.createKeyboardInput();
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0xF4CCA1", 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
  }

  createMouseInput() {
    this.input.on("pointerup", this.goPlay, this);
  }

  createKeyboardInput() {
    function handleKeyUp(e) {
      switch (e.code) {
        case "Enter":
          this.goPlay();
          break;
      }
    }

    this.input.keyboard.on("keyup", handleKeyUp, this);
  }

  goPlay() {
    this.scene.start("Game");
  }
}
