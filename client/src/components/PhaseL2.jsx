import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import trophy from '../pages/assets/player.png';
import enemy from '../pages/assets/enemy_1.png';

const Phase = () => {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const direction = useRef('W');
  const healthRef = useRef(100);
  const scoreRef = useRef(0);
  const navigate = useNavigate();
  let game;
  let pauseGame, resumeGame, destroyGame;

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

    game = new Phaser.Game(config);
    let cursors, keys, dashTimer, healthText, regen, intervalId, scoreText;
    let player, block1, attackSprite;
    let dashAvailable = true;
    let inDash = false;
    let attackCooldown = true;
    let attackCooldownTimer;
    const newEnemies = [];

    function preload() {
      this.load.image('player', trophy);
      this.load.image('enemy', enemy);
    }

    function create() {
      healthText = this.add.text(0, 0, `Health: 100`, { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
      scoreText = this.add.text(600, 0, `Score: 0`, { fontFamily: 'Arial', fontSize: '32px', fill: '#ffffff' });
      player = this.physics.add.sprite(385, 385, 'player');
      player.setCollideWorldBounds(true);
      player.setDepth(1);
      player.setScale(0.2);

      const block = this.add.rectangle(210, 245, 140, 210, 0x0000ff);
      const block2 = this.add.rectangle(560, 525, 140, 210, 0x0000ff);
      const block3 = this.add.rectangle(7.5*70, 210, 210, 140, 0x0000ff);
      const block4 = this.add.rectangle(245, 560, 210, 140, 0x0000ff);
      this.physics.add.existing(block, true);
      this.physics.add.existing(block2, true);
      this.physics.add.existing(block3, true);
      this.physics.add.existing(block4, true);
      this.physics.add.collider(player, block);
      this.physics.add.collider(player, block2);
      this.physics.add.collider(player, block3);
      this.physics.add.collider(player, block4);

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
        let score = scoreRef.current
        game.destroy(true);
        clearInterval(regen);
        clearInterval(intervalId);
        fetch(`http://localhost:5000/${currentUser.userID}`,{
          method: 'PUT',
          body: JSON.stringify({score}),
          headers: {'Content-Type': 'application/json'},
        })
        navigate('/gameOver');
      }

      if(scoreRef.current === 350){
        let score = scoreRef.current
        fetch(`http://localhost:5000/${currentUser.userID}`,{
          method: 'PUT',
          body: JSON.stringify({score}),
          headers: {'Content-Type': 'application/json'},
        })
        navigate('/level3')
      }
    }

    function generateEnemies(scene) {
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
        enemy.setScale(0.15);
        scene.physics.world.enable(enemy, Phaser.Physics.Arcade.Sprite);
        scene.physics.add.overlap(player, enemy, handlePlayerCollision);

        // Add the enemy to the tracking array
        newEnemies.push(enemy);

        counter++;

        // Stop generating after a certain number of enemies (adjust as needed)
        if (counter >= 35) {
          clearInterval(intervalId);
        }
      }, 2500);

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
      const friction = 0.8;

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

      dashTimer = player.scene.time.addEvent({
          delay: 100,
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
      const pushForce = 1000;
      healthRef.current -= 5;
      healthText.setText(`Health: ${healthRef.current}`);

      // Calculate the direction from the enemy to the player
      const directionX = player.x - enemy.x;
      const directionY = player.y - enemy.y;

      const length = Math.sqrt(directionX ** 2 + directionY ** 2);
      const normalizedDirectionX = directionX / length;
      const normalizedDirectionY = directionY / length;

      // Apply force to the player in the opposite direction
      player.setVelocityX(pushForce * normalizedDirectionX);
      player.setVelocityY(pushForce * normalizedDirectionY);

      // Apply force to the enemy in the opposite direction
      enemy.setVelocity(0, 0);
    }

    function trackPlayerWithCollision(enemy, player) {
      const speed = 60; // Adjust the speed as needed

      const enemyPosition = new Phaser.Math.Vector2(enemy.x, enemy.y);
      const playerPosition = new Phaser.Math.Vector2(player.x, player.y);

      // Update function to be called in the scene's update loop
      function update() {
          // Calculate the direction vector from enemy to player
          const direction = playerPosition.clone().subtract(enemyPosition).normalize();
          enemy.setVelocity(direction.x * speed, direction.y * speed);
      }

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

    pauseGame = () => {
      // Pause everything in the game
      game.scene.scenes.forEach((scene) => {
        if (scene.scene.pause) {
          scene.scene.pause();
        }
      });
    };

    resumeGame = () => {
      // Resume everything in the game
      game.scene.scenes.forEach((scene) => {
        if (scene.scene.resume) {
          scene.scene.resume();
        }
      });
    };

    destroyGame = () =>{
      clearInterval(intervalId);
      clearInterval(regen);
      game.destroy(true);
    }

    return () => {
      clearInterval(regen);
      game.destroy(true);
    };
  }, []);

  const handleMenuToggle = () => {
    const menuOverlay = document.querySelector(".menu-overlay");
    if (menuOverlay) {
      menuOverlay.classList.toggle("open");

      // Pause or resume the game based on the menu state
      if (menuOverlay.classList.contains("open")) {
        pauseGame();
      } else {
        resumeGame();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      handleMenuToggle();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const menuLink = document.querySelector(".menu-link");
    if (menuLink) {
      menuLink.addEventListener("click", (event) => {
        event.preventDefault();
        handleMenuToggle();
      });
      return () => {
        menuLink.removeEventListener("click", handleMenuToggle);
      };
    }
  }, []);

  function restart(){
    window.location.reload();
  }

  return (
    <>
      {/* Game content */}
      <div id="game-container">
        {/* Game content */}
      </div>
      <div className='menu'>
        <span className='menu-circle' />
        <a className='menu-link'>
          <span className='menu-icon'>
            <span className='menu-line menu-line-1' />
            <span className='menu-line menu-line-2' />
            <span className='menu-line menu-line-3' />
          </span>
        </a>
      </div>
      <div className='menu-overlay'>
        <div className='overlay-info'>
          {/* <h1>Controls</h1> */}
          {/* Controls info */}

          <Link to={'/dashboard'} className='menuBtn' onClick={()=> destroyGame()}>Quit</Link>
          <Link className='menuBtn' onClick={()=>restart()}>Restart</Link>
        </div>
      </div>
    </>
  );
};

export default Phase;
