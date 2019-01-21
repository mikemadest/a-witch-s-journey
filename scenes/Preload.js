/**
 *
 **/

class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload", active: false });

    this.witch_images = [
      ["gameTile", "tilemap/overworld.png"],
      ["objectsTile", "tilemap/objects.png"],
      ["charactersTile", "tilemap/character.png"]
    ];

    this.witch_anims = [
      ["coin", { start: 1, end: 4 }],
      ["aryl", { start: 1, end: 4 }],
      ["talking", { start: 1, end: 4 }],
      ["hero-walkdown", { start: 1, end: 4 }],
      ["hero-walkup", { start: 1, end: 4 }],
      ["hero-walkleft", { start: 1, end: 4 }],
      ["hero-walkright", { start: 1, end: 4 }],
      ["fountain", { start: 1, end: 3 }],
      ["waterfall", { start: 1, end: 3 }],
      ["waterfall-b", { start: 1, end: 3 }],
      ["log-walkdown", { frames: [1, 2, 1, 3] }],
      ["log-walkup", { frames: [1, 2, 1, 3] }],
      ["log-walkleft", { frames: [1, 2, 1, 3] }],
      ["log-walkright", { frames: [1, 2, 1, 3] }],
      ["oldman-walkdown", { frames: [1, 2, 1, 3] }],
      ["oldman-walkup", { frames: [1, 2, 1, 3] }],
      ["oldman-walkleft", { frames: [1, 2, 1, 3] }],
      ["oldman-walkright", { frames: [1, 2, 1, 3] }],
      ["grandma-walkdown", { frames: [1, 2, 1, 3] }],
      ["grandma-walkup", { frames: [1, 2, 1, 3] }],
      ["grandma-walkleft", { frames: [1, 2, 1, 3] }],
      ["grandma-walkright", { frames: [1, 2, 1, 3] }],
      ["pirate-walkleft", { frames: [1, 2, 1, 3] }],
      ["pirate-walkright", { frames: [1, 2, 1, 3] }],
      [
        "pirate-stand",
        {
          frames: [
            1,
            2,
            3,
            4,
            4,
            4,
            4,
            3,
            2,
            3,
            4,
            4,
            3,
            3,
            2,
            1,
            1,
            1,
            2,
            2,
            1,
            1,
            2,
            3,
            2,
            1,
            1,
            2,
            2,
            1,
            1,
            2,
            3,
            2,
            1
          ],
          speed: 4
        }
      ]
    ];
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
    this.witch_images.forEach(item => this.load.image(item[0], item[1]));
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
    this.witch_anims.forEach(item =>
      this.createAnims(item[0], "worldAnim", item[1])
    );

    // next state
    this.scene.start("Menu");
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0xF4CCA1", 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
  }

  createAnims(animName, cachename, framesCfg) {
    if (!animName) return;
    const config = { ...framesCfg, prefix: animName + "-" };
    const frameNames = this.anims.generateFrameNames(cachename, config);
    const speed = framesCfg.speed ? framesCfg.speed : 5;
    this.anims.create({
      key: "spr-" + animName,
      frames: frameNames,
      frameRate: speed,
      repeat: -1
    });
  }

  createLoadingBar() {
    // Title
    this.title = new Text(
      this,
      this.CONFIG.centerX,
      75,
      "Loading Game",
      24,
      0.5
    );

    // Progress text
    this.txt_progress = new Text(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY - 5,
      "Loading...",
      16,
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
