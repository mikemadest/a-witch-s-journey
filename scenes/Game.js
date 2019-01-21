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
    this.details2Layer = this.map.createStaticLayer(
      "details2",
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
    //this.housesLayer.setDepth(1);
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

    // player
    this.playerEntity = new Entity(
      this,
      this.map,
      "playerSpawn", // playerSpawn
      "worldAnim",
      "hero-walkdown-1"
    );
    this.player = this.playerEntity.create()[0];

    // old man
    this.oldmanEntity = new Entity(
      this,
      this.map,
      "oldmanSpawn",
      "worldAnim",
      "oldman-walkdown-1" /*,
      "spr-oldman-walkdown"*/
    );
    this.oldman = this.oldmanEntity.create()[0];
    this.physics.add.collider(this.player, this.oldman);

    //talkingSpawn

    this.talkingEntity = new Entity(
      this,
      this.map,
      "talkingSpawn",
      "worldAnim",
      "talking-1",
      "spr-talking"
    );
    this.talking = this.talkingEntity.create()[0];
    this.timedEvent = this.time.addEvent({
      delay: 500,
      callback: this.talkingEvent,
      callbackScope: this,
      repeat: 3
    });

    // grandma
    this.grandmaEntity = new Entity(
      this,
      this.map,
      "grandmaSpawn",
      "worldAnim",
      "grandma-walkdown-1" /*,
      "spr-oldman-walkdown"*/
    );
    this.grandma = this.grandmaEntity.create()[0];
    this.physics.add.collider(this.player, this.grandma);

    // aryl
    this.arylEntity = new Entity(
      this,
      this.map,
      "arylSpawn",
      "worldAnim",
      "aryl-1",
      "spr-aryl"
    );
    this.aryl = this.arylEntity.create()[0];
    this.physics.add.collider(this.player, this.aryl);

    // monster
    this.monster1Entity = new Entity(
      this,
      this.map,
      "monster1Spawn",
      "worldAnim",
      "log-walkdown-1"
    );
    this.monster1 = this.monster1Entity.create()[0];
    this.physics.add.collider(this.player, this.monster1);

    this.monster2Entity = new Entity(
      this,
      this.map,
      "monster2Spawn",
      "worldAnim",
      "pirate-stand-1",
      "spr-pirate-stand"
    );
    this.monster2 = this.monster2Entity.create()[0];
    this.physics.add.collider(this.player, this.monster2);

    // deco
    this.fountainEntity = new Entity(
      this,
      this.map,
      "fountainAnim",
      "worldAnim",
      "fountain-1",
      "spr-fountain"
    );
    this.fountain = this.fountainEntity.create()[0];

    this.waterfallEntity = new Entity(
      this,
      this.map,
      "waterfallAnim",
      "worldAnim",
      "waterfall-1",
      "spr-waterfall"
    );
    this.waterfall = this.waterfallEntity.create()[0];

    this.waterfallEntity = new Entity(
      this,
      this.map,
      "waterfall-bAnim",
      "worldAnim",
      "waterfall-b-1",
      "spr-waterfall-b"
    );
    this.waterfall = this.waterfallEntity.create()[0];
    //this.physics.add.collider(this.player, this.fountain);

    // coins
    this.coins = this.physics.add.group();
    this.coins.enableBody = true;
    this.coinEntity = new Entity(
      this,
      this.map,
      "coin",
      "worldAnim",
      "coin-1",
      "spr-coin"
    );
    this.coinEntity.create().forEach(coin => this.coins.add(coin));

    // collisions

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
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
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

    /*this.physics.world.createDebugGraphic();
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    this.backgroundLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });*/

    //
  }

  talkingEvent() {
    /*this.talking.scaleX *= 0.95;
    this.talking.scaleY *= 0.95;
    this.talking.rotation += 0.04;*/
    this.talking.visible = !this.talking.visible;
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

  render() {
    /*const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.backgroundLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });*/
  }
}
