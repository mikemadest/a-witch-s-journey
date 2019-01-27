/**
 *
 **/
import Menu from "./Menu";
import Text from "../prefabs/Text";

class Intro extends Menu {
  constructor() {
    super({ key: "Intro", active: false });
  }

  init(data) {
    // maybe there's another way, for now it's working...
    this.menuMusic = data.music;
    this.CONFIG = this.sys.game.CONFIG;
  }

  /**
   * Prepare story screen
   *
   * @return {type}  description
   */
  create() {
    // Call the resize so the game resizes correctly on scene start
    this.sys.game.events.on(
      "resize",
      () => this.resizeApp(this.sys.game.CONFIG),
      this
    );
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

  /**
   * Show story text, one part at a time
   *
   * @param  {type} index description
   * @return {type}       description
   */
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
        this.waitInputToContinue(false);
        tween.stop();
        text.setAlpha(0);
        this.displayIntroText(++index);
      });
    } else {
      this.waitInputToContinue(this.goPlay);
    }
  }

  /**
   * goPlay - launch next scene
   */
  goPlay() {
    this.waitInputToContinue(false);
    this.tweens.add({
      targets: this.bgImage,
      alpha: 0,
      duration: 1500,
      ease: "Cubic",
      easeParams: [1, 1],
      delay: 0,
      onComplete: () => {
        this.menuMusic.stop();
        this.scene.start("Game");
      }
    });
  }
}

export default Intro;
