import Monster from './Monster';

/**
 * Player class
 *
 * handle creation, control, status
 */
export default class Boss extends Monster {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);
    this.life = 7;
    this.speed = 60;
  }

  create() {
    this.spr = super.create();
    this.spr = this.spr ? this.spr[0] : {};
    this.spr.setSize(20, 24, true);
    this.spr.body.offset.y = 7;
    return this.spr;
  }
}
