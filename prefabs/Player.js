/**
 * Player class
 *
 * handle creation, control, status
 */
class Player extends Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);

    this.playerScore = 0;
    this.playerLife = 3;
    this.playerSpeed = 60;
  }

  create() {
    this.spr = super.create();
    return this.spr;
  }

  update() {
    // Stop any previous movement from the last frame
    this.spr.body.setVelocity(0);

    if (this.ctx.cursors.left.isDown) {
      this.spr.setVelocityX(-this.playerSpeed);
      this.spr.anims.play("spr-hero-walkleft", true);

      //
    } else if (this.ctx.cursors.right.isDown) {
      this.spr.setVelocityX(this.playerSpeed);
      this.spr.anims.play("spr-hero-walkright", true);
    }

    if (this.ctx.cursors.down.isDown) {
      this.spr.setVelocityY(this.playerSpeed);
      this.spr.anims.play("spr-hero-walkdown", true);
    } else if (this.ctx.cursors.up.isDown) {
      this.spr.setVelocityY(-this.playerSpeed);
      this.spr.anims.play("spr-hero-walkup", true);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.spr.body.velocity.normalize().scale(this.playerSpeed);
  }

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
