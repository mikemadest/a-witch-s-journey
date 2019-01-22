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
    this.textsData = this.cache.json.get('textsData');

    this.title = new Text(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY - 100,
      this.textsData['GAME_TITLE'],
      32,
      0.5
    );

    this.add.text(this.CONFIG.centerX,
      this.CONFIG.height - 20,
      this.textsData['MY_INFO'],
      { fill: '#fff', fontSize: '10px', 'fontFamily': 'Arial, sans serif' }
    ).setOrigin(0.5);


    this.txt_progress = new Text(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY + 100,
      this.textsData['GAME_START'],
      16,
      { x: 0.5, y: 1 }
    );

    this.menuMusic = this.sound.add('intro');
    this.menuMusic.play();

    this.createMouseInput();
    this.createKeyboardInput();
  }

  createBackground() {
    this.physics.add.image(
        0,
        0,
        'titlescreen'
      ).setDisplaySize(this.CONFIG.width, this.CONFIG.height).setOrigin(0, 0);
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
    this.menuMusic.stop();
    this.scene.start("Game");
  }
}
