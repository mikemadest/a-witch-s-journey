/**
 *
 **/

class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload", active: false });
  }

  /**
   *
   */
  init() {
    // globals
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
  }

  /**
   *
   */
  preload() {
    this.createBackground();
    this.createLoadingBar();
    this.preloadData = this.cache.json.get('preloadData');

    // spritesheets
    this.load.setPath(this.URL);
    this.preloadData["images"].forEach(item => this.load.image(item[0], item[1]));
    this.load.tilemapTiledJSON("level1", "assets/tilemap/level1.json");

    this.load.atlas(
      "worldAnim",
      "assets/atlas/atlas.png",
      "assets/atlas/atlas.json",
      Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
    );

    this.load.json('spritesData', 'data/sprites.json');
    //this.load.bitmapFont("dialogueFont", "assets/fonts/good_neighbors.png");

    this.preloadData["audio"].forEach(item => this.load.audio(item[0], item[1]));

  }

  /**
   *
   */
  create() {
    // create animations
    this.preloadData["anims"].forEach(item =>
      this.createAnims(item[0], "worldAnim", item[1])
    );

    // next state
    this.scene.start("Menu");
  }

  /**
   *
   */
  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0x476565", 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
  }

  /**
   *
   * @param animName
   * @param cachename
   * @param framesCfg
   */
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

  /**
   *
   */
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

  /**
   *
   * @param val
   */
  onProgress(val) {
    // Width of progress bar
    const w = this.CONFIG.width - 2 * this.progress.x;
    const h = 36;

    this.progress.clear();
    this.progress.fillStyle("0xFFFFFF", 1);
    this.progress.fillRect(0, 0, w * val, h);

    this.border.clear();
    this.border.lineStyle(4, "0x0e1a1a", 1);
    this.border.strokeRect(0, 0, w * val, h);

    // Percentage in progress text
    this.txt_progress.setText(Math.round(val * 100) + "%");
  }
}
