import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Phase = () => {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const direction = useRef('W'); // Using useRef instead of useState
  const healthRef = useRef(100);
  const scoreRef = useRef(0);
  const navigate = useNavigate();
  const bossHitCounter = useRef(0);

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
    let cursors, keys, dashTimer, healthText, regen, intervalId, scoreText;
    let player, block1, attackSprite, bossEnemy;
    let dashAvailable = true;
    let inDash = false;
    let attackCooldown = true;
    let attackCooldownTimer;
    const newEnemies = [];
    let mult = (77/260);
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
    let blocks = [];

    function preload() {
      this.load.image('player', '../pages/images/editedLogo.png');
    }

    function create() {
      healthText = this.add.text(0, 0, `Health: 100`, { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
      scoreText = this.add.text(600, 0, `Score: 0`, { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
      player = this.physics.add.sprite(385, 385, 'player');
      player.setCollideWorldBounds(true);
      player.setDepth(1);

      // Create boss enemy
      bossEnemy = this.physics.add.sprite(100, 100, 'bossEnemy'); // Spawn boss enemy in top left corner
      bossEnemy.setScale(2); // Make boss enemy twice as big as player
      bossEnemy.setCollideWorldBounds(true);
      bossEnemy.setDepth(1);
      this.physics.add.collider(bossEnemy, player, handlePlayerCollisionBoss);

      let temp;
      for(let i=0;i<16;i++){
        temp = this.add.rectangle(blockValues[i][0], blockValues[i][1], blockValues[i][2], blockValues[i][3], 0x0000ff);
        this.physics.add.existing(temp, true);
        this.physics.add.collider(player, temp, handleFallCollision);
        temp.setDepth(0);
        blocks.push(temp);
      }

      generateEnemies(this, player);

      this.input.on('pointerdown', handleAttack);

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
      if (!inDash) {
        handleMovement();
      }
      if (healthRef.current <= 0) {
        let score = scoreRef.current
        game.destroy(true);
        clearInterval(regen);
        clearInterval(intervalId);
        fetch(`http://localhost:5000/${currentUser.userID}`, {
          method: 'PUT',
          body: JSON.stringify({ score }),
          headers: { 'Content-Type': 'application/json' },
        })
        navigate('/gameOver');
      }
      // Track player with collision for boss enemy
      trackPlayerWithCollision(bossEnemy, player);
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
        scene.physics.add.overlap(player, enemy, handlePlayerCollision);

        // Add the enemy to the tracking array
        newEnemies.push(enemy);

        // Increment counter
        counter++;

        // Stop generating after a certain number of enemies (adjust as needed)
        if (counter >= 2) {
          clearInterval(intervalId);
        }
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
      enemy.scene.physics.add.collider(enemy, player, handlePlayerCollisionBoss);
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

    function handlePlayerCollisionBoss() {
      const pushForce = 1000;
      healthRef.current -= 5;
      healthText.setText(`Health : ${healthRef.current}`)
    
      const directionX = player.x - bossEnemy.x;
      const directionY = player.y - bossEnemy.y;
    
      const length = Math.sqrt(directionX ** 2 + directionY ** 2);
      const normalizedDirectionX = directionX / length;
      const normalizedDirectionY = directionY / length;
    
      player.setVelocityX(pushForce * normalizedDirectionX);
      player.setVelocityY(pushForce * normalizedDirectionY);
    
      bossEnemy.setVelocity(0, 0);
    }
    

    function handlePlayerCollision(player, enemy) {
      const pushForce = 1000;
      healthRef.current -= 5;
      healthText.setText(`Health: ${healthRef.current}`);

      // Calculate the direction from the enemy to the player
      const directionX = player.x - enemy.x;
      const directionY = player.y - enemy.y;

      // Check if the length is not zero before normalization
      const length = Math.sqrt(directionX ** 2 + directionY ** 2);
      // Normalize the direction vector
      const normalizedDirectionX = directionX / length;
      const normalizedDirectionY = directionY / length;

      // console.log('Normalized X:', normalizedDirectionX, 'Normalized Y:', normalizedDirectionY);

      // Apply force to the player in the opposite direction
      player.setVelocityX(pushForce * normalizedDirectionX);
      player.setVelocityY(pushForce * normalizedDirectionY);

      // Apply force to the enemy in the opposite direction
      enemy.setVelocity(0, 0);
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
    }

    function handleAttack() {
      if (attackCooldown) {
        attackCooldown = false;
        const attackDistance = 10;
        const attackAngle = player.rotation;

        if (direction.current === 'W') {
          const attackX = player.x + attackDistance * Math.cos(attackAngle);
          const attackY = player.y + attackDistance * Math.sin(attackAngle);
          attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
          attackSprite.displayWidth = 20;
          attackSprite.displayHeight = 50;
          attackSprite.setOrigin(1, 1);
        } else if (direction.current === 'D') {
          const attackX = player.x + attackDistance * Math.cos(attackAngle);
          const attackY = player.y + attackDistance * Math.sin(attackAngle);
          attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
          attackSprite.displayWidth = 50;
          attackSprite.displayHeight = 20;
          attackSprite.setOrigin(0, 0.5);
        } else if (direction.current === 'S') {
          const attackX = player.x - attackDistance * Math.cos(attackAngle); // Subtracting for downward movement
          const attackY = player.y - attackDistance * Math.sin(attackAngle); // Subtracting for downward movement
          attackSprite = player.scene.physics.add.sprite(attackX, attackY, 'attackTexture');
          attackSprite.displayWidth = 20;
          attackSprite.displayHeight = 50;
          attackSprite.setOrigin(0, 0);
        } else if (direction.current === 'A') {
          const attackX = player.x - attackDistance * Math.cos(attackAngle); // Subtracting for leftward movement
          const attackY = player.y - attackDistance * Math.sin(attackAngle); // Subtracting for leftward movement
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
            scoreRef.current += 10;
            scoreText.setText(`Score: ${scoreRef.current}`);
            console.log(scoreRef.current);
          });
        });

        player.scene.physics.add.overlap(attackSprite, bossEnemy, ()=>{
          bossHitCounter.current++;
          let x = Phaser.Math.Between(0, 770);
          let y = Phaser.Math.Between(0, 770);

          // Check for minimum distance from the player
          while (Phaser.Math.Distance.Between(player.x, player.y, x, y) < 100) {
            x = Phaser.Math.Between(0, 770);
            y = Phaser.Math.Between(0, 770);
          }
          if(bossHitCounter.current === 5){
            bossEnemy.disableBody(true, true);
            scoreRef.current += 50;
            scoreText.setText(`Score: ${scoreRef.current}`);
          }
          bossEnemy.x = x;
          bossEnemy.y = y;
        })

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