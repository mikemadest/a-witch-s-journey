
import Entity from './Entity';


/**
 * Player class
 *
 * handle creation, control, status
 */
export default class Pnj extends Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);

    this.life = 3;
    this.speed = 60;
  }

  create() {
    this.spr = super.create();
    this.spr = this.spr ? this.spr[0] : {};
    this.spr.body.immovable = true;
    return this.spr;
  }

  update() {}

  takeDamage() {
    //
  }

  getHealing() {
    //
  }
}
