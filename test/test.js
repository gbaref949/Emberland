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
