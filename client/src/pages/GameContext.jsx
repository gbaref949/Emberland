import {useEffect} from 'react'
import Movement from '../components/Movement'
import {handleMovement, dash} from '../components/Movement'

const GameContext = () => {
    // const {handleMovement, dash} = Movement();

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
        let player, block1;
        let dashAvailable = true;
        let dashTimer;
        let inDash = false;

        function preload() {
            this.load.image('player', '../pages/images/editedLogo.png');
        }

        function create() {
            player = this.physics.add.sprite(400, 300, 'player');
            player.setCollideWorldBounds(true);

            block1 = this.physics.add.sprite(200, 300, 'block');

            // Set block1 to be immovable (it won't be affected by collisions)
            block1.setImmovable(true);
            block1.setScale(3);

            // Add a collider to handle collisions between blocks
            this.physics.add.collider(block1, player);

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

        function editVal(obj, key, value) {
            obj[key] = value;
        }


        function update() {
            // prevents user from moving when dash is in effect
            if (!inDash) {
                handleMovement(cursors, keys, player, dashAvailable, inDash, dashTimer, editVal);
            }
        }


        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container"></div>;
}

export default GameContext;