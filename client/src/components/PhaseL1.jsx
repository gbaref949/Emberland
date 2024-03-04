import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Phase = () => {
  const direction = useRef('W'); // Using useRef instead of useState
  const healthRef = useRef(100);
  const navigate = useNavigate();

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
    let cursors, keys, dashTimer, healthText, regen, intervalId;
    let player, block1, attackSprite;
    let dashAvailable = true;
    let inDash = false;
    let attackCooldown = true;
    let attackCooldownTimer;
    const newEnemies = [];

    function preload() {
      this.load.image('player', '../pages/images/editedLogo.png');
    }

    function create() {
      healthText = this.add.text(0, 0, `Health: 100`, { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
      player = this.physics.add.sprite(385, 385, 'player');
      player.setScale();
      player.setCollideWorldBounds(true);

      // attackSprite = player.scene.add.rectangle(player.x + 10 * Math.cos(player.rotation), player.y + 10 * Math.sin(player.rotation), 20, 20, 0xFF0000);
      // attackSprite.setOrigin(1, 1);

      generateEnemies(this, player);

      // enemy = this.physics.add.sprite(600, 600, 'enemy');
      // enemy.setCollideWorldBounds(true);
      // player.scene.physics.world.enable(enemy, Phaser.Physics.Arcade.Sprite);

      // this.physics.add.collider(player, enemy, handlePlayerCollision);

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

      regen = setInterval(()=>{
        console.log(healthRef.current)
        if(healthRef.current <= 95){
          healthRef.current += 5;
          healthText.setText(`Health: ${healthRef.current}`);
        }else if(healthRef.current > 95){
          healthRef.current = 100;
          healthText.setText(`Health: ${healthRef.current}`);
        }
      }, 5000);
    }

    function update() {
      if(!inDash) {
        handleMovement();
      }
      if (healthRef.current <= 0) {
        game.destroy(true);
        clearInterval(regen);
        clearInterval(intervalId);
        navigate('/gameOver');
      }
      // trackPlayerWithCollision(enemy, player);
    }

    function generateEnemies(scene) {
          
      // Generate enemies
      let counter = 0;

      // Generate enemies at regular intervals
      intervalId = setInterval(() => {
        let x = Phaser.Math.Between(0, 770);
        let y = Phaser.Math.Between(0, 770);

        // Check for minimum distance from the player
        while (Phaser.Math.Distance.Between(player.x, player.y, x, y) < 100) {
          x = Phaser.Math.Between(0, 770);
          y = Phaser.Math.Between(0, 770);
        }

        const enemy = scene.physics.add.sprite(x, y, 'enemy');
        enemy.setCollideWorldBounds(true);
        scene.physics.world.enable(enemy, Phaser.Physics.Arcade.Sprite);
        scene.physics.add.collider(player, enemy, handlePlayerCollision);

        // Add the enemy to the tracking array
        newEnemies.push(enemy);

        // Increment counter
        counter++;

        // Stop generating after a certain number of enemies (adjust as needed)
        // if (counter >= 5) {
        //   clearInterval(intervalId);
        // }
      }, 3000);

      // Update function to be called in the scene's update loop
      function update() {
        newEnemies.forEach((enemy) => {
          trackPlayerWithCollision(enemy, player)
        });
      }

      // Update function is added to the scene's update method
      scene.events.on('update', update);
    }


    function handleMovement() {
      const speed = 150;
      const friction = 0.8; // Adjust the friction factor as needed

      if (cursors.left.isDown || keys.A.isDown) {
          player.setVelocityX(-speed);
          direction.current = 'A';
      } else if (cursors.right.isDown || keys.D.isDown) {
          player.setVelocityX(speed);
          direction.current = 'D';
      } else {
          // Apply friction to gradually slow down the player if no movement input
          player.setVelocityX(player.body.velocity.x * friction);
      }

      if (cursors.up.isDown || keys.W.isDown) {
          player.setVelocityY(-speed);
          direction.current = 'W';
      } else if (cursors.down.isDown || keys.S.isDown) {
          player.setVelocityY(speed);
          direction.current = 'S';
      } else {
          // Apply friction to gradually slow down the player if no movement input
          player.setVelocityY(player.body.velocity.y * friction);
      }

      // Check for dash input
      if (keys.SHIFT.isDown && dashAvailable) {
          dashAvailable = false;
          inDash = true;
          dash();
      }
  }

  function dash() {
    let dashX = 0;
    let dashY = 0;

    if (cursors.left.isDown || keys.A.isDown) {
        dashX = -500;
    } else if (cursors.right.isDown || keys.D.isDown) {
        dashX = 500;
    }

    if (cursors.up.isDown || keys.W.isDown) {
        dashY = -500;
    } else if (cursors.down.isDown || keys.S.isDown) {
        dashY = 500;
    }

    // Set the new velocity
    player.setVelocity(dashX, dashY);

    // Runs the code after a short time
    dashTimer = player.scene.time.addEvent({
        delay: 100, // Adjust the delay as needed
        callback: () => {
        dashTimer.destroy();
        // allows the player to move again
        setTimeout(()=>{
            inDash = false
        }, 100);
        setTimeout(()=>{
            dashAvailable = true;
        }, 2900);
        },
        callbackScope: this,
        loop: false,
    });
  }

  function handlePlayerCollision(player, enemy) {
    // console.log('Collision occurred between player and enemy');

    const pushForce = 1000;
    healthRef.current -= 5;
    healthText.setText(`Health: ${healthRef.current}`);

    // console.log('enemy: ' + enemy.x)
    // console.log('enemy: ' + enemy.y)
    // console.log('player: ' + player.x)
    // console.log('player: ' + player.y)

    // Calculate the direction from the enemy to the player
    const directionX = player.x - enemy.x;
    const directionY = player.y - enemy.y;

    // console.log('Direction X:', directionX, 'Direction Y:', directionY);

    // Check if the length is not zero before normalization
    const length = Math.sqrt(directionX ** 2 + directionY ** 2);
    // if (length !== 0) {
      // Normalize the direction vector
      const normalizedDirectionX = directionX / length;
      const normalizedDirectionY = directionY / length;

      // console.log('Normalized X:', normalizedDirectionX, 'Normalized Y:', normalizedDirectionY);

      // Apply force to the player in the opposite direction
      player.setVelocityX(pushForce * normalizedDirectionX);
      player.setVelocityY(pushForce * normalizedDirectionY);

      // Apply force to the enemy in the opposite direction
      enemy.setVelocity(0, 0);

      // console.log('Player Velocity X:', player.body.velocity.x, 'Player Velocity Y:', player.body.velocity.y);
      // console.log('Enemy Velocity X:', enemy.body.velocity.x, 'Enemy Velocity Y:', enemy.body.velocity.y);
    // } else {
    //   console.log('Direction vector length is zero. Skipping normalization.');
    // }
  }


  function trackPlayerWithCollision(enemy, player) {
    const speed = 50; // Adjust the speed as needed

    // Create Phaser.Vector2 instances for enemy and player positions
    const enemyPosition = new Phaser.Math.Vector2(enemy.x, enemy.y);
    const playerPosition = new Phaser.Math.Vector2(player.x, player.y);

    // Update function to be called in the scene's update loop
    function update() {
        // Calculate the direction vector from enemy to player
        const direction = playerPosition.clone().subtract(enemyPosition).normalize();

        // Set the velocity based on the normalized direction
        enemy.setVelocity(direction.x * speed, direction.y * speed);
    }

    // Update function is added to the scene's update method
    enemy.scene.events.on('update', update, this);

    // Add a collider to handle collisions
    // enemy.scene.physics.add.collider(block1, enemy, handleCollision);
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
        // attackSprite = player.scene.add.rectangle(attackX, attackY, 20, 50, 0xFF0000);
        // attackSprite.setOrigin(1, 1);
        attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
        attackSprite.displayWidth = 20;
        attackSprite.displayHeight = 50;
        attackSprite.setOrigin(1, 1);
      } else if (direction.current === 'D') {
        const attackX = player.x + attackDistance * Math.cos(attackAngle);
        const attackY = player.y + attackDistance * Math.sin(attackAngle);
        // attackSprite = player.scene.add.rectangle(attackX, attackY, 50, 20, 0xFF0000);
        // attackSprite.setOrigin(0, 0.5);
        attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
        attackSprite.displayWidth = 50;
        attackSprite.displayHeight = 20;
        attackSprite.setOrigin(0, 0.5);
      } else if (direction.current === 'S') {
        const attackX = player.x - attackDistance * Math.cos(attackAngle); // Subtracting for downward movement
        const attackY = player.y - attackDistance * Math.sin(attackAngle); // Subtracting for downward movement
        // attackSprite = player.scene.add.rectangle(attackX, attackY, 20, 50, 0xFF0000);
        // attackSprite.setOrigin(0, 0); // Origin changed for downward movement
        attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
        attackSprite.displayWidth = 20;
        attackSprite.displayHeight = 50;
        attackSprite.setOrigin(0, 0);
      } else if (direction.current === 'A') {
        const attackX = player.x - attackDistance * Math.cos(attackAngle); // Subtracting for leftward movement
        const attackY = player.y - attackDistance * Math.sin(attackAngle); // Subtracting for leftward movement
        // attackSprite = player.scene.add.rectangle(attackX, attackY, 50, 20, 0xFF0000);
        // attackSprite.setOrigin(1, 0.5); // Origin changed for leftward movement
        attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
        attackSprite.displayWidth = 50;
        attackSprite.displayHeight = 20;
        attackSprite.setOrigin(1, 0.5);
      }

      // Enable physics on attackSprite
      player.scene.physics.world.enable(attackSprite);

      // Add attackSprite to the physics world
      player.scene.physics.world.add(attackSprite);
      player.scene.physics.world.enable(attackSprite, Phaser.Physics.Arcade.Sprite);
      newEnemies.forEach((enemy) => {
        player.scene.physics.add.overlap(attackSprite, enemy, ()=>{
          enemy.disableBody(true, true);
        });
      });


      player.scene.time.delayedCall(150, () => {
        attackSprite.destroy();
      });

      attackCooldownTimer = player.scene.time.addEvent({
        delay: 500, // 0.5 seconds cooldown
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
      clearInterval(regen);
      game.destroy(true);
    };
  }, []);

  return (
    <>
      <div id="game-container"></div>
    </>
  );
};

export default Phase;
