/**
 * Base class for Player, monsters and PNJ
 */
export default class Entity {
  /**
   * Add entity to spawn point
   *
   * @param ctx
   * @param map
   * @param spawnName
   * @param spriteCache
   * @param spriteKey
   * @param animName
   */
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    this.map = map;
    this.spawnName = spawnName;
    this.ctx = ctx;
    this.spriteCache = spriteCache ? spriteCache : 'worldAnim';
    this.spriteKey = spriteKey;
    this.animName = animName;
  }

  /**
   * Create sprite, add config and animations if needed
   * @returns {Array}
   */
  create() {
    if (typeof this.spawnName === 'object') {
      this.spawnName = [this.spawnName];
    }
    const spawnPoint = this.map.findObject(
      'objects',
      obj => obj.type === this.spawnName
    );
    const spawnSearch = this.findObjectsByType(this.spawnName, this.map);

    // trying feature to simplify this...
    //console.log('this.spawnName = ', this.spawnName, ' => ', spawnSearch);
    //console.log('spawnPoint => ', spawnPoint);

    const entities = [];
    spawnSearch.forEach(entity => {
      entities.push(
        this.addSprite(
          entity,
          this.ctx,
          this.spriteCache,
          this.spriteKey,
          this.animName
        )
      );
    });
    return entities;
  }

  /**
   * Create and configure sprite, play animation if specified
   *
   * @param entity
   * @param ctx
   * @param spriteCache
   * @param spriteKey
   * @param animName
   * @returns {*}
   */
  addSprite(entity, ctx, spriteCache, spriteKey, animName) {
    const tmp = ctx.physics.add.sprite(
      entity.x,
      entity.y,
      spriteCache,
      spriteKey
    );

    this.ctx.physics.world.enable(tmp);
    tmp.enableBody();
    tmp.body.bounce.setTo(1, 1);
    tmp.setCollideWorldBounds(true);
    tmp.onWorldBounds = true;
    tmp.setOrigin(0);
    if (typeof animName === 'number' || typeof animName === 'string') {
      tmp.anims.play(animName, true);
    }

    return tmp;
  }

  /**
   * Player bumped back on dammage
   *
   * @return {type}  description
   */
  bumped(entity) {
    if (entity.body.touching.left) {
      entity.body.velocity.x = 100;
    } else if (entity.body.touching.right) {
      entity.body.velocity.x = -100;
    } else if (entity.body.touching.up) {
      entity.body.velocity.y = 100;
    } else if (entity.body.touching.down) {
      entity.body.velocity.y = -100;
    }

    // simple way to stop it
    this.ctx.time.addEvent({
      delay: 150,
      callback: () => {
        entity.setVelocity(0);
      },
      callbackScope: this,
      repeat: 0,
    });
  }

  /**
   * Apply damage to user
   *
   * display a small animation and decrease life
   * @param onDeath callback action to use only if the player die
   *
   * @todo : improve use of callbacks
   */
  takeDamage(entity, onDeath) {
    // Makes it immune for a short time
    if (entity.immune) return;
    entity.immune = true;

    // play hurt animations
    entity.setTint(0xff0000);
    entity.life--;
    this.refreshLife();

    // handle death if life is at 0
    if (this.isDead(entity, onDeath)) {
      return;
    }

    // small effect to show damage
    this.bumped(entity);

    this.ctx.time.addEvent({
      delay: 500,
      callback: () => {
        entity.clearTint();
        entity.immune = false;
      },
      callbackScope: this,
      repeat: 0,
    });
  }

  /**
   * isDead - check if entity has life left, destroy otherwise
   *
   * @param  {type} entity  description
   * @param  {type} onDeath description
   * @return {type}         description
   */
  isDead(entity, onDeath) {
    if (entity.life <= 0) {
      if (typeof onDeath === 'function') {
        onDeath.call(this.ctx);
      }
      entity.destroy();
      return true;
    }
    return false;
  }

  /**
   * findObjectsByType - helper to use object layer for element spawn point
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
}
