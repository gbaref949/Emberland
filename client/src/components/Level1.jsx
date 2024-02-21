import React, { useEffect } from 'react';
import p5 from 'p5';

const Game = () => {
  useEffect(() => {
    const sketch = (p) => {
      let x = 50;
      let y = 50;

      p.setup = () => {
        p.createCanvas(400, 400);
      };

      p.draw = () => {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
      };

      p.keyPressed = () => {
        if (p.keyCode === p.LEFT_ARROW) {
          x -= 5;
        } else if (p.keyCode === p.RIGHT_ARROW) {
          x += 5;
        } else if (p.keyCode === p.UP_ARROW) {
          y -= 5;
        } else if (p.keyCode === p.DOWN_ARROW) {
          y += 5;
        }
      };
      };

      new p5(sketch);
  }, []);

  return <div id="game-container"></div>;
};

export default Game;
