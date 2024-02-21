import {useEffect} from 'react'

const NewTest = () => {
    useEffect(() => {
        // Script source URL for p5.js
        const scriptSrc = 'https://cdn.jsdelivr.net/npm/p5@1.3.1/lib/p5.min.js';

        // Create a script element
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;

        // Append the script element to the head
        console.log(script)
        document.head.appendChild(script);

        // Clean up function to remove the script when the component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    let x = 100;
    let y = 100;

    function setup() {
        createCanvas(512, 512);
        fill(255, 0, 0);
    }

    function draw() {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            x -= 5;
        }

        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            x += 5;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            y -= 5;
        }

        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
            y += 5;
        }

        clear();
        ellipse(x, y, 50, 50);
        describe(`50-by-50 red ellipse moves left, right, up, and
            down with arrow presses.`);
    }




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