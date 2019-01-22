/**
 * Just a short game level :
 * find all coins, buy the staff and defeat monsters !
 **/
class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  /**
   * Create level, place living beings and items
   */
  create() {
    this.spritesData = this.cache.json.get("spritesData");
    this.textsData = this.cache.json.get("textsData");

    // main tile map
    this.map = this.add.tilemap("level1");
    const backgroundTile = this.map.addTilesetImage("overworld", "gameTile");
    this.staticLayers = {};
    ["background", "details", "details2", "deco", "houses"].forEach(
      layerName =>
        (this.staticLayers[layerName] = this.map.createStaticLayer(
          layerName,
          backgroundTile,
          0,
          0
        ))
    );

    this.questRemainingCoins = 1;
    this.questRequiredCoins = 1;
    this.questEnded = false;
    this.createWorldAnimations();
    this.createWorldInhabitants();

    this.gameMusic = this.sound.add("ambiance");
    this.gameMusic.setVolume(0.1);
    this.gameMusic.play();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameraDolly = new Phaser.Geom.Point(
      this.creatures["player"].spr.x,
      this.creatures["player"].spr.y
    );
    this.cameras.main.startFollow(this.cameraDolly);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.handleCollisions();

    this.showQuest();

    // debug
    // this.showDebugInfos();
  }

  createModal(text, x, y, width) {
    const lineCount = text.split("\n").length;
    const textSize = 20 * lineCount;
    const padding = 15;
    const w = typeof width === "number" ? width : 0.95 * this.CONFIG.width;
    const h = textSize + padding * 2;

    x = typeof x === "number" ? x : (this.CONFIG.width - w) / 2;
    if (x < 0) {
      x = this.CONFIG.width - w + x;
    }
    y = typeof y === "number" ? y : this.CONFIG.centerY + 5;
    const boxBg = this.add.graphics({ x: x, y: y });
    boxBg.clear().setScrollFactor(0);
    boxBg.fillStyle("0xFFFFFF", 1);
    boxBg.fillRect(0, 0, w, h).setAlpha(0);

    const boxBorder = this.add.graphics({ x: x, y: y });
    boxBorder.clear().setScrollFactor(0);
    boxBorder.lineStyle(4, "0x4D6592", 1);
    boxBorder.strokeRect(0, 0, w, h).setAlpha(0);

    const questText = this.add
      .text(x + padding, y + padding, text, {
        fill: "#000",
        fontSize: "16px",
        fontFamily: "Verdana, sans serif"
      })
      .setLineSpacing(3)
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0);

    return [questText, boxBg, boxBorder];
  }

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
   * Refresh player movement, camera and monsters
   *
   * @param time
   * @param delta
   */
  update(time, delta) {
    this.creatures["player"].entity.update();
    this.cameraDolly.x = Math.floor(this.creatures["player"].spr.x);
    this.cameraDolly.y = Math.floor(this.creatures["player"].spr.y);
  }

  /**
   * waitInputToContinue
   *
   * @param  {type} callback description
   * @return {type}          description
   */
  waitInputToContinue(callback) {
    if (typeof callback !== 'function') {
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
    this.staticLayers["houses"].setCollisionByExclusion([-1]);
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.staticLayers["houses"]
    );
    this.staticLayers["details"].setCollisionByExclusion([-1]);
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.staticLayers["details"]
    );
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["grandma"].spr
    );
    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["aryl"].spr
    );
    this.physics.add.collider(this.creatures["player"].spr, this.fountain);

    this.physics.add.overlap(
      this.creatures["player"].spr,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    this.physics.add.collider(
      this.creatures["player"].spr,
      this.creatures["monster1"].spr,
      this.dammagePlayer,
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
      callback: () => (this.talking.visible = !this.talking.visible),
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
    this.sound.play("coin");
    this.questRemainingCoins--;
    this.creatures["player"].entity.addScore(1);
    if (this.questRemainingCoins === 0) {
      // coins obtained ! Quest is over
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

  returnQuest() {
    if (!this.questEnded && this.questRemainingCoins === 0) {
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
        this.waitInputToContinue(false);
        this.tweens.add({
          targets: modalElements,
          alpha: 0,
          duration: 900,
          ease: "Cubic",
          easeParams: [1, 1]
        });
      });
    }
  }

  /**
   *
   * @param player
   * @param enemy
   */
  dammagePlayer(player, enemy) {
    this.sound.play("damage");
    this.creatures["player"].entity.takeDamage(() => this.menuMusic.stop());

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
