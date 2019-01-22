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
    this.details2Layer = this.map.createStaticLayer(
      "deco",
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

    this.playerScore = 0;
    this.playerLife = 3;
    this.enemyLife = {
      monster1: 2,
      monster2: 5
    };
    this.scoreText = this.add.text(5, 5, "Score: 0", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.scoreText.setScrollFactor(0);

    const playerLifePos = { x: 12, y: 28 };
    this.playerLifeSprites = [];
    for (let i = 0; i < this.playerLife; i++) {
      const tmp = this.physics.add.sprite(
        playerLifePos.x + i * 20,
        playerLifePos.y,
        "worldAnim",
        "heart-1"
      );
      tmp.setScrollFactor(0);
      tmp.anims.play("spr-heart", true);
      this.playerLifeSprites.push(tmp);
    }

    this.refreshPlayerLife();

    // player
    this.playerEntity = new Entity(
      this,
      this.map,
      "playerSpawn",
      "worldAnim",
      "hero-walkdown-1"
    );
    this.player = this.playerEntity.create()[0];
    this.housesLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.housesLayer);
    this.detailsLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.detailsLayer);

    // old man
    this.oldmanEntity = new Entity(
      this,
      this.map,
      "oldmanSpawn",
      "worldAnim",
      "oldman-walkdown-1"
    );
    this.oldman = this.oldmanEntity.create()[0];
    this.oldman.body.immovable = true;
    this.physics.add.collider(this.player, this.oldman);

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
      "grandma-walkdown-1"
    );
    this.grandma = this.grandmaEntity.create()[0];
    this.grandma.body.immovable = true;
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
    this.aryl.body.immovable = true;
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

    this.monster2Entity = new Entity(
      this,
      this.map,
      "monster2Spawn",
      "worldAnim",
      "pirate-stand-1",
      "spr-pirate-stand"
    );
    this.monster2 = this.monster2Entity.create()[0];
    this.monster2.body.immovable = true;

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
    this.fountain.body.immovable = true;
    this.physics.add.collider(this.player, this.fountain);

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
    this.physics.world.enable([this.player, this.monster1, this.monster2]);
    this.player.body.setBounce(1, 1).setCollideWorldBounds(true);
    this.monster1.body.setBounce(1, 1).setCollideWorldBounds(true);

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.monster1,
      this.dammagePlayer,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.monster2,
      this.dammagePlayer,
      null,
      this
    );

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
    this.talking.visible = !this.talking.visible;
  }

  refreshPlayerLife() {
    this.playerLifeSprites.forEach((heartSprite, index) => {
      heartSprite.visible = this.playerLife >= index + 1;
    });
  }

  update(time, delta) {
    this.playerSpeed = 60;

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.anims.play("spr-hero-walkleft", true);

      //
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play("spr-hero-walkright", true);
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
      this.player.anims.play("spr-hero-walkdown", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
      this.player.anims.play("spr-hero-walkup", true);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(this.playerSpeed);
    this.cameraDolly.x = Math.floor(this.player.x);
    this.cameraDolly.y = Math.floor(this.player.y);
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
   * collectHeart - increase player life
   *
   * @param  {type} player description
   * @param  {type} heart  description
   * @return {type}        description
   */
  collectHeart(player, heart) {
    this.playerLife++;
    this.refreshPlayerLife();
    heart.disableBody(true, true);
  }

  dammagePlayer(player, enemy) {
    if (player.immune) return;

    player.immune = true;

    // play hurt animations
    player.setTint(0xff0000);
    player.setBounce(1, 1);
    this.playerLife--;
    this.refreshPlayerLife();
    if (this.playerLife <= 0) {
      this.scene.start("GameOver");
    }

    // Knocks back enemy after colliding
    if (enemy.body.touching.left) {
      enemy.body.velocity.x = 150;
    } else if (enemy.body.touching.right) {
      enemy.body.velocity.x = -150;
    } else if (enemy.body.touching.up) {
      enemy.body.velocity.y = 150;
    } else if (enemy.body.touching.down) {
      enemy.body.velocity.y = -150;
    }

    if (player.body.touching.left) {
      player.body.velocity.x = 150;
    } else if (player.body.touching.right) {
      player.body.velocity.x = -150;
    } else if (player.body.touching.up) {
      player.body.velocity.y = 150;
    } else if (player.body.touching.down) {
      player.body.velocity.y = -150;
    }

    // Makes the player immune for 0.5 second and then resets it

    this.time.addEvent({
      delay: 150,
      callback: () => {
        enemy.body.setVelocity(0);
        player.clearTint();
      },
      callbackScope: this,
      repeat: 0
    });

    this.time.addEvent({
      delay: 500,
      callback: () => {
        player.immune = false;
      },
      callbackScope: this,
      repeat: 0
    });
  }
}
