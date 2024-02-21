import React from 'react';
import './styles.css'; // Importing the CSS file

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
    this.x = constrain(this.x, 0, window.innerWidth - blockSize);
    this.y = constrain(this.y, 0, window.innerHeight - blockSize);
  }

  show() {
    return (
      <div
        style={{
          position: 'absolute',
          left: this.x,
          top: this.y,
          width: blockSize,
          height: blockSize,
          backgroundColor: 'red',
        }}
      ></div>
    );
  }
}

class Level1 extends React.Component {
  constructor(props) {
    super(props);
    this.block = null;
    this.blockSize = 50;
  }

  componentDidMount() {
    this.block = new Block(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener('keydown', this.handleKeyPress);
    this.interval = setInterval(this.updateGame, 16); // 60 frames per second
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
    clearInterval(this.interval);
  }

  handleKeyPress = (event) => {
    // Handle key presses
    // You can implement the logic for moving the block here
  };

  updateGame = () => {
    this.block.update();
    this.forceUpdate(); // Force re-render to update block position
  };

  render() {
    return (
      <div>
        <div className="game-container">{this.block.show()}</div>
      </div>
    );
  }
}

export default Level1;
