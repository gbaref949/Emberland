import React, { useEffect } from 'react';
import p5 from 'p5';

const Game = () => {
  useEffect(() => {
    const sketch = (p) => {
      let x = 50;
      let y = 50;
      let up, down, left, right;

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
      };

      p.draw = () => {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
      };

      //         if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      //         if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      //         if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      //         if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {

      // moves the reactangle with smooth movement whenever the user presses the corresponding key
      p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW || p.keyCode === 87) {
          up = setInterval(() => {
            if (y >= 2) y -= 2;
          }, 10);
        }
        if (p.keyCode === p.LEFT_ARROW || p.keyCode === 65) {
          left = setInterval(() => {
            if (x >= 2) x -= 2;
          }, 10);
        }
        if (p.keyCode === p.DOWN_ARROW || p.keyCode === 83) {
          down = setInterval(() => {
            if (y <= p.height - 50) y += 2;
          }, 10);
        }
        if (p.keyCode === p.RIGHT_ARROW || p.keyCode === 68) {
          right = setInterval(() => {
            if (x <= p.width - 50) x += 2;
          }, 10);
        }
      };

      // stops the rectangle from moving when the user lets the key go
      p.keyReleased = () => {
        if (p.keyCode === p.UP_ARROW || p.keyCode === 87) {
          clearInterval(up);
        }
        if (p.keyCode === p.LEFT_ARROW || p.keyCode === 65) {
          clearInterval(left);
        }
        if (p.keyCode === p.DOWN_ARROW || p.keyCode === 83) {
          clearInterval(down);
        }
        if (p.keyCode === p.RIGHT_ARROW || p.keyCode === 68) {
          clearInterval(right);
        }
      };
    };

    new p5(sketch);
  }, []);

  return (
    <div id='game-container' className='game-container'>
      <a href='/' className='logout-btn'>
        <p className='btn-text'>LOGOUT</p>
      </a>
    </div>
  );
};

export default Game;
