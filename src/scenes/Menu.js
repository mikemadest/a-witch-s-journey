/**
 *
 **/
import BaseScene from './BaseScene';
import Text from '../prefabs/Text';

class Menu extends BaseScene {
  constructor(params) {
    if (!params) {
      params = { key: 'Menu', active: false };
    }
    super(params);
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  /**
   * Create title screen background, text and animations
   *
   *
   * @return {type}  description
   */
  create() {
    super.create();
    this.createBackground();
    this.textsData = this.cache.json.get('textsData');

    this.title = new Text(
      this,
      this.CONFIG.centerX,
      -80,
      this.textsData['GAME_TITLE'],
      40,
      0.5
    );
    this.title.obj.setAlpha(0);
    this.tweens.add({
      targets: this.title.obj,
      y: this.CONFIG.centerY - 70,
      alpha: 1,
      duration: 4000,
      ease: 'Cubic',
      easeParams: [1, 1],
      delay: 200,
    });

    this.add
      .text(
        this.CONFIG.centerX,
        this.CONFIG.height - 20,
        this.textsData['MY_INFO'],
        { fill: '#fff', fontSize: '10px', fontFamily: 'Arial, sans serif' }
      )
      .setOrigin(0.5);

    this.showStartText(4000);
    this.menuMusic = this.sound.add('intro');
    this.menuMusic.play();
    this.waitInputToContinue(this.goPlay);
  }

  /**
   * Title screen image
   *
   * @return {type}  description
   */
  createBackground() {
    // the colored background is used for fading effects
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle('0x000000', 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
    const size =
      this.CONFIG.width > this.CONFIG.height
        ? this.CONFIG.width
        : this.CONFIG.height;

    this.bgImage = this.physics.add
      .image(this.CONFIG.centerX, this.CONFIG.centerY, 'titlescreen')
      .setDisplaySize(size, size)
      .setOrigin(0.5, 0.5);
  }

  /**
   * Print text on title screen, used also for intro
   *
   * @param  {type} delay    description
   * @param  {type} textCode description
   * @return {type}          description
   */
  showStartText(delay, textCode) {
    if (!textCode) {
      textCode = 'GAME_START';
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
            ease: 'Linear',
            easeParams: [3.5],
            yoyo: true,
            loop: -1,
          });
        },
        callbackScope: this,
        repeat: 0,
      });
    }
  }

  /**
   * Handle basic pointer / keyboard events for going to next scene
   *
   * @param  {type} callback description
   * @return {type}          description
   */
  waitInputToContinue(callback) {
    if (typeof callback !== 'function') {
      this.input.off('pointerup');
      this.input.keyboard.off('keyup');
      return;
    }
    this.input.on('pointerup', callback, this);
    const handleKeyUp = e => {
      switch (e.code) {
        case 'Enter':
          callback.call(this);
          break;
      }
    };
    this.input.keyboard.on('keyup', handleKeyUp, this);
  }

  /**
   * goPlay - launch next scene
   */
  goPlay() {
    const skipIntro = true;
    if (skipIntro) {
      this.menuMusic.stop();
      this.scene.start('Game');
    } else {
      this.scene.start('Intro', { music: this.menuMusic });
    }
  }
}

export default Menu;
