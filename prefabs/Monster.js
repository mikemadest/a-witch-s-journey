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
    this.spr = super.create();
    this.spr = this.spr[0];
    return this.spr;
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
