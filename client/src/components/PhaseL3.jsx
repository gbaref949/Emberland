import React, { useEffect, useRef } from 'react';

const Phase = () => {
  const healthRef = useRef(100);
  useEffect(() => {
    const Phaser = require('phaser');

    const config = {
      type: Phaser.AUTO,
      width: 770, //this is a 77/260 multiplier on the figma
      height: 770, //this is a 77/260 multiplier of the figma
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
    let healthText;

    function preload() {
      this.load.image('player', '../pages/images/editedLogo.png');
    }

    function create() {
      let mult = (77/260);
      healthText = this.add.text(0, 0, `Health: 100`, { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
      player = this.physics.add.sprite(385, 385, 'player');
      player.setScale(mult/0.35);
      player.setCollideWorldBounds(true);
    
      // Create a blue block at the center of the canvas
      let blockValues = [
      [500*mult, 700*mult, 200*mult, 600*mult],
      [800*mult, 500*mult, 400*mult, 200*mult],
      [2100*mult, 700*mult, 200*mult, 600*mult],
      [1800*mult, 500*mult, 400*mult, 200*mult],
      [500*mult, 1900*mult, 200*mult, 600*mult],
      [800*mult, 2100*mult, 400*mult, 200*mult],
      [2100*mult, 1900*mult, 200*mult, 600*mult],
      [1800*mult, 2100*mult, 400*mult, 200*mult],
      [900*mult, 1000*mult, 200*mult, 400*mult],
      [900*mult, 1600*mult, 200*mult, 400*mult],
      [1700*mult, 1000*mult, 200*mult, 400*mult],
      [1700*mult, 1600*mult, 200*mult, 400*mult],
      [1100*mult, 900*mult, 200*mult, 200*mult],
      [1500*mult, 900*mult, 200*mult, 200*mult],
      [1500*mult, 1700*mult, 200*mult, 200*mult],
      [1100*mult, 1700*mult, 200*mult, 200*mult]
    ];
      // const block = this.add.rectangle(500*mult, 700*mult, 200*mult, 600*mult, 0x0000ff);
      // const block2 = this.add.rectangle(800*mult, 500*mult, 400*mult, 200*mult, 0x0000ff);
      // const block3 = this.add.rectangle(2100*mult, 700*mult, 200*mult, 600*mult, 0x0000ff);
      // const block4 = this.add.rectangle(1800*mult, 500*mult, 400*mult, 200*mult, 0x0000ff);
      // const block5 = this.add.rectangle(500*mult, 1900*mult, 200*mult, 600*mult, 0x0000ff);
      // const block6 = this.add.rectangle(800*mult, 2100*mult, 400*mult, 200*mult, 0x0000ff);
      // const block7 = this.add.rectangle(2100*mult, 1900*mult, 200*mult, 600*mult, 0x0000ff);
      // const block8 = this.add.rectangle(1800*mult, 2100*mult, 400*mult, 200*mult, 0x0000ff);
      // const block9 = this.add.rectangle(900*mult, 1000*mult, 200*mult, 400*mult, 0x0000ff);
      // const block10 = this.add.rectangle(900*mult, 1600*mult, 200*mult, 400*mult, 0x0000ff);
      // const block11 = this.add.rectangle(1700*mult, 1000*mult, 200*mult, 400*mult, 0x0000ff);
      // const block12 = this.add.rectangle(1700*mult, 1600*mult, 200*mult, 400*mult, 0x0000ff);
      // const block13 = this.add.rectangle(1100*mult, 900*mult, 200*mult, 200*mult, 0x0000ff);
      // const block14 = this.add.rectangle(1500*mult, 900*mult, 200*mult, 200*mult, 0x0000ff);
      // const block15 = this.add.rectangle(1500*mult, 1700*mult, 200*mult, 200*mult, 0x0000ff);
      // const block16 = this.add.rectangle(1100*mult, 1700*mult, 200*mult, 200*mult, 0x0000ff);
      let blocks = [];
      let temp;
      for(let i=0;i<16;i++){
        temp = this.add.rectangle(blockValues[i][0], blockValues[i][1], blockValues[i][2], blockValues[i][3], 0x0000ff);
        this.physics.add.existing(temp, true);
        this.physics.add.collider(player, temp, handleFallCollision);
        blocks.push(temp);
      }
    
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

    function handleFallCollision() {
      healthRef.current -= 20; // Updating health using ref
      healthText.setText(`Health: ${healthRef.current}`);
      player.x = 385;
      player.y = 385;
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
