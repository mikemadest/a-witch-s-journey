import BaseScene from "./BaseScene";
import Entity from "../sprites/Entity";
import Boss from "../sprites/Boss";
import Monster from "../sprites/Monster";
import Player from "../sprites/Player";
import Pnj from "../sprites/Pnj";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.js";

/**
 * Just a short game level :
 * find all coins, buy the staff and defeat monsters !
 **/
class Game extends BaseScene {
  constructor() {
    super({ key: "Game", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  preload() {
    this.load.scenePlugin(
      "AnimatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    );
  }

  /**
   * Create level, place living beings and items
   */
  create() {
    super.create();
    this.spritesData = this.cache.json.get("spritesData");
    this.textsData = this.cache.json.get("textsData");
    this.stylesData = this.cache.json.get("stylesData");

    // just to get it working quickly before having a real spell system
    this.playerHasMagicStaff = false;

    // main tile map
    this.layers = {};
    this.map = this.add.tilemap("level1");
    const backgroundTile = this.map.addTilesetImage(
      "overworld",
      "gameTile",
      16,
      16,
      1,
      2
    );
    //const objectsTile = this.map.addTilesetImage("objects", "objectsTile");
    //const objectsLayer = this.map.createStaticLayer("objects", objectsTile);
    this.layers["belowLayer"] = this.map.createDynamicLayer(
      "belowLayer",
      backgroundTile,
      0,
      0
    );
    this.layers["worldLayer"] = this.map.createDynamicLayer(
      "worldLayer",
      backgroundTile,
      0,
      0
    );
    this.layers["belowdetails"] = this.map.createDynamicLayer(
      "belowdetails",
      backgroundTile,
      0,
      0
    );
    this.layers["detailObstacles"] = this.map.createDynamicLayer(
      "detailObstacles",
      backgroundTile,
      0,
      0
    );
    this.layers["aboveLayer"] = this.map.createDynamicLayer(
      "aboveLayer",
      backgroundTile,
      0,
      0
    );

    this.layers["aboveLayer"].setDepth(2);
    this.sys.animatedTiles.init(this.map);
    this.createWorldAnimations();
    this.createWorldInhabitants();
    this.gameMusic = this.sound.add("ambiance");
    this.gameMusic.setVolume(0.1);
    this.gameMusic.play();

    // the limits are fixed by the map
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // ensure the camera can go everywhere in the map
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // placing camera : we use a dolly to round position
    // and avoid artefacts when moving
    this.cameraDolly = new Phaser.Geom.Point(
      this.creatures["player"].spr.x,
      this.creatures["player"].spr.y
    );
    this.cameras.main.startFollow(this.cameraDolly);

    // basic keyboard control
    this.cursors = {
      ...this.input.keyboard.createCursorKeys(),
      ...this.input.keyboard.addKeys("Z,S,Q,D")
    };

    // space for action
    this.input.keyboard.on("keydown_SPACE", () => this.throwFireball());

    this.actionBar = this.physics.add.sprite(
      30,
      this.CONFIG.height - 20,
      "worldAnim",
      "fireball-4"
    );
    this.actionBar.setScale(0.8, 0.8);
    this.actionBar.setDepth(10); // UI depth
    this.actionBar.setScrollFactor(0);
    this.actionBar.setVisible(false);
    this.actionBar.setInteractive();
    this.actionBar.on("pointerup", () => this.throwFireball());

    // just an experiment / replace with emitter ?
    this.fireballs = this.physics.add.group();
    this.physics.add.collider(
      this.fireballs,
      this.layers["detailObstacles"],
      fireball => this.explodeOnContact(fireball)
    );
    this.physics.add.collider(
      this.fireballs,
      this.layers["worldLayer"],
      fireball => this.explodeOnContact(fireball)
    );

    // destroy fireballs reaching the boundaries
    this.physics.world.on("worldbounds", function(body) {
      var ball = body.gameObject;
      if (ball.frame.name.indexOf("fireball") >= 0) {
        ball.destroy();
      }
    });

    // pretty basic, need to make it reusable
    this.handleCollisions();
    this.showQuest();

    // mouse / touch controls
    const playerSprite = this.creatures["player"].spr;
    this.pointerDownMove = false;
    this.layers["aboveLayer"].setInteractive();
    this.layers["aboveLayer"].on("pointerdown", pointer => {
      this.pointerDownMove = pointer;
    });
    this.layers["aboveLayer"].on("pointermove", pointer => {
      if (this.pointerDownMove) {
        this.pointerDownMove = pointer;
      }
    });
    this.layers["aboveLayer"].on("pointerup", () => {
      this.pointerDownMove = false;
      playerSprite.anims.stop();
      this.creatures["player"].spr.setVelocity(0);
    });

    // debug
    //this.showDebugInfos();

    // Listen for this scene exit
    this.events.once("shutdown", this.shutdown, this);
  }

  /**
   * Refresh player movement, camera and monsters
   *
   * @param time
   * @param delta
   */
  update(time, delta) {
    const player = this.creatures["player"];
    player.entity.update(this.pointerDownMove);
    this.cameraDolly.x = Math.floor(player.spr.x);
    this.cameraDolly.y = Math.floor(player.spr.y);
  }

  shutdown() {
    // When this scene exits, remove the resize handler
    this.sys.game.events.off("resize", this.resize, this);
  }

  /**
   * waitInputToContinue
   *
   * @param  {type} callback description
   * @return {type}          description
   */
  waitInputToContinue(callback) {
    if (typeof callback !== "function") {
      this.input.off("pointerup");
      this.input.keyboard.off("keyup");
      return;
    }
    this.input.on("pointerup", callback, this);
    function handleKeyUp(e) {
      switch (e.code) {
        case "Enter":
          callback();
          break;
      }
    }
    this.input.keyboard.on("keyup", handleKeyUp, this);
  }

  /**
   * Create a basic modal for text displaing
   *
   * @param  {type} text  description
   * @param  {type} x     description
   * @param  {type} y     description
   * @param  {type} width description
   * @return {type}       description
   */
  createModal(text, x, y, width) {
    const lineCount = text.split("\n").length;
    const textSize = 20 * lineCount;
    const padding = 6;
    const w =
      typeof width === "number"
        ? width
        : (0.95 * this.CONFIG.width) / this.cameras.main.zoom;
    let h = textSize + padding * 2;

    x = typeof x === "number" ? x : (this.CONFIG.width - w) / 2;
    if (x < 0) {
      x = this.CONFIG.width - w + x;
    }
    y = typeof y === "number" ? y : this.CONFIG.centerY + 5;

    // quest text
    const questStyle = this.stylesData["questTest"];
    questStyle["wordWrap"] = { width: w - padding, useAdvancedWrap: true };
    const questText = this.add
      .text(x + padding, y + padding, text, questStyle)
      .setLineSpacing(3)
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0)
      .setDepth(10);

    h = questText.displayHeight + padding * 2;

    // modal background
    const boxBg = this.add.graphics({ x: x, y: y });
    boxBg.clear().setScrollFactor(0);
    boxBg.fillStyle("0xFFFFFF", 1);
    boxBg
      .fillRect(0, 0, w, h)
      .setAlpha(0)
      .setDepth(9);

    // modal border
    const boxBorder = this.add.graphics({ x: x, y: y });
    boxBorder.clear().setScrollFactor(0);
    boxBorder.lineStyle(3, "0x4D6592", 1);
    boxBorder
      .strokeRect(0, 0, w, h)
      .setAlpha(0)
      .setDepth(9);

    return [questText, boxBg, boxBorder];
  }

  /**
   * Show quest modal : description, goal
   *
   * @return {type}  description
   */
  showQuest() {
    const modalElements = this.createModal(this.textsData["QUEST_1"]);
    const tween = this.tweens.add({
      targets: modalElements,
      alpha: 1,
      duration: 1000,
      ease: "Cubic",
      easeParams: [1, 1]
    });
    this.waitInputToContinue(() => {
      this.waitInputToContinue(false);
      this.startQuest();
      tween.stop();
      this.tweens.add({
        targets: modalElements,
        alpha: 0,
        duration: 900,
        ease: "Cubic",
        easeParams: [1, 1],
        onComplete: () => {
          tween.stop();
          this.showQuestStatus();
        }
      });
    });
  }


  /**
   * init items and goal infos
   **/
  startQuest() {
    this.questRemainingCoins = 1;
    this.questRequiredCoins = 6;
    this.questEnded = false;

    // coins : this is for the quest, will move to quest manager
    this.coins = this.map.createFromObjects("objects", 1576, {
      key: "worldAnim",
      frame: "coin-1"
    });
    this.coins.forEach(c => this.physics.add.existing(c)); // add physics
    this.anims.play("spr-coin", this.coins);

    this.physics.add.overlap(
      this.creatures["player"].spr,
      this.coins,
      this.collectCoin,
      null,
      this
    );
  }

  /**
   * Display small quest modal for status update
   *
   * @return {type}  description
   */
  showQuestStatus() {
    this.statusModal = this.createModal(
      this.textsData["QUEST_STATUS"] +
        this.questRemainingCoins +
        "  / " +
        this.questRequiredCoins,
      -5,
      5,
      this.CONFIG.width * 0.6
    );
    this.tweens.add({
      targets: this.statusModal,
      alpha: 1,
      duration: 1000,
      ease: "Cubic",
      easeParams: [1, 1],
      delay: 0
    });
  }

  /**
   * Update remaining items in status modal
   *
   * @return {type}  description
   */
  updateQuestStatus() {
    this.statusModal[0].setText(
      this.textsData["QUEST_STATUS"] +
        this.questRemainingCoins +
        "  / " +
        this.questRequiredCoins
    );
  }

  /**
   * collectCoin - action when user overlap a coin
   *
   * @param  {type} player description
   * @param  {type} coin   description
   * @return {type}        description
   */
  collectCoin(player, coin) {
    coin.destroy();
    this.sound.play("coin");
    this.questRemainingCoins--;
    this.updateQuestStatus();
    this.creatures["player"].entity.addScore(1);

    // coins obtained ! Quest is over
    if (this.questRemainingCoins === 0) {
      this.coins.forEach(coin => coin.destroy());
      this.statusModal[0].setText(this.textsData["QUEST_SUCCESS1"]);

      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.statusModal[0].setText(this.textsData["QUEST_SUCCESS2"]);
        },
        callbackScope: this
      });
    }
  }

