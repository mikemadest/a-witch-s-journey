/**
 *
 **/

class Game extends Phaser.Scene {
  constructor() {
    super({key: "Game", active: false});
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  create() {

    // main tile map

    this.map = this.add.tilemap("level1");
    const backgroundTile = this.map.addTilesetImage('overworld', 'gameTile');
    const objectsTile = this.map.addTilesetImage('objects', 'objectsTile');
    const characterTile = this.map.addTilesetImage('character', 'charactersTile');
    this.backgroundLayer = this.map.createStaticLayer(
      "background",
      backgroundTile,
      0,
      0
    );
    //this.backgroundLayer.setCollisionByProperty({collides: true});

    this.housesLayer = this.map.createStaticLayer("houses", backgroundTile, 0, 0);
    //this.housesLayer.setCollisionByProperty({ collides: true });
    //this.housesLayer.setCollisionByExclusion([-1]);





    // player @todo move to own class

    this.player = this.physics.add.sprite(145, 587, "worldAnim", 'walkdown-1');
    this.player.enableBody();
    this.player.body.bounce.setTo(0.9, 0.9);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;

    //this.player.setSize(16, 32);
    console.log('getBounds => ', this.player.getBounds());

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



    // collisions

    //this.physics.add.collider(this.player, this.housesLayer);





    this.cursors = this.input.keyboard.createCursorKeys();

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //camera.startFollow(this.player);
    this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.cameraDolly);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


    // debug

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
    this.cameraDolly.x = Math.floor(this.player.x);
    this.cameraDolly.y = Math.floor(this.player.y);
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
