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
    this.spr = this.spr[0];
    this.createLifeBar();
    this.createScoreText();
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


  createLifeBar() {
    const playerLifePos = { x: 12, y: 28 };
    this.playerLifeSprites = [];
    for (let i = 0; i < this.playerLife; i++) {
      const tmp = this.ctx.physics.add.sprite(
        playerLifePos.x + i * 20,
        playerLifePos.y,
        this.spriteCache,
        "heart-1"
      );
      tmp.setScrollFactor(0);
      tmp.anims.play("spr-heart", true);
      this.playerLifeSprites.push(tmp);
    }
  }


  createScoreText() {
    this.scoreText = this.ctx.add.text(5, 5, "Score: 0", {
      fontSize: "16px",
      fill: "#fff"
    });
    this.scoreText.setScrollFactor(0);
  }

  addScore(val) {
    this.playerScore += val;
    this.refreshScore();
  }

  refreshScore() {
    this.scoreText.setText("Score: " + this.playerScore);
  }

  refreshLife() {
    this.playerLifeSprites.forEach((heartSprite, index) => {
      heartSprite.visible = this.playerLife >= index + 1;
    });
  }

  takeDamage() {
    if (this.spr.immune) return;
    this.spr.immune = true;

    // play hurt animations
    this.spr.setTint(0xff0000);
    this.spr.setBounce(1, 1);
    this.playerLife--;
    this.refreshLife();
    if (this.playerLife <= 0) {
      this.ctx.scene.start("GameOver");
    }

    if (this.spr.body.touching.left) {
      this.spr.body.velocity.x = 150;
    } else if (this.spr.body.touching.right) {
      this.spr.body.velocity.x = -150;
    } else if (this.spr.body.touching.up) {
      this.spr.body.velocity.y = 150;
    } else if (this.spr.body.touching.down) {
      this.spr.body.velocity.y = -150;
    }

    // Makes the player immune for 0.5 second and then resets it

    this.ctx.time.addEvent({
      delay: 150,
      callback: () => {
        this.spr.clearTint();
      },
      callbackScope: this,
      repeat: 0
    });

    this.ctx.time.addEvent({
      delay: 500,
      callback: () => {
        this.spr.immune = false;
      },
      callbackScope: this,
      repeat: 0
    });
  }

  getHealing() {
    this.playerLife++;
    this.refreshLife();
  }
}
