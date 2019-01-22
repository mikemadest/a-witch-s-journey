class Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    this.map = map;
    this.spawnName = spawnName;
    this.ctx = ctx;
    this.spriteCache = spriteCache ? spriteCache : "worldAnim";
    this.spriteKey = spriteKey;
    this.animName = animName;
  }

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

  addSprite(entity, ctx, spriteCache, spriteKey, animName) {
    const tmp = ctx.physics.add.sprite(
      entity.x,
      entity.y,
      spriteCache,
      spriteKey
    );

    tmp.enableBody();
    tmp.body.bounce.setTo(0.9, 0.9);
    tmp.setCollideWorldBounds(true);
    tmp.onWorldBounds = true;
    tmp.setOrigin(0);

    if (typeof animName === "number" || typeof animName === "string") {
      tmp.anims.play(animName, true);
    }

    return tmp;
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
}
