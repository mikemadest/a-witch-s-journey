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
    this.state = 'walking';
    this.nextState = 'walking';
    this.inTransition = false;
    this.pauseAttack = false;
    this.attackTarget;
  }

  /**
   * Boss creation, nothing too specific...
   */
  create() {
    this.spr = super.create();
    this.spr = this.spr ? this.spr[0] : {};
    this.spr.setSize(20, 24, true);
    this.spr.body.offset.y = 7;
    this.spawnPoint = { x: this.spr.x, y: this.spr.y };
    return this.spr;
  }

  /**
   * Change state to attack mode
   *
   * @param Sprite player
   * @param Group enemyFireballs
   */
  startAttack(player, enemyFireballs) {
    this.attackTarget = player;
    this.enemyFireballs = enemyFireballs;
    this.isAttackPaused = false;
    this.requireState('attack');
  }

  /**
   * For now just a clone of the player fireball
   *
   * @todo : invoke adds, more fun attacks ?
   */
  throwFireball() {
    if (this.life === 0 || this.pauseAttack || this.nextState !== 'attack') {
      return;
    }
    this.pauseAttack = true;

    // add a sprite to the fireball group
    const fireball = this.enemyFireballs
      .create(0, 0, 'worldAnim', 'fireball-1')
      .setScale(0.25, 0.25)
      .setVelocity(0);
    fireball.setCollideWorldBounds(true);
    fireball.setSize(32, 32, true);
    fireball.allowGravity = false;
    fireball.enableBody();
    fireball.body.setCollideWorldBounds(true);
    fireball.body.onWorldBounds = true;
    fireball.body.offset.y = 25;
    fireball.body.offset.x = 30;
    fireball.anims.play('spr-fireball', true);
    this.ctx.sound.play('fireball');
    const x = this.spr.x;
    const y = this.spr.y;
    fireball.setPosition(x, y + 10);
    this.ctx.physics.moveTo(
      fireball,
      this.attackTarget.x,
      this.attackTarget.y,
      40
    );

    // wait a random time before attacking again
    const newTime = Phaser.Math.RND.between(1000, 3000);
    this.ctx.time.addEvent({
      delay: newTime,
      callback: () => {
        if (this.life === 0 || !this.spr || !this.spr.body) {
          return;
        }
        this.pauseAttack = false;
        this.throwFireball();
      },
      callbackScope: this
    });
  }

  /**
   * Cancel attack state and go back to patrolling
   */
  stopAttack() {
    this.requireState('walking');
  }

  /**
   * Change state to a new one, cancel existing transition
   * @param String newState
   */
  requireState(newState) {
    if (this.life === 0 || !this.spr || !this.spr.body) {
      return;
    }
    this.state = this.nextState;
    this.nextState = newState;
    this.inTransition = false;
  }

  /**
   * Manage boss transition from one state to another
   *
   * @param String current
   * @param String next
   */
  transitionToState(current, next) {
    if (current === next) {
      return;
    }

    // stop patrolling, go toward player and start attacking
    if (next === 'attack') {
      // attack already started, nothing to do
      if (this.inTransition) {
        return;
      }
      this.ctx.physics.moveTo(this.spr, this.attackTarget.x, this.spr.y, 40);

      // just use a timer to stop moving for now
      this.ctx.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.life === 0 || !this.spr || !this.spr.body) {
            console.log('boss dead');
            return;
          }
          this.spr.setVelocityX(0);
          this.spr.setVelocityY(0);
          this.spr.anims.play('spr-pirate-stand', true);
          this.inTransition = false;
          this.state = next;
          this.throwFireball();
        },
        callbackScope: this
      });

      // go back to patrolling
    } else if (next === 'walking') {
      // state in transition, check if we're done
      if (this.inTransition) {
        if (
          Math.round(this.spr.x) === Math.round(this.spawnPoint.x) &&
          Math.round(this.spr.y) === Math.round(this.spawnPoint.y)
        ) {
          this.spr.setVelocityY(0);
          this.spr.setVelocityX(-20);
          this.inTransition = false;
          this.state = next;
        }
        return;
      }

      // go back to spawn point
      this.ctx.physics.moveTo(
        this.spr,
        this.spawnPoint.x,
        this.spawnPoint.y,
        20
      );
    }

    this.inTransition = true;
  }

  /**
   * take into account current velocity to choose the animation to use
   */
  playWalkAnims() {
    if (!this.spr || !this.spr.body) {
      return;
    }
    if (this.spr.body.velocity.x === 0 && this.spr.body.velocity.y === 0) {
      this.spr.anims.play('spr-pirate-stand', true);
    } else if (this.spr.body.velocity.x < 0) {
      this.spr.anims.play('spr-pirate-walkleft', true);
    } else if (this.spr.body.velocity.x > 0) {
      this.spr.anims.play('spr-pirate-walkright', true);
    }
  }

  /**
   * Refresh entity for each frame
   */
  update() {
    if (this.life === 0 || !this.spr || !this.spr.body) {
      return;
    }
    this.transitionToState(this.state, this.nextState);
    this.playWalkAnims();
  }
}
