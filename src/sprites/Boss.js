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
    this.isAttacking = false;
  }

  create() {
    this.spr = super.create();
    this.spr = this.spr ? this.spr[0] : {};
    this.spr.setSize(20, 24, true);
    this.spr.body.offset.y = 7;
    return this.spr;
  }


  attack(player) {
    if (this.isAttacking) {
      return;
    }
    this.isAttacking = true;
    this.ctx.physics.moveTo(this.spr, player.x, this.spr.y, 40);
    
    this.ctx.time.addEvent({
      delay: 500,
      callback: () => {
        console.log('attack !');
        this.spr.setVelocityX(0);
        this.spr.anims.play("spr-pirate-stand", true);
      },
      callbackScope: this,
    });
  }

  stopAttack() {
    this.isAttacking = false;
  }


  /**
   * Refresh player for each frame
   */
  update(pointer) {

    if (this.isAttacking) {
      return;
    }

    // no movement, stop animation / idle animation
    if (this.spr.body.velocity.x === 0 && this.spr.body.velocity.y === 0) {
      //this.spr.anims.stop();
      this.spr.anims.play("spr-pirate-stand", true);

    } else if (this.spr.body.velocity.x < 0) {
      this.spr.anims.play("spr-pirate-walkleft", true);

    } else if (this.spr.body.velocity.x > 0) {
      this.spr.anims.play("spr-pirate-walkright", true);
    }
  }

}
