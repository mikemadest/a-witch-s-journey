/**
 *
 **/
import { Scene } from 'phaser';

class GameOver extends Scene {
  constructor() {
    super({ key: "GameOver", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  create() {
    this.createBackground();
    this.textsData = this.cache.json.get("textsData");

    this.title = new Text(
      this,
      this.CONFIG.centerX,
      50,
      this.textsData["GAME_OVER"],
      24,
      0.5
    );

    this.txt_progress = new Text(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY + 100,
      this.textsData["GAME_OVER_RESTART"],
      16,
      { x: 0.5, y: 1 }
    );

    this.createMouseInput();
    this.createKeyboardInput();
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0x000000", 1);
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

export default GameOver;