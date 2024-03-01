import React, { useEffect } from 'react';

const Enemies = () => {
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
        let cursors, keys;
        let player, block1, enemy;
        let dashAvailable = true;
        let inDash = false;
        let dashTimer;

        function preload() {
            this.load.image('player', '../pages/images/editedLogo.png');
        }

        function create() {
            player = this.physics.add.sprite(400, 300, 'player');
            player.setCollideWorldBounds(true);

            enemy = this.physics.add.sprite(600, 600, 'enemy');
            enemy.setCollideWorldBounds(true);

            block1 = this.physics.add.sprite(200, 300, 'block');

            // Set block1 to be immovable (it won't be affected by collisions)
            block1.setImmovable(true);
            block1.setScale(3);
            this.physics.add.collider(player, enemy, handlePlayerCollision);

            // Add a collider to handle collisions between blocks
            this.physics.add.collider(block1, player);
            this.physics.add.collider(enemy, player);

            // Set collide world bounds for both blocks
            block1.setCollideWorldBounds(true);

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
            // prevents user from moving when dash is in effect
            if(!inDash) {
                handleMovement();
            }
            trackPlayerWithCollision(enemy, player);
        }

        function handlePlayerCollision() {
            const pushForce = 1000; // Adjust the force as needed

            // Calculate the direction from the enemy to the player
            const directionX = player.x - enemy.x;
            const directionY = player.y - enemy.y;

            console.log('Direction X:', directionX, 'Direction Y:', directionY);

            // Normalize the direction vector
            const length = Math.sqrt(directionX ** 2 + directionY ** 2);
            const normalizedDirectionX = directionX / length;
            const normalizedDirectionY = directionY / length;

            console.log('Normalized X:', normalizedDirectionX, 'Normalized Y:', normalizedDirectionY);

            // Apply force to the player in the opposite direction
            player.setVelocityX(pushForce * normalizedDirectionX);
            player.setVelocityY(pushForce * normalizedDirectionY);

            // Apply force to the enemy in the opposite direction
            // enemy.setVelocityX(-pushForce * normalizedDirectionX);
            // enemy.setVelocityY(-pushForce * normalizedDirectionY);
            enemy.setVelocity(0,0)

            console.log('Player Velocity X:', player.body.velocity.x, 'Player Velocity Y:', player.body.velocity.y);
            console.log('Enemy Velocity X:', enemy.body.velocity.x, 'Enemy Velocity Y:', enemy.body.velocity.y);

            // dashTimer = enemy.scene.time.addEvent({
            //     delay: 1000, // Adjust the delay as needed
            //     callback: () => {
            //     dashTimer.destroy();
            //     // allows the player to move again
            //         setTimeout(()=>{
            //             collided = false;
            //         }, 1000);
            //     },
            //     callbackScope: this,
            //     loop: false,
            // });
        }


        function trackPlayerWithCollision(enemy, player) {
            const speed = 100; // Adjust the speed as needed

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

        // Function to handle collisions
        function handleCollision() {
            // Your collision handling logic here
            console.log('Collision occurred!');
            enemy.setVelocity(0);
        }

        function handleMovement() {
            const speed = 150;
            const friction = 0.8; // Adjust the friction factor as needed

            if (cursors.left.isDown || keys.A.isDown) {
                player.setVelocityX(-speed);
            } else if (cursors.right.isDown || keys.D.isDown) {
                player.setVelocityX(speed);
            } else {
                // Apply friction to gradually slow down the player if no movement input
                player.setVelocityX(player.body.velocity.x * friction);
            }

            if (cursors.up.isDown || keys.W.isDown) {
                player.setVelocityY(-speed);
            } else if (cursors.down.isDown || keys.S.isDown) {
                player.setVelocityY(speed);
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

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container"></div>;
};

export default Enemies;
