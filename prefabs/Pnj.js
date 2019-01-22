/**
 * Player class
 *
 * handle creation, control, status
 */
class Pnj extends Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);
  }

  create() {
    return super.create();
  }

  update() {}

  takeDamage() {
    //
  }

  getHealing() {
    //
  }
}
