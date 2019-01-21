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
    // main tile map

    this.map = this.add.tilemap("level1");
    const backgroundTile = this.map.addTilesetImage("overworld", "gameTile");
    const objectsTile = this.map.addTilesetImage("objects", "objectsTile");
    const characterTile = this.map.addTilesetImage(
      "character",
      "charactersTile"
    );
    this.backgroundLayer = this.map.createStaticLayer(
      "background",
      backgroundTile,
      0,
      0
    );
    //this.backgroundLayer.setCollisionByProperty({collides: true});

    this.detailsLayer = this.map.createStaticLayer(
      "details",
      backgroundTile,
      0,
      0
    );
    this.housesLayer = this.map.createStaticLayer(
      "houses",
      backgroundTile,
      0,
      0
    );
    //this.housesLayer.enableBody = true;
    //this.housesLayer.setCollisionByProperty({ collides: true });
    //this.housesLayer.setCollisionByExclusion([-1]);
    //this.housesLayer.setCollisionBetween(1, 200);
    //this.map.setCollisionBetween(1, 999, true, 'houses');

    /*var overlapObjects = this.map.getObjectLayer('houses')['objects']; //my Object layer was called Overlap
    let overlapObjectsGroup = this.game.physics.add.staticGroup({ });
    let i = 0;
    overlapObjects.forEach(object => {
      let obj = overlapObjectsGroup.create(object.x, object.y, 'grass');
      obj.setScale(object.width/16, object.height/16); //my tile size was 32
      obj.setOrigin(0); //the positioning was off, and B3L7 mentioned the default was 0.5
      obj.body.width = object.width; //body of the physics body
      obj.body.height = object.height;
    });
    overlapObjectsGroup.refresh(); //physics body needs to refresh
    console.log(overlapObjectsGroup);
    //this.game.physics.add.overlap(this.player, overlapObjectsGroup, this.test, null, this);*/

    // player @todo move to own class

    this.player = this.physics.add.sprite(145, 587, "worldAnim", "walkdown-1");
    this.player.enableBody();
    this.player.body.bounce.setTo(0.9, 0.9);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;

    // coins
    this.coins = this.physics.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType("coin", this.map);
    result.forEach(function(element) {
      const tmp = this.physics.add.sprite(
        element.x,
        element.y,
        "coinanim",
        132
      );
      tmp.anims.play("spr-coin", true);
      this.coins.add(tmp);
    }, this);

    // collisions

    this.housesLayer.setDepth(1);
    // 127, 128, 129, 130, 131
    //var testHouses = this.map.createFromObjects('houses', 4, { key: 'coinanim' });
    //this.housesLayer.setCollision(0, false);
    //this.housesLayer.setCollision(169, true);
    //this.physics.add.collider(this.player, this.housesLayer);
    //this.physics.add.overlap(this.player, this.housesLayer, this.overHouse, null, this);
    //this.physics.add.collider(this.player, this.coins);
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    //this.map.setCollisionBetween(1, 200);
    //this.housesLayer.resizeWorld();
    //this.housesLayer.debug = true;

    this.cursors = this.input.keyboard.createCursorKeys();

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    //camera.startFollow(this.player);
    this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.cameraDolly);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.playerScore = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.scoreText.setScrollFactor(0);

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

  overHouse() {
    console.log("over a house !");
  }

  /**
   * collectCoin - action when user overlap a coin
   *
   * @param  {type} player description
   * @param  {type} coin   description
   * @return {type}        description
   */
  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.playerScore++;
    this.scoreText.setText("Score: " + this.playerScore);
    if (this.coins.countActive(true) === 0) {
      // toutes les pièces ont été trouvées : première quête terminée !!
    }
  }

  /**
   * findObjectsByType - helper to use object layer for element position
   *
   * @param  {type} type description
   * @param  {type} map  description
   * @return {type}      description
   */
  findObjectsByType(type, map) {
    var result = [];
    if (!map || !map.objects || !map.objects[0].objects) {
      return result;
    }
    map.objects[0].objects.forEach(element => {
      if (element.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }

  render() {
    /*const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.backgroundLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });*/
  }
}
