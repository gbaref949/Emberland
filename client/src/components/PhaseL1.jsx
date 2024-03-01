import React, { useEffect, useRef } from 'react';

const Phase = () => {
  const direction = useRef('east'); // Using useRef instead of useState
  useEffect(() => {
    const Phaser = require('phaser');

    const config = {
      type: Phaser.AUTO,
      width: 770,
      height: 770,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);
    let cursors;
    let keys;
    let player, attackSprite;
    let dashAvailable = true;
    let dashTimer;
    let attackCooldown = true;
    let attackCooldownTimer;

    function preload() {
      this.load.image('player', '../pages/images/editedLogo.png');
    }

    function create() {
      player = this.physics.add.sprite(385, 385, 'player');
      player.setScale();
      player.setCollideWorldBounds(true);

      this.input.on('pointerdown', handleAttack);
      // this.input.keyboard.on('keydown-W', handleNorth);
      // this.input.keyboard.on('keydown-D', handleEast);
      // this.input.keyboard.on('keydown-S', handleSouth);
      // this.input.keyboard.on('keydown-A', handleWest);

      cursors = this.input.keyboard.createCursorKeys();
      keys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        SHIFT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      };
    }

    function update() {
      handleMovement();
    }

    function handleMovement() {
      const speed = 150;

      if (cursors.left.isDown || keys.A.isDown) {
        player.setVelocityX(-speed);
        direction.current = 'A';
      } else if (cursors.right.isDown || keys.D.isDown) {
        player.setVelocityX(speed);
        direction.current = 'D';
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown || keys.W.isDown) {
        player.setVelocityY(-speed);
        direction.current = 'W';
      } else if (cursors.down.isDown || keys.S.isDown) {
        player.setVelocityY(speed);
        direction.current = 'S';
      } else {
        player.setVelocityY(0);
      }

      if (keys.SHIFT.isDown && dashAvailable) {
        dashAvailable = false;
        dash();
      }
    }

    function dash() {
      const dashDistance = 50;

      player.x += (cursors.left.isDown || keys.A.isDown) ? -dashDistance :
                  (cursors.right.isDown || keys.D.isDown) ? dashDistance : 0;
      player.y += (cursors.up.isDown || keys.W.isDown) ? -dashDistance :
                  (cursors.down.isDown || keys.S.isDown) ? dashDistance : 0;

      dashTimer = player.scene.time.addEvent({
        delay: 300,
        callback: () => {
          dashTimer.destroy();
          player.scene.time.delayedCall(2700, () => {
            dashAvailable = true;
          });
        },
        callbackScope: this,
        loop: false,
      });
    }

    function handleAttack() {
      if (attackCooldown) {
        attackCooldown = false;
        const attackDistance = 10;
        const attackAngle = player.rotation;
        console.log(direction.current)

        if (direction.current === 'W') {
          const attackX = player.x + attackDistance * Math.cos(attackAngle);
          const attackY = player.y + attackDistance * Math.sin(attackAngle);
          attackSprite = player.scene.add.rectangle(attackX, attackY, 20, 50, 0xFF0000);
          attackSprite.setOrigin(1, 1);
        } else if (direction.current === 'D') {
          const attackX = player.x + attackDistance * Math.cos(attackAngle);
          const attackY = player.y + attackDistance * Math.sin(attackAngle);
          attackSprite = player.scene.add.rectangle(attackX, attackY, 50, 20, 0xFF0000);
          attackSprite.setOrigin(0, 0.5);
        } else if (direction.current === 'S') {
          const attackX = player.x - attackDistance * Math.cos(attackAngle); // Subtracting for downward movement
          const attackY = player.y - attackDistance * Math.sin(attackAngle); // Subtracting for downward movement
          attackSprite = player.scene.add.rectangle(attackX, attackY, 20, 50, 0xFF0000);
          attackSprite.setOrigin(0, 0); // Origin changed for downward movement
        } else if (direction.current === 'A') {
          const attackX = player.x - attackDistance * Math.cos(attackAngle); // Subtracting for leftward movement
          const attackY = player.y - attackDistance * Math.sin(attackAngle); // Subtracting for leftward movement
          attackSprite = player.scene.add.rectangle(attackX, attackY, 50, 20, 0xFF0000);
          attackSprite.setOrigin(1, 0.5); // Origin changed for leftward movement
        }
        

        player.scene.time.delayedCall(300, () => {
          attackSprite.destroy();
        });

        attackCooldownTimer = player.scene.time.addEvent({
          delay: 250, // 0.25 seconds cooldown
          callback: () => {
            attackCooldown = true;
            attackCooldownTimer.destroy();
          },
          callbackScope: this,
          loop: false,
        });
      }
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container"></div>;
};

export default Phase;
