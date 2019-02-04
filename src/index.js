import 'phaser';
import Boot from './scenes/Boot';
import Preload from './scenes/Preload';
import Menu from './scenes/Menu';
import Intro from './scenes/Intro';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

let width = 300;
let height = 300;
const ratio = window.innerWidth / window.innerHeight;

// landscape, fit height
if (ratio > 0.6) {
  width = (height * window.innerWidth) / window.innerHeight;

  // portrait, fit width
} else {
  height = (width * window.innerHeight) / window.innerWidth;
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-app',
  title: 'A Witch\'s Journey',
  url: '',
  width: width,
  height: height,
  physics: {
    default: 'arcade',
    arcade: {gravity: { y: 0 }}
  },
  scene: [ Boot, Preload, Menu, Intro, Game, GameOver ],
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '0x000000'
};

const game = new Phaser.Game(config);

// Globals
game.IS_DEV = true;
game.VERSION = '1.0.7';
game.LANGUAGE = 'en';
game.URL = '';
game.CONFIG = {
  width: config.width,
  height: config.height,
  language: game.LANGUAGE,
  centerX: Math.round(config.width / 2),
  centerY: Math.round(config.height / 2),
  tile: 32
};

window.onresize = function() {
  game.events.emit('resize');
};
