// Sketch.js
import React, { useEffect } from 'react';
import {Helmet} from 'react-helmet'

const Sketch = () => {
    useEffect(() => {
        // Script source URL for p5.js
        const scriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js';

        // Create a script element
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;

        let xpos = 300;
        let ypos = 300;
        let ellipse;

        // Append the script element to the head
        document.head.appendChild(script);

        // Function to initialize p5.js sketch
        const initializeSketch = () => {
            // Setup function
            window.setup = () => {
                // Setup canvas
                window.createCanvas(600, 600);
            };

            // Draw function
            window.draw = () => {
                // Draw something on the canvas
                window.background(220);
                window.fill(0, 128, 255);
                ellipse = window.ellipse(xpos, ypos, 75, 75);
            };

            // Initialize p5.js sketch
            new window.p5();
        };

        // Check for key presses and move the block accordingly
        if (keyIsDown(65)) {
            ellipse.x -= ellipse.speed;
        }
        if (keyIsDown(68)) {
            ellipse.x += ellipse.speed;
        }
        if (keyIsDown(87)) {
            ellipse.y -= ellipse.speed;
        }
        if (keyIsDown(83)) {
            ellipse.y += ellipse.speed;
        }

        // Constrain the block within the canvas boundaries
        // ellipse.x = constrain(ellipse.x, 0, width - blockSize);
        // ellipse.y = constrain(ellipse.y, 0, height - blockSize);

        // Load the script and initialize the sketch once it's loaded
        script.onload = initializeSketch;

        // Clean up function to remove the script when the component unmounts
        return () => {
            document.head.removeChild(script);
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
};

export default Sketch;
