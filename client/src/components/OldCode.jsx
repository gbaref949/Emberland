import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Phase = () => {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const direction = useRef('W'); // Using useRef instead of useState
    const healthRef = useRef(100);
    const scoreRef = useRef(0);
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
        let cursors, keys, dashTimer, healthText, regen, intervalId, scoreText;
        let player, block1, attackSprite;
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

        // attackSprite = player.scene.add.rectangle(player.x + 10 * Math.cos(player.rotation), player.y + 10 * Math.sin(player.rotation), 20, 20, 0xFF0000);
        // attackSprite.setOrigin(1, 1);

        let temp;
        for(let i=0;i<16;i++){
            temp = this.add.rectangle(blockValues[i][0], blockValues[i][1], blockValues[i][2], blockValues[i][3], 0x0000ff);
            this.physics.add.existing(temp, true);
            this.physics.add.collider(player, temp, handleFallCollision);
            temp.setDepth(0);
            blocks.push(temp);
        }

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
        // trackPlayerWithCollision(enemy, player);
        }

        function handleFallCollision(player, block) {
        console.log('overlap')
        // const centerX = player.x + player.width / 2
        // const centerY = player.y + player.height / 2
        // // Calculate the overlap area based on the distance between the centers
        // const overlapX = Math.abs(player.x - block.x) - (player.width + block.width) / 2;
        // const overlapY = Math.abs(player.y - block.y) - (player.height + block.height) / 2;

        // // If at least half of the player sprite is inside the block sprite
        // if (overlapX < 0 && overlapY < 0) {
        //   player.x = 200;
        //   player.y = 200;
        // }
        // player.x = 200;
        // player.y = 200;

        // Calculate the distance between the center of the player sprite and the edges of the rectangle
        // const distanceX = Math.abs(player.x - block.x);
        // const distanceY = Math.abs(player.y - block.y);

        // // Calculate the half-width and half-height of the player sprite
        // const halfWidth = player.width / 2;
        // const halfHeight = player.height / 2;

        // // Check if the center of the player sprite is outside the rectangle
        // if (distanceX > block.width / 2 + halfWidth || distanceY > block.height / 2 + halfHeight) {
        //     // Custom logic for overlap
        //     console.log('Center overlap with the outside occurred');
        //     player.x = 200;
        //     player.y = 200;
        // }

        // Calculate the overlap area based on the distance between the centers
        // const overlapX = Math.abs(player.x - block.x) - (player.width + block.width) / 2;
        // const overlapY = Math.abs(player.y - block.y) - (player.height + block.height) / 2;

        // // Calculate the offset from the center of the player sprite
        // const offsetX = Math.abs(player.x - block.x);
        // const offsetY = Math.abs(player.y - block.y);

        // // Define a threshold for overlap (adjust as needed)
        // const overlapThreshold = 10;

        // // Check if half of the player sprite is over the rectangle and the overlap is at the center
        // if (overlapX < 0 && overlapY < 0 && offsetX <= player.width / 2 + overlapThreshold && offsetY <= player.height / 2 + overlapThreshold) {
        //   player.x = 200;
        //   player.y = 200;
        // }

        // Calculate the distance between the centers of the player sprite and the rectangle
        // const distanceX = Math.abs(player.x - block.x);
        // const distanceY = Math.abs(player.y - block.y);

        // // Calculate the sum of half the width of the player sprite and half the width of the rectangle
        // const combinedHalfWidth = player.width / 2 + block.width / 2;
        // const combinedHalfHeight = player.height / 2 + block.height / 2;

        // // Calculate the distance from the center of the player sprite to the edge of the player sprite
        // const playerEdgeX = player.width / 2;
        // const playerEdgeY = player.height / 2;

        // // Check if the centers are not overlapping and the center of the player sprite is outside the rectangle
        // if (distanceX > combinedHalfWidth - playerEdgeX || distanceY > combinedHalfHeight - playerEdgeY) {
        //     // Custom logic for overlap
        //     console.log('Center overlap with the outside occurred');
        //     player.x = 200;
        //     player.y = 200;
        // }

        // Calculate the center position of the player sprite
        //   const playerCenterX = player.x;
        // const playerCenterY = player.y;

        // // Create a point representing the center of the player sprite
        // const playerCenterPoint = new Phaser.Geom.Point(playerCenterX, playerCenterY);

        // // Create a rectangle representing the block
        // const blockRect = new Phaser.Geom.Rectangle(block.x - block.width / 2, block.y - block.height / 2, block.width, block.height);

        // // Check if the center point of the player sprite is within a certain distance of the rectangle edges
        // const distanceThreshold = 25; // Adjust the threshold as needed
        // const isOverlap = Phaser.Geom.Rectangle.Overlaps(blockRect, playerCenterX - distanceThreshold, playerCenterY - distanceThreshold, distanceThreshold * 2, distanceThreshold * 2);

        //   // Check if the center point of the player sprite is outside the rectangle
        //   if (isOverlap) {
        //       // Custom logic for overlap
        //       console.log('Center overlap with the outside occurred');
        //       player.x = 200;
        //       player.y = 200;
        //   }

        // Iterate through the blocks and check for overlap with the center of the player sprite
            // // Adjust the threshold as needed
            // const distanceThreshold = 25;

            // // Calculate the center point of the player sprite
            // const playerCenterX = player.x + player.displayWidth / 2;
            // const playerCenterY = player.y + player.displayHeight / 2;

            // // Calculate the distance between the center point and the corners of the player sprite
            // const distanceToTopLeft = Phaser.Math.Distance.Between(playerCenterX, playerCenterY, player.x, player.y);
            // const distanceToTopRight = Phaser.Math.Distance.Between(playerCenterX, playerCenterY, player.x + player.displayWidth, player.y);
            // const distanceToBottomLeft = Phaser.Math.Distance.Between(playerCenterX, playerCenterY, player.x, player.y + player.displayHeight);
            // const distanceToBottomRight = Phaser.Math.Distance.Between(playerCenterX, playerCenterY, player.x + player.displayWidth, player.y + player.displayHeight);

            // // Check if any corner is within the distance threshold
            // const isOverlap = (
            //     distanceToTopLeft < distanceThreshold ||
            //     distanceToTopRight < distanceThreshold ||
            //     distanceToBottomLeft < distanceThreshold ||
            //     distanceToBottomRight < distanceThreshold
            // );

            // // Check if there is an overlap
            // if (isOverlap) {
            //     // Custom logic for overlap
            //     console.log('Center overlap with the rectangle edges occurred');
            //     player.x = 100;
            //     player.y = 100;
            // }
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
            scoreRef.current += 10;
            scoreText.setText(`Score: ${scoreRef.current}`);
            console.log(scoreRef.current);
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