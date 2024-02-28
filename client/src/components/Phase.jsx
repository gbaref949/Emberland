import React, { useEffect } from 'react';

const Phase = () => {
  useEffect(() => {
    const Phaser = require('phaser');

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
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

    function preload() {
      // Load game assets here
      this.load.image('player', '../pages.images/editedLogo.png');
    }

    function create() {
      // Set up game objects and logic here
      player = this.physics.add.sprite(400, 300, 'player');
      player.setCollideWorldBounds(true);
      cursors = this.input.keyboard.createCursorKeys();
      keys = this.input.keyboard.addKeys('W,S,A,D');
    }

    function update() {
      // Update game state here
      if (cursors.left.isDown || keys.A.isDown) {
        player.setVelocityX(-200);
      } else if (cursors.right.isDown || keys.D.isDown) {
        player.setVelocityX(200);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown || keys.W.isDown) {
        player.setVelocityY(-200);
      } else if (cursors.down.isDown || keys.S.isDown) {
        player.setVelocityY(200);
      } else {
        player.setVelocityY(0);
      }
    }

    return () => {
      // Cleanup when the component is unmounted
      game.destroy(true);
    };
  }, []);

  return <div id="game-container"></div>;
};

export default Phase;
