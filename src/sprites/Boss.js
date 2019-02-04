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
    this.state = 'walking';
    this.nextState = 'walking';
    this.inTransition = false;
    this.attackTarget;
  }

  create() {
    this.spr = super.create();
    this.spr = this.spr ? this.spr[0] : {};
    this.spr.setSize(20, 24, true);
    this.spr.body.offset.y = 7;
    return this.spr;
  }

  attack(player) {
    /*if (this.isAttacking) {
      return;
    }*/
    this.attackTarget = player
    //this.isAttacking = true;
    this.nextState = 'attack';
    console.log('attack !');
    /*this.ctx.physics.moveTo(this.spr, player.x, this.spr.y, 40);
    
    this.ctx.time.addEvent({
      delay: 500,
      callback: () => {
        console.log('attack !');
        this.spr.setVelocityX(0);
        this.spr.anims.play("spr-pirate-stand", true);
      },
      callbackScope: this,
    });*/
  }

  startAttack() {
    this.nextState = 'attack';
  }
  stopAttack() {
    console.log('stop attack');
    this.nextState = 'walking';
  }

  transitionToState(current, next) {
    if (this.inTransition || current === next) {
      return;
    }

    this.inTransition = true;
    if (next === 'attack') {
      this.ctx.physics.moveTo(this.spr, this.attackTarget.x, this.spr.y, 40);
      this.ctx.time.addEvent({
        delay: 500,
        callback: () => {
          console.log('attack engaged !');
          this.inTransition = false;
          this.spr.setVelocityX(0);
          this.spr.anims.play("spr-pirate-stand", true);
        },
        callbackScope: this,
      });

    } else if (next === 'walking') {
      this.stopAttack();
      this.spr.setVelocityX(-20);
      this.inTransition = false;
    }
    this.state = next;
  }

  /**
   * Refresh entity for each frame
   */
  update(pointer) {
    this.transitionToState(this.state, this.nextState);

    if (this.state === 'walking') {
      // no movement, stop animation / idle animation
      if (this.spr.body.velocity.x === 0 && this.spr.body.velocity.y === 0) {
        //this.spr.anims.stop();
        this.spr.anims.play('spr-pirate-stand', true);
      } else if (this.spr.body.velocity.x < 0) {
        this.spr.anims.play('spr-pirate-walkleft', true);
      } else if (this.spr.body.velocity.x > 0) {
        this.spr.anims.play('spr-pirate-walkright', true);
      }
    }
  }
}
