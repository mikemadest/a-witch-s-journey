/**
 * Base class for Player, monsters and PNJ
 */
class Entity {

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
    this.spriteCache = spriteCache ? spriteCache : "worldAnim";
    this.spriteKey = spriteKey;
    this.animName = animName;
  }

  /**
   * Create sprite, add config and animations if needed
   * @returns {Array}
   */
  create() {
    if (typeof this.spawnName === "object") {
      this.spawnName = [this.spawnName];
    }
    const spawnSearch = this.findObjectsByType(this.spawnName, this.map);
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

    if (typeof animName === "number" || typeof animName === "string") {
      tmp.anims.play(animName, true);
    }

    return tmp;
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
