/**
 * Just a short game level :
 * find all coins, buy the staff and defeat monsters !
 **/
class Game extends Phaser.Scene {
  constructor() {
    super({key: "Game", active: false});
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  /**
   * Create level, place living beings and items
   */
  create() {
    this.spritesData = this.cache.json.get('spritesData');
    this.textsData = this.cache.json.get('textsData');

    // main tile map
    this.map = this.add.tilemap("level1");
    const backgroundTile = this.map.addTilesetImage("overworld", "gameTile");
    this.staticLayers = {};
    ['background', 'details', 'details2', 'deco', 'houses'].forEach(
      layerName => this.staticLayers[layerName] = this.map.createStaticLayer(
      layerName,
      backgroundTile,
      0,
      0
    ));

    this.createWorldAnimations();
    this.createWorldInhabitants();

    this.gameMusic = this.sound.add('ambiance');
    this.gameMusic.play();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameraDolly = new Phaser.Geom.Point(this.creatures['player'].spr.x, this.creatures['player'].spr.y);
    this.cameras.main.startFollow(this.cameraDolly);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.handleCollisions();

    // debug
    // this.showDebugInfos();
  }


  /**
   * Refresh player movement, camera and monsters
   *
   * @param time
   * @param delta
   */
  update(time, delta) {
    this.creatures['player'].entity.update();
    this.cameraDolly.x = Math.floor(this.creatures['player'].spr.x);
    this.cameraDolly.y = Math.floor(this.creatures['player'].spr.y);
  }


  /**
   * Debug helper, needs to work on that
   */
  showDebugInfos() {
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
  }

  /**
   * Manage collision : creature taking dammage, etc.
   */
  handleCollisions() {
    this.staticLayers['houses'].setCollisionByExclusion([-1]);
    this.physics.add.collider(this.creatures['player'].spr, this.staticLayers['houses']);
    this.staticLayers['details'].setCollisionByExclusion([-1]);
    this.physics.add.collider(this.creatures['player'].spr, this.staticLayers['details']);
    this.physics.add.collider(this.creatures['player'].spr, this.creatures['oldman'].spr);
    this.physics.add.collider(this.creatures['player'].spr, this.creatures['grandma'].spr);
    this.physics.add.collider(this.creatures['player'].spr, this.creatures['aryl'].spr);
    this.physics.add.collider(this.creatures['player'].spr, this.fountain);

    this.physics.add.overlap(
      this.creatures['player'].spr,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    this.physics.add.collider(
      this.creatures['player'].spr,
      this.creatures['monster1'].spr,
      this.dammagePlayer,
      null,
      this
    );

    this.physics.add.collider(
      this.creatures['player'].spr,
      this.creatures['boss'].spr,
      this.dammagePlayer,
      null,
      this
    );
  }


  /**
   * Temporary creature creation
   *
   * @param name
   * @param type
   * @param spawn
   * @param frame
   * @param anim
   * @returns {Player|Boss|Monster|Pnj}
   */
  getCreature(config) {
    let entity;
    const {type, spawn, frame, animation} = config;

    switch (type) {
      case 'player':
        entity = new Player(this, this.map, spawn, "worldAnim", frame, animation);
        break;
      case 'boss':
        entity = new Boss(this, this.map, spawn, "worldAnim", frame, animation);
        break;
      case 'monster':
        entity = new Monster(this, this.map, spawn, "worldAnim", frame, animation);
        break;
      default:
        entity = new Pnj(this, this.map, spawn, "worldAnim", frame, animation);
    }
    return entity;
  }


  /**
   * Create sprites for everything with "AI" or user control
   *
   * For now we use a hash table to reference them... not optimal
   */
  createWorldInhabitants() {
    this.creatures = {};
    this.spritesData.forEach(config => {
      const entity = this.getCreature(config);
      this.creatures[config.name] = { entity: entity, spr: entity.create() };
    });

    // coins : this is for the quest, can probably improve that later...
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
  }


  /**
   * Create sprite for moving decoration like waterfall
   *
   * Don't know how to better handle level animations YET...
   */
  createWorldAnimations() {

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


    // little bubble to attract attention, may add an "Expression" entity later
    this.talkingEntity = new Entity(
      this,
      this.map,
      "talkingSpawn",
      "worldAnim",
      "talking-1",
      "spr-talking"
    );
    this.talking = this.talkingEntity.create()[0];
    this.time.addEvent({
      delay: 500,
      callback: () => this.talking.visible = !this.talking.visible,
      callbackScope: this,
      repeat: 3
    });
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
    this.sound.play('coin');
    this.creatures['player'].entity.addScore(1);
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
    this.creatures['player'].entity.getHealing();
    heart.disableBody(true, true);
  }


  /**
   *
   * @param player
   * @param enemy
   */
  dammagePlayer(player, enemy) {
    this.sound.play('damage');
    this.creatures['player'].entity.takeDamage(
      () => this.menuMusic.stop()
    );

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

    this.time.addEvent({
      delay: 150,
      callback: () => {
        enemy.body.setVelocity(0);
      },
      callbackScope: this,
      repeat: 0
    });
  }
}
