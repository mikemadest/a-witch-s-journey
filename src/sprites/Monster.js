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
      m.setSize(16, 16, true);
      m.body.offset.y = 7;
    });
    return this.spr;
  }

  update() {

    // no movement, stop animation / idle animation
    this.spr.forEach(m => {
      if (!m.body || m.life === 0) {
        return;
      }
      if (m.body.velocity.x === 0 && m.body.velocity.y === 0) {
        m.setVelocityX(40).setVelocityY(40);
      } else if (m.body.velocity.x < 0) {
        m.anims.play('spr-log-walkleft', true);
      } else if (m.body.velocity.x > 0) {
        m.anims.play('spr-log-walkright', true);
      }
    });
  }

}
