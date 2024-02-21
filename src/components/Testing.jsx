// Sketch.js
import React, { useEffect } from 'react';

const Sketch = () => {
    useEffect(() => {
        // Script source URL for p5.js
        const scriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js';

        // Create a script element
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;

        // Append the script element to the body
        document.body.appendChild(script);

        // Function to initialize p5.js sketch
        const initializeSketch = () => {
        // Setup function
        window.setup = () => {
            // Setup canvas
            window.createCanvas(400, 400);
        };

        // Draw function
        window.draw = () => {
            // Draw something on the canvas
            window.background(220);
            window.fill(0, 128, 255);
            window.ellipse(window.width / 2, window.height / 2, 50, 50);
        };

        // Initialize p5.js sketch
        new window.p5();
        };

        // Load the script and initialize the sketch once it's loaded
        script.onload = initializeSketch;

        // Clean up function to remove the script when the component unmounts
        return () => {
        document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
        <p>This is a p5.js sketch using React without additional packages</p>
        </div>
    );
};

export default Sketch;
