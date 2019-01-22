/**
 * Player class
 *
 * handle creation, control, status
 */
class Monster extends Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);
  }

  create() {
    return super.create();
  }

  update() {}

  attack() {}

  move() {}

  bumped() {}

  refreshLife() {}

  takeDamage() {
    //
  }

  getHealing() {
    //
  }
}
