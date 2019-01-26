
import Entity from './Entity';

/**
 * Player class
 *
 * handle creation, control, status
 *
 * @todo extends sprite or decorator ?
 */
export default class Monster extends Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);
  }

  create() {
    this.spr = super.create();
    this.spr.map(m => {
      m.life = 3;
    });
    return this.spr;
  }

  update() {}

  attack() {}

  move() {}

  refreshLife() {}

  getHealing() {
    //
  }
}