  /**
   * returnQuest - handle quest completion
   *
   * @return void
   */
  returnQuest() {
    if (this.questEnded || this.questRemainingCoins > 0) {
      // should probably display some message !
      return;
    }

    this.questEnded = true;
    this.tweens.add({
      targets: this.statusModal,
      alpha: 0,
      duration: 1000,
      ease: "Cubic",
      easeParams: [1, 1],
      delay: 0
    });

    const modalElements = this.createModal(this.textsData["QUEST_ENDED"]);
    const tween = this.tweens.add({
      targets: modalElements,
      alpha: 1,
      duration: 1000,
      ease: "Cubic",
      easeParams: [1, 1]
    });

    this.waitInputToContinue(() => {
      tween.stop();
      this.playerHasMagicStaff = true;
      this.actionBar.setVisible(true);
      this.showStaffTuto(modalElements);
    });
  }


/**
 * Display help to use staff spell and throw a fireball
 *
 * @param  {type} modalElements access to existing modal
 * @return void
 */
showStaffTuto(modalElements) {
    const w = (0.95 * this.CONFIG.width) / this.cameras.main.zoom;
    modalElements[0].setText(this.textsData["TUTO_STAFF_MOBILE"]);
    modalElements[1].clear().fillRect(0, 0, w, 72);
    modalElements[2].clear().lineStyle(3, "0x4D6592", 1).strokeRect(0, 0, w, 72);
    this.waitInputToContinue(() => {
      this.waitInputToContinue(false);
      this.startQuest();
      this.tweens.add({
        targets: modalElements,
        alpha: 0,
        duration: 900,
        ease: "Cubic",
        easeParams: [1, 1]
      });
    });
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
    this.layers["worldLayer"].renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    this.layers["detailObstacles"].renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  }

