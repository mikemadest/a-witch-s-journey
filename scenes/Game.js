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

    this.detailsLayer = this.map.createStaticLayer("details", backgroundTile, 0, 0);
    this.housesLayer = this.map.createStaticLayer("houses", backgroundTile, 0, 0);
    //this.housesLayer.enableBody = true;
    //this.housesLayer.setCollisionByProperty({ collides: true });
    //this.housesLayer.setCollisionByExclusion([-1]);





    // player @todo move to own class

    this.player = this.physics.add.sprite(145, 587, "worldAnim", 'walkdown-1');
    this.player.enableBody();
    this.player.body.bounce.setTo(0.9, 0.9);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
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


    // coins

    this.anims.create({
      key: "spr-coin",
      frames: this.anims.generateFrameNumbers('coinanim', {frames: [132, 133, 134, 135] }),
      frameRate: 6,
      repeat: -1
    });

    this.coins = this.physics.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType("coin", this.map);
    result.forEach(function(element) {
      const tmp = this.physics.add.sprite(element.x, element.y, "coinanim", 132);
      tmp.anims.play("spr-coin", true);
      this.coins.add(tmp);
    }, this);




    // collisions

    this.physics.add.collider(this.player, this.housesLayer);





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












  findObjectsByType(type, map) {
    var result = [];

    console.log('map = ', map);

    if (map && map.objects && map.objects[0].objects) {
      map.objects[0].objects.forEach(element => {
        if (element.type === type) {
          element.y -= map.tileHeight;
          result.push(element);
        }
      });
      return result;
    }
    return result;
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
