import React from 'react'
import {Helmet} from 'react-helmet'

const NewTest = () => {
    useEffect(() => {
        // Script source URL for p5.js
        const scriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js';

        // Create a script element
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;

        let xpos = 300;
        let ypos = 300;

        // Append the script element to the head
        document.body.appendChild(script);

        let block;
        const blockSize = 50; // Size of the block

        function setup() {
            createCanvas(windowWidth, windowHeight); // Creating a canvas that fits the window
            background(0, 0, 255); // Blue background
            block = new Block(width / 2, height / 2); // Creating a new block
        }

        function draw() {
            background(0, 0, 255); // Redrawing the background to clear previous frame
            block.update(); // Update the block's position based on user input
            block.show(); // Display the block
        }

        class Block {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.speed = 4; // Speed of the block
            }

            update() {
                // Check for key presses and move the block accordingly
                if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
                this.x -= this.speed;
                }
                if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
                this.x += this.speed;
                }
                if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
                this.y -= this.speed;
                }
                if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
                this.y += this.speed;
                }

                // Constrain the block within the canvas boundaries
                this.x = constrain(this.x, 0, width - blockSize);
                this.y = constrain(this.y, 0, height - blockSize);
            }

            show() {
                fill(255, 0, 0); // Red color
                rect(this.x, this.y, blockSize, blockSize); // Draw the block
            }
        }


        // Clean up function to remove the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    // let movingRight = false;
    // let movingLeft = false;
    // let movingUp = false;
    // let movingDown = false;

    // let xpos = 300;
    // let ypos = 300;
    // let speed = 5;

    // function setup() {
    //     createCanvas(600, 600);
    // }

    // function draw() {
    //     background(220);
        
    //     // draw moving character
    //     fill(0, 0, 255);
    //     ellipse(xpos, ypos, 75, 75);
        
    //     // update moving character
    //     if (movingRight) {
    //         xpos += speed;
    //     }
    //     if (movingLeft) {
    //         xpos -= speed;
    //     }
    //     if (movingUp) {
    //         ypos -= speed;
    //     }
    //     if (movingDown) {
    //         ypos += speed;
    //     }
        
    //     // show boolean values onscreen for clarity
    //     textSize(20);
    //     text("movingRight = " + movingRight + 
    //         "\nmovingLeft = " + movingLeft + 
    //         "\nmovingUp = " + movingUp + 
    //         "\nmovingDown = " + movingDown, 10, 10, width/2, height/2);
    // }

    // function keyPressed() {
    //     if (key == 'w') {
    //         movingUp = true;
    //     }
    //     if (key == 'a') {
    //         movingLeft = true;
    //     }
    //     if (key == 's') {
    //         movingDown = true;
    //     }
    //     if (key == 'd') {
    //         movingRight = true;
    //     }
    // }

    // function keyReleased() {
    //     if (key == 'w') {
    //         movingUp = false;
    //     }
    //     if (key == 'a') {
    //         movingLeft = false;
    //     }
    //     if (key == 's') {
    //         movingDown = false;
    //     }
    //     if (key == 'd') {
    //         movingRight = false;
    //     }
    // }

    return (
        <>
            {/* <Helmet>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/addons/p5.sound.min.js"></script>
            </Helmet> */}
            <p>This is a p5.js sketch using React without additional packages</p>
        </>
    );
}

export default NewTest;