  /**
   * Manage collision : creature taking dammage, etc.
   */
  handleCollisions() {
    this.layers["worldLayer"].setCollisionByExclusion([-1]);
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.layers["worldLayer"]
    );
    this.layers["detailObstacles"].setCollisionByExclusion([-1]);
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.layers["detailObstacles"]
    );
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["grandma"].spr
    );
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["aryl"].spr
    );

    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["monster1"].spr,
      this.dammagePlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.creatures["monster1"].spr,
      this.fireballs,
      (monster, fireball) => {
        fireball.destroy();
        this.sound.play("damage");
        this.creatures["monster1"].entity.takeDamage(monster, this.enemyDeath);
      },
      null,
      this
    );

    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["oldman"].spr,
      this.returnQuest,
      null,
      this
    );

    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["boss"].spr,
      this.dammagePlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.creatures["boss"].spr,
      this.fireballs,
      (boss, fireball) => {
        fireball.destroy();
        this.sound.play("damage");
        this.creatures["boss"].entity.takeDamage(boss, this.enemyDeath);
      },
      null,
      this
    );
  }

  /**
   * Will be used for explosion animation
   *
   * @param  {type} fireball description
   * @return {type}          description
   */
  explodeOnContact(fireball) {
    fireball.destroy();
  }

  /**
   * handle boss, items and all stuff on an enemy's death
   *
   * @return {type}  description
   */
  enemyDeath() {
    this.creatures["player"].entity.addScore(10);
  }

  /**
   * Create and send a fireball
   *
   * @todo fireball should explode on contact
   * @todo need more spells and mobile support
   **/
  throwFireball() {
    if (!this.playerHasMagicStaff) {
      return;
    }

    // create fireball and animate it
    var fireball = this.fireballs
      .create(0, 0, "worldAnim", "fireball-1")
      .setScale(0.25, 0.25)
      .setVelocity(0);
    fireball.setCollideWorldBounds(true);
    fireball.allowGravity = false;
    fireball.enableBody();
    fireball.body.setCollideWorldBounds(true);
    fireball.body.onWorldBounds = true;
    fireball.anims.play("spr-fireball", true);
    this.sound.play("fireball");

    const x = this.creatures["player"].spr.x;
    const y = this.creatures["player"].spr.y;

    // just use player frame to know where he is facing
    const frameName = this.creatures["player"].spr.frame.name;
    if (frameName.indexOf("walkup") >= 0) {
      fireball.setPosition(x + 10, y - 5).setVelocityY(-200);
    } else if (frameName.indexOf("walkdown") >= 0) {
      fireball.setPosition(x + 10, y + 25).setVelocityY(200);
    } else if (frameName.indexOf("walkleft") >= 0) {
      fireball.setPosition(x - 5, y + 10).setVelocityX(-200);
    } else if (frameName.indexOf("walkright") >= 0) {
      fireball.setPosition(x + 20, y + 10).setVelocityX(200);
    }
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
    const { type, spawn, frame, animation } = config;

    switch (type) {
      case "player":
        entity = new Player(
          this,
          this.map,
          spawn,
          "worldAnim",
          frame,
          animation
        );
        break;
      case "boss":
        entity = new Boss(this, this.map, spawn, "worldAnim", frame, animation);
        break;
      case "monster":
        entity = new Monster(
          this,
          this.map,
          spawn,
          "worldAnim",
          frame,
          animation
        );
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
  }

  /**
   * Create sprite for moving decoration like waterfall
   *
   * @note : This will be updated to an animated tile map
   */
  createWorldAnimations() {
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
    this.talking.setDepth(2);
    this.time.addEvent({
      delay: 500,
      callback: () => (this.talking.visible = !this.talking.visible),
      callbackScope: this,
      repeat: 3
    });
  }

  /**
   * collectHeart - increase player life
   *
   * @param  {type} player description
   * @param  {type} heart  description
   * @return {type}        description
   */
  collectHeart(player, heart) {
    this.creatures["player"].entity.getHealing();
    heart.disableBody(true, true);
  }

  /**
   * First damage handling...
   *
   * @param player
   * @param enemy
   */
  dammagePlayer(player, enemy) {
    this.sound.play("damage");
    this.creatures["player"].entity.takeDamage(player);

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

export default Game;
