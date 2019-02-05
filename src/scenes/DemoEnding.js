/**
 *
 **/
import BaseScene from './BaseScene';
import Text from '../prefabs/Text';

class DemoEnding extends BaseScene {
  constructor() {
    super({ key: 'DemoEnding', active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  create() {
    super.create();
    this.createBackground();
    this.textsData = this.cache.json.get('textsData');
    this.title = new Text(
      this,
      this.CONFIG.centerX,
      150,
      this.textsData['DEMO_END'],
      24,
      0.5
    );

    
    const padding = 15;
    this.maxWidth =
      (0.95 * this.CONFIG.width) / this.cameras.main.zoom - padding;

    this.add
      .text(this.CONFIG.centerX, 50, this.textsData['DEMO_STORY'], {
        fill: '#fff',
        fontSize: '20px',
        fontFamily: 'Arial, sans serif',
        wordWrap: { width: this.maxWidth, useAdvancedWrap: true }
      })
      .setOrigin(0.5);

    this.createMouseInput();
    this.createKeyboardInput();
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle('0x000000', 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
  }

  createMouseInput() {
    this.input.on('pointerup', this.goPlay, this);
  }

  createKeyboardInput() {
    const handleKeyUp = e => {
      switch (e.code) {
        case 'Enter':
          this.goPlay();
          break;
      }
    };

    this.input.keyboard.on('keyup', handleKeyUp, this);
  }

  goPlay() {
    this.scene.start('Menu');
  }
}

export default DemoEnding;
