import React, { useEffect } from 'react';
import p5 from 'p5';

const Collision = () => {
    useEffect(() => {
        const sketch = (p) => {
            let platform;
            let rect;
            let right, left;

            p.setup = () => {
                p.createCanvas(400, 400);
                platform = new Platform(p.width / 2 - 50, p.height - 20, 100, 10);
                rect = new Rectangle(50, 50);
            };

            p.draw = () => {
                p.background(0);
                p.fill(255);

                rect.update();
                rect.display();
                platform.display();

                // Check for collision with the platform
                if (platform.collidesWith(rect)) {
                    rect.handleCollision(platform);
                }
            };

            p.keyPressed = () => {
                // if (p.keyCode === p.UP_ARROW || p.keyCode === 87) {
                //     up = setInterval(() => {
                //         if (rect.y >= 2) rect.y -= 2;
                //     }, 10);
                // }
                if (p.keyCode === p.LEFT_ARROW || p.keyCode === 65) {
                    left = setInterval(() => {
                        if (rect.x >= 2) rect.x -= 2;
                    }, 10);
                }
                // if (p.keyCode === p.DOWN_ARROW || p.keyCode === 83) {
                //     down = setInterval(() => {
                //         if (rect.y <= p.height - 50) rect.y += 2;
                //     }, 10);
                // }
                if (p.keyCode === p.RIGHT_ARROW || p.keyCode === 68) {
                    right = setInterval(() => {
                        if (rect.x <= p.width - 50) rect.x += 2;
                    }, 10);
                }
                if (p.keyCode === p.UP_ARROW || p.keyCode === 32) {
                    // Check if the rectangle is not already moving upwards (jumping)
                    if (rect.speedY === 0) {
                        if (rect.y >= 2) rect.y -= 60;
                    }
                }
            };

            p.keyReleased = () => {
                // if (p.keyCode === p.UP_ARROW || p.keyCode === 87) {
                //     clearInterval(up);
                // }
                if (p.keyCode === p.LEFT_ARROW || p.keyCode === 65) {
                    clearInterval(left);
                }
                // if (p.keyCode === p.DOWN_ARROW || p.keyCode === 83) {
                //     clearInterval(down)
                // }
                if (p.keyCode === p.RIGHT_ARROW || p.keyCode === 68) {
                    clearInterval(right)
                }
            };



            class Rectangle {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.width = 50;
                    this.height = 50;
                    this.speedX = 0;
                    this.speedY = 0; // Added speedY for gravity
                    this.gravity = 0.05;
                }

                update() {
                    // Apply gravity
                    this.speedY += this.gravity;

                    // Update position
                    this.x += this.speedX;
                    this.y += this.speedY;

                    // Bounce off walls
                    if (this.x < 0) {
                        this.x = 0;
                        this.speedX = 0;
                    }
                    if (this.x + this.width > p.width) {
                        this.x = p.width - this.width;
                        this.speedX = 0;
                    }

                    // Prevent going through the floor
                    if (this.y > p.height - this.height) {
                        this.y = p.height - this.height;
                        this.speedY = 0;

                        // Reset gravity when on the ground
                        this.gravity = 0.05;
                    } else {
                        // Set a lower gravity value when in the air
                        this.gravity += this.gravity/100;
                    }

                    // Prevent going through the platform from the bottom
                    if (this.y + this.height > platform.y && this.y < platform.y + platform.height) {
                        this.y = platform.y - this.height;
                        this.speedY = 0;
                    }
                }


                display() {
                    p.rect(this.x, this.y, this.width, this.height);
                }

                handleCollision(platform) {
                    // Adjust the rectangle's position and speed after a collision with the platform
                    this.y = platform.y - this.height;
                    this.speedY = 0;
                }
            }

            class Platform {
                constructor(x, y, width, height) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                }

                display() {
                    p.rect(this.x, this.y, this.width, this.height);
                }

                collidesWith(rect) {
                    // AABB collision detection
                    return (
                        rect.x < this.x + this.width &&
                        rect.x + rect.width > this.x &&
                        rect.y < this.y + this.height &&
                        rect.y + rect.height > this.y
                    );
                }
            }
        };

        new p5(sketch);
    }, []);

    return <div id="canvas-container"></div>;
};

export default Collision;
