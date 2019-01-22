/**
 *
 **/

class Menu extends Phaser.Scene {
  constructor(params) {
    if (!params) {
      params = { key: "Menu", active: false };
    }
    super(params);
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
      -80,
      this.textsData["GAME_TITLE"],
      40,
      0.5
    );

    //[x] [, y] [, color] [, blur] [, shadowStroke] [, shadowFill]
    //this.title.obj.setShadow(1, 1, '0x000000', 1);

    this.title.obj.setAlpha(0);
    this.tweens.add({
      targets: this.title.obj,
      y: this.CONFIG.centerY - 70,
      alpha: 1,
      duration: 4000,
      ease: "Cubic",
      easeParams: [1, 1],
      delay: 200
    });

    this.add
      .text(
        this.CONFIG.centerX,
        this.CONFIG.height - 20,
        this.textsData["MY_INFO"],
        { fill: "#fff", fontSize: "10px", fontFamily: "Arial, sans serif" }
      )
      .setOrigin(0.5);

    this.showStartText(4000);
    this.menuMusic = this.sound.add("intro");
    this.menuMusic.play();
    this.waitInputToContinue(this.goPlay);
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0x000000", 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);

    this.bgImage = this.physics.add
      .image(0, 0, "titlescreen")
      .setDisplaySize(this.CONFIG.width, this.CONFIG.height)
      .setOrigin(0, 0);
  }

  showStartText(delay, textCode) {
    if (!textCode) {
      textCode = "GAME_START";
    }

    if (this.txt_progress) {
      this.txt_progress.setText(this.textsData[textCode]);
    } else {
      this.txt_progress = new Text(
        this,
        this.CONFIG.centerX,
        this.CONFIG.centerY + 100,
        this.textsData[textCode],
        16,
        { x: 0.5, y: 1 }
      );
      this.txt_progress.obj.setAlpha(0);

      this.time.addEvent({
        delay: delay,
        callback: () => {
          this.tweens.add({
            targets: this.txt_progress.obj,
            alpha: 1,
            duration: 1500,
            ease: "Linear",
            easeParams: [3.5],
            yoyo: true,
            loop: -1
          });
        },
        callbackScope: this,
        repeat: 0
      });
    }
  }

  waitInputToContinue(callback) {
    this.input.on("pointerup", callback, this);
    function handleKeyUp(e) {
      switch (e.code) {
        case "Enter":
          callback();
          break;
      }
    }
    this.input.keyboard.on("keyup", handleKeyUp, this);
  }

  /**
   * goPlay - launch next scene
   */
  goPlay() {
    this.scene.start("Intro", { music: this.menuMusic });
  }
}
