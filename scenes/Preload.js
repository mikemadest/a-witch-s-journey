/**
 *
 **/

class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload", active: false });
  }

  init() {
    // globals
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
  }

  preload() {
    this.createBackground();
    this.createLoadingBar();

    // spritesheets
    this.load.setPath(this.URL + "assets/");
    this.load.spritesheet(
      "coinanim", // key
      "tilemap/objects.png", // file name
      {
        frameWidth: 16,
        frameHeight: 16,
        startFrame: 132,
        endFrame: 135,
        margin: 0,
        spacing: 0
      }
    );

    this.load.image('gameTile', "tilemap/overworld.png");
    this.load.image('objectsTile', "tilemap/objects.png");
    this.load.image('charactersTile', "tilemap/character.png");
    this.load.tilemapTiledJSON("level1", "tilemap/level1.json");

    this.load.atlas(
      "worldAnim",
      "atlas/atlas.png",
      "atlas/atlas.json",
      Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
    );
  }

  create() {

    // create animations

    this.anims.create({
      key: "spr-coin",
      frames: this.anims.generateFrameNumbers('coinanim', {frames: [132, 133, 134, 135] }),
      frameRate: 6,
      repeat: -1
    });


    ["walkdown", "walkup", "walkleft", "walkright"].forEach(animName => {
      const frameNames = this.anims.generateFrameNames("worldAnim", {
        prefix: animName + "-",
        start: 1,
        end: 4
      });
      this.anims.create({
        key: "spr-hero-" + animName,
        frames: frameNames,
        frameRate: 6,
        repeat: -1
      });
    });


    // next state

    this.scene.start("Menu");
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0xF4CCA1", 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
  }

  createLoadingBar() {
    // Title
    this.title = new Text(
      this, // ctx argument, reference to the Preload scene
      this.CONFIG.centerX, // x-coordinate
      75, // y-coordinate
      "Loading Game", // string to write
      "title", // styling key
      0.5 // origin
    );

    // Progress text
    this.txt_progress = new Text(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY - 5,
      "Loading...",
      "preload",
      { x: 0.5, y: 1 }
    );

    // progress bar
    const x = 10;
    const y = this.CONFIG.centerY + 5;
    this.progress = this.add.graphics({ x: x, y: y });
    this.border = this.add.graphics({ x: x, y: y });

    // progress callback
    this.load.on("progress", this.onProgress, this);
  }

  onProgress(val) {
    // Width of progress bar
    const w = this.CONFIG.width - 2 * this.progress.x;
    const h = 36;

    this.progress.clear();
    this.progress.fillStyle("0xFFFFFF", 1);
    this.progress.fillRect(0, 0, w * val, h);

    this.border.clear();
    this.border.lineStyle(4, "0x4D6592", 1);
    this.border.strokeRect(0, 0, w * val, h);

    // Percentage in progress text
    this.txt_progress.setText(Math.round(val * 100) + "%");
  }
}
