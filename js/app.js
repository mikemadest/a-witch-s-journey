/**
 *
 **/

const App = function() {
  "use strict";

  this.VERSION = "0.0.1";
  this.IS_DEV = true;
};

App.prototype.start = function() {
  "use strict";

  // Scenes*
  const scenes = [];
  scenes.push(Boot);
  scenes.push(Preload);
  scenes.push(Menu);
  scenes.push(Game);
  scenes.push(GameOver);

  // Game config
  this.config = {
    type: Phaser.AUTO,
    parent: "phaser-app",
    title: "A Witch's Journey",
    url: "",
    width: 400,
    height: 400,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: scenes,
    pixelArt: true,
    backgroundColor: "0x000000"
  };

  // Create game App
  const game = new Phaser.Game(this.config);

  // Globals
  game.IS_DEV = this.IS_DEV;
  game.VERSION = this.VERSION;
  game.URL = "";
  game.CONFIG = {
    width: this.config.width,
    height: this.config.height,
    centerX: Math.round(this.config.width / 2),
    centerY: Math.round(this.config.height / 2),
    tile: 32
  };

  // Sound
  game.sound_on = true;
};
