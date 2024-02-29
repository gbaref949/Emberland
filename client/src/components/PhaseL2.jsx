import React, { useEffect } from 'react';

const Phase = () => {
  useEffect(() => {
    const Phaser = require('phaser');

    const config = {
      type: Phaser.AUTO,
      width: 770, //this is a 0.35 multiplier on the figma
      height: 770, //this is a 0.35 multiplier of the figma
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
    let player;
    let dashAvailable = true;
    let dashTimer;

    function preload() {
      this.load.image('player', '../pages/images/editedLogo.png');
    }

    function create() {
      player = this.physics.add.sprite(385, 385, 'player');
      player.setScale(1);
      player.setCollideWorldBounds(true);
    
      // Create a blue block at the center of the canvas
      const block = this.add.rectangle(210, 245, 140, 210, 0x0000ff);
      const block2 = this.add.rectangle(560, 525, 140, 210, 0x0000ff);
      const block3 = this.add.rectangle(7.5*70, 210, 210, 140, 0x0000ff);
      const block4 = this.add.rectangle(245, 560, 210, 140, 0x0000ff);
      this.physics.add.existing(block, true); // Enable physics and make it immovable
      this.physics.add.existing(block2, true);
      this.physics.add.existing(block3, true);
      this.physics.add.existing(block4, true);
    
      // Define collisions between player and block
      this.physics.add.collider(player, block);
      this.physics.add.collider(player, block2);
      this.physics.add.collider(player, block3);
      this.physics.add.collider(player, block4);
    
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
      } else if (cursors.right.isDown || keys.D.isDown) {
        player.setVelocityX(speed);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown || keys.W.isDown) {
        player.setVelocityY(-speed);
      } else if (cursors.down.isDown || keys.S.isDown) {
        player.setVelocityY(speed);
      } else {
        player.setVelocityY(0);
      }

      // Check for dash input
      if (keys.SHIFT.isDown && dashAvailable) {
        dashAvailable = false;
        dash();
      }
    }

    function dash() {
      const dashDistance = 50;

      // Set the new position (simulate dash)
      player.x += (cursors.left.isDown || keys.A.isDown) ? -dashDistance :
                  (cursors.right.isDown || keys.D.isDown) ? dashDistance : 0;
      player.y += (cursors.up.isDown || keys.W.isDown) ? -dashDistance :
                  (cursors.down.isDown || keys.S.isDown) ? dashDistance : 0;

      // Reset the position after a short duration
      dashTimer = player.scene.time.addEvent({
        delay: 300,
        callback: () => {
          dashTimer.destroy();
          // Start the cooldown timer for dashAvailable
          player.scene.time.delayedCall(2700, () => {
            dashAvailable = true;
          });
        },
        callbackScope: this,
        loop: false,
      });
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container"></div>;
};

export default Phase;
