import React, { useEffect } from 'react';
import p5 from 'p5';

class Player {
  constructor(x, y) {
    this.x = 50;
    this.y = 50;
    this.speed = 5;
    this.size = 50; // size of player
  }

  update(p) {
    if (p.keyIsDown(65) && this.x > 0) this.x -= this.speed; // A key (move left)
    if (p.keyIsDown(68) && this.x < p.width - this.size) this.x += this.speed; // D key (move right)
    if (p.keyIsDown(87) && this.y > 0) this.y -= this.speed; // W key (move up)
    if (p.keyIsDown(83) && this.y < p.height - this.size) this.y += this.speed; // S key (move down)
  }

  display(p) {
    p.fill(255);
    p.rect(this.x, this.y, this.size, this.size);
  }

  // Function to check collision with another object
  collides(obj) {
    return !(
      this.x + this.size < obj.x ||
      this.x > obj.x + obj.size ||
      this.y + this.size < obj.y ||
      this.y > obj.y + obj.size
    );
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.size = 50; // size of enemy
  }

  update(player) {
    if (this.x < player.x) this.x += this.speed; // Move towards player (x direction)
    else if (this.x > player.x) this.x -= this.speed;
    if (this.y < player.y) this.y += this.speed; // Move towards player (y direction)
    else if (this.y > player.y) this.y -= this.speed;
  }

  display(p) {
    p.fill(255, 0, 0);
    p.rect(this.x, this.y, this.size, this.size);
  }
}

const Game = () => {
  useEffect(() => {
    const sketch = (p) => {
      let player;
      let enemy;

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        player = new Player(p.width / 2, p.height / 2);
        enemy = new Enemy(p.width / 2, p.height / 2);
      };

      p.draw = () => {
        p.background(0);
        player.update(p);
        player.display(p);
        enemy.update(player);
        enemy.display(p);

        // Check for collision between player and enemy
        if (player.collides(enemy)) {
          // Separate player and enemy if collision occurs
          if (player.x < enemy.x) player.x -= player.speed;
          else player.x += player.speed;
          if (player.y < enemy.y) player.y -= player.speed;
          else player.y += player.speed;
        }
      };

      // Prevent default browser behavior for arrow keys
      p.keyPressed = () => {
        if ([65, 68, 87, 83].includes(p.keyCode)) {
          return false;
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
