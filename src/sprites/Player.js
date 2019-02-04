import Entity from './Entity';

/**
 * Player class
 *
 * handle creation, control, status
 */
export default class Player extends Entity {
  constructor(ctx, map, spawnName, spriteCache, spriteKey, animName) {
    super(ctx, map, spawnName, spriteCache, spriteKey, animName);
  }

  /**
   * Initialize player sprite and UI
   **/
  create() {
    this.spr = super.create();
    if (!this.spr || !this.spr[0]) {
      console.error('Player creation was not possible');
      return {};
    }
    this.spr = this.spr[0];
    this.spr.setDepth(1);
    this.spr.score = 0;
    this.spr.life = 3;
    this.spr.speed = 80;
    this.spr.setSize(16, 20, true);
    this.spr.body.offset.y = 2;
    this.createLifeBar();
    this.createScoreText();
    return this.spr;
  }

  /**
   * Refresh player for each frame
   */
  update(pointer) {
    // Stop any previous movement from the last frame
    this.spr.body.setVelocity(0);

    if (!this.handleMouseControls(pointer)) {
      this.handleKeyboardControls();
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.spr.body.velocity.normalize().scale(this.spr.speed);

    // no movement, stop animation / idle animation
    if (this.spr.body.velocity.x === 0 && this.spr.body.velocity.y === 0) {
      this.spr.anims.stop();

      // this.spr.setFrame("hero-walkdown-1");
    }
  }

  /**
   *
   */
  handleKeyboardControls() {
    if (this.ctx.cursors.Q.isDown || this.ctx.cursors.left.isDown) {
      this.spr.setVelocityX(-this.spr.speed);
      this.spr.anims.play('spr-hero-walkleft', true);

      //
    } else if (this.ctx.cursors.D.isDown || this.ctx.cursors.right.isDown) {
      this.spr.setVelocityX(this.spr.speed);
      this.spr.anims.play('spr-hero-walkright', true);
    }

    if (this.ctx.cursors.S.isDown || this.ctx.cursors.down.isDown) {
      this.spr.setVelocityY(this.spr.speed);
      this.spr.anims.play('spr-hero-walkdown', true);

      //
    } else if (this.ctx.cursors.Z.isDown || this.ctx.cursors.up.isDown) {
      this.spr.setVelocityY(-this.spr.speed);
      this.spr.anims.play('spr-hero-walkup', true);
    }
  }

  /**
   *
   * @param pointer
   * @returns {boolean}
   */
  handleMouseControls(pointer) {
    if (pointer) {
      this.ctx.physics.moveTo(this.spr, pointer.worldX, pointer.worldY, 60);
      const diffX = pointer.worldX - this.spr.x;
      const diffY = pointer.worldY - this.spr.y;
      const mostlyUpMove = Math.abs(diffY) > Math.abs(diffX);
      if (mostlyUpMove) {
        if (diffY > 0) {
          this.spr.anims.play('spr-hero-walkdown', true);
        } else {
          this.spr.anims.play('spr-hero-walkup', true);
        }
      } else if (diffX > 0) {
        this.spr.anims.play('spr-hero-walkright', true);
      } else {
        this.spr.anims.play('spr-hero-walkleft', true);
      }
    } else {
      return false;
    }
  }

  attack() {}

  move() {}

  /**
   * Add "heart" life bar to UI
   */
  createLifeBar() {
    const lifePos = { x: 12, y: 28 };
    this.lifeSprites = [];
    for (let i = 0; i < this.spr.life; i++) {
      const tmp = this.ctx.physics.add.sprite(
        lifePos.x + i * 20,
        lifePos.y,
        this.spriteCache,
        'heart-1'
      );
      tmp.setDepth(10); // UI depth
      tmp.setScrollFactor(0);
      tmp.anims.play('spr-heart', true);
      this.lifeSprites.push(tmp);
    }
  }

  /**
   * Add score to UI
   *
   * @note : not really relevant here, more a POC than anything else...
   */
  createScoreText() {
    this.scoreText = this.ctx.add.text(5, 5, 'Score: 0', {
      fontSize: '16px',
      fill: '#fff'
    });
    this.scoreText.setDepth(10); // UI depth
    this.scoreText.setScrollFactor(0);
  }

  /**
   * Increase score value
   * @param val int
   */
  addScore(val) {
    this.spr.score += val;
    this.refreshScore();
  }

  /**
   * Refresh score UI
   */
  refreshScore() {
    this.scoreText.setText('Score: ' + this.spr.score);
  }

  /**
   * Refresh life UI
   */
  refreshLife() {
    this.lifeSprites.forEach((heartSprite, index) => {
      heartSprite.visible = this.spr.life >= index + 1;
    });
  }

  /**
   * die - description
   *
   * @return {type}  description
   */
  isDead(entity, onDeath) {
    if (entity.life <= 0) {
      if (typeof onDeath === 'function') {
        onDeath.call(this.ctx);
      }
      this.ctx.scene.start('GameOver');
      return true;
    }
    return false;
  }

  /**
   * Player collect heart
   *
   * Include for future features
   */
  getHealing() {
    this.spr.life++;
    this.refreshLife();
  }
}
