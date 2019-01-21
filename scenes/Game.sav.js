/**
 *
 **/

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  create() {
    this.createBackground();

    //this.map = this.add.tilemap("level1");

    this.map = this.make.tilemap({
      key: "level1"
    });

    const tileset = this.map.addTilesetImage("overworld");
    this.backgroundLayer = this.map.createStaticLayer(
      "background",
      tileset,
      0,
      0
    );
    this.backgroundLayer.setCollisionByProperty({ collides: true });

    //this.detailsLayer = this.map.createStaticLayer("details", tileset, 0, 0);
    this.housesLayer = this.map.createStaticLayer("houses", tileset, 0, 0);
    //this.housesLayer.setCollisionByProperty({ collides: true });
    //this.housesLayer.setCollisionByExclusion([-1]);

    this.txt_progress = new Text(
      this,
      this.CONFIG.centerX,
      100,
      "Game started",
      "preload",
      { x: 0.5, y: 1 }
    );
    this.txt_progress.setScrollFactor(0);

    this.player = this.physics.add.sprite(145, 587, "worldAnim");
    this.player.setCollideWorldBounds(true);

    ["walkdown", "walkup", "walkleft", "walkright"].forEach(animName => {
      const frameNames = this.anims.generateFrameNames("worldAnim", {
        prefix: animName + "-",
        start: 1,
        end: 4
      });
      this.anims.create({
        key: "spr-hero-" + animName,
        frames: frameNames,
        frameRate: 6,
        repeat: -1
      });
    });

    /*this.anims.create({
      key: "spr-hero-idle",
      frames: ["walkdown-1"],
      frame: "walkdown-1",
      frameRate: 1,
      repeat: -1
    });*/
    this.player.anims.play("spr-hero-walkdown");
    this.player.anims.pause();

    //this.physics.add.collider(this.player, this.housesLayer);
    //this.physics.add.collider(this.player, this.housesLayer);
    //this.physics.add.collider(this.player, this.backgroundLayer);

    const camera = this.cameras.main;
    this.cursors = this.input.keyboard.createCursorKeys();
    /*this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: this.cursors.left,
      right: this.cursors.right,
      up: this.cursors.up,
      down: this.cursors.down,
      speed: 0.5
    });*/

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //console.log('this.map.widthInPixels = ', this.map.widthInPixels);
    //this.cameras.main.setBounds(0, 0, 50 * 32, 40 * 32);
    camera.startFollow(this.player);
    //this.cameras.main.setSize(400, 300);
    //this.cameras.main.setViewport(0, 0, 400, 300);

    this.physics.world.createDebugGraphic();

    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    this.backgroundLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    //
  }

  update(time, delta) {
    //this.controls.update(delta);
    this.playerSpeed = 1.3;
    if (this.cursors.left.isDown) {
      this.player.x -= this.playerSpeed;
      this.player.anims.play("spr-hero-walkleft", true);
    } else if (this.cursors.right.isDown) {
      this.player.x += this.playerSpeed;
      this.player.anims.play("spr-hero-walkright", true);
    }

    if (this.cursors.down.isDown) {
      this.player.y += this.playerSpeed;
      this.player.anims.play("spr-hero-walkdown", true);
    } else if (this.cursors.up.isDown) {
      this.player.y -= this.playerSpeed;
      this.player.anims.play("spr-hero-walkup", true);
    }

    //this.cameras.main.scrollX = this.player.x - 300;
    //this.cameras.main.scrollY = this.player.y - 200;*/
    /*if (this.cursors.up.isDown && this.player.body.touching.down) {
      //this.player.setVelocityY(-330);
    }*/
  }

  createBackground() {
    this.bg = this.add.graphics({ x: 0, y: 0 });
    this.bg.fillStyle("0xF4CCA1", 1);
    this.bg.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);

    /*this.map = this.make.tilemap({
      key: "level1",
      tileWidth: 16,
      tileHeight: 16
    });*/
    //console.log(this.map);
    /*let tiles = this.map.addTilesetImage("overworld");
    this.backgroundLayer = this.map.createStaticLayer(
      "background",
      tiles,
      0,
      0
    );
    this.detailsLayer = this.map.createStaticLayer("details", tiles, 0, 0);*/
    //this.detailsLayer.setCollisionByProperty({ collides: true });
    //this.details2Layer = this.map.createStaticLayer('details2', tiles, 0, 0);
    //this.housesLayer = this.map.createStaticLayer("houses", tiles, 0, 0);
    //this.housesLayer.setCollisionByExclusion([ -1 ]);
    //this.housesLayer.setCollisionByProperty({ collides: true });

    //this.physics.world.setCollisionMap('houses');
  }

  render() {
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.backgroundLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  }
}
