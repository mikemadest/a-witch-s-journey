/**
 *
 **/

class Intro extends Menu {
  constructor() {
    super({ key: "Intro", active: false });
  }

  init(data) {
    // maybe there's another way, for now it's working...
    this.menuMusic = data.music;
    this.CONFIG = this.sys.game.CONFIG;
  }

  create() {
    this.createBackground();
    this.textsData = this.cache.json.get("textsData");
    this.add
      .text(
        this.CONFIG.centerX,
        this.CONFIG.height - 20,
        this.textsData["MY_INFO"],
        { fill: "#fff", fontSize: "10px", fontFamily: "Arial, sans serif" }
      )
      .setOrigin(0.5);
    this.storySteps = [
      this.textsData["STORY_1"],
      this.textsData["STORY_2"],
      this.textsData["STORY_3"]
    ];

    this.displayIntroText(0);
  }

  displayIntroText(index) {
    const text = this.add
      .text(this.CONFIG.centerX, 100, this.storySteps[index], {
        fill: "#fff",
        fontSize: "20px",
        fontFamily: "Arial, sans serif"
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const buttonTextCode =
      index < this.storySteps.length - 1 ? "CONTINUE" : "GAME_START";

    const tweenConfig = {
      targets: text,
      alpha: 1,
      duration: 1000,
      ease: "Linear",
      delay: 200
    };
    if (index === 0) {
      tweenConfig.onComplete = () => this.showStartText(0, buttonTextCode);
    } else {
      this.showStartText(0, buttonTextCode);
    }

    const tween = this.tweens.add(tweenConfig);

    if (index < this.storySteps.length - 1) {
      this.waitInputToContinue(() => {
        tween.stop();
        text.setAlpha(0);
        this.displayIntroText(++index);
      });
    } else {
      this.waitInputToContinue(this.goPlay);
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
    this.tweens.add({
      targets: this.bgImage,
      alpha: 0,
      duration: 2000,
      ease: "Cubic",
      easeParams: [1, 1],
      delay: 200,
      onComplete: () => {
        this.menuMusic.stop();
        this.scene.start("Game");
      }
    });
  }
}
