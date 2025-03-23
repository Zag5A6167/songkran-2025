import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function Game() {
  const gameRef = useRef(null);
  const gameInstance = useRef(null);
  const playerRef = useRef(null);
  const cursorsRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 300,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      parent: gameRef.current,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    if (gameRef.current && !gameInstance.current) {
      gameInstance.current = new Phaser.Game(config);
    }

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
        gameInstance.current = null;
      }
    };
  }, []);

  function preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('player', 'assets/player.png');
  }

  function create() {
    
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    playerRef.current = this.add.image(centerX, centerY, 'player');
    playerRef.current.setScale(0.5);

    cursorsRef.current = {

      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),

      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),


    };

    this.input.on('pointerdown', () => {
      if (playerRef.current) {
        const playerX = playerRef.current.x;

        const playerY = playerRef.current.y;

        const graphics = this.add.graphics();
        graphics.fillStyle(0x25b0ec, 1);
        const circle = graphics.fillCircle(playerX, playerY+20, 4);


        const direction = playerRef.current.flipX ? -1 : 1; 
        circlesRef.current.push({ circle, direction });


      }
    });
  }

  function update() {
    if (playerRef.current && cursorsRef.current) {
      const speed = 5;

      if (cursorsRef.current.left.isDown) {
        playerRef.current.x -= speed;
        playerRef.current.flipX = true;

      } else if (cursorsRef.current.right.isDown) {

        playerRef.current.x += speed;
        playerRef.current.flipX = false;

      }
    }


    circlesRef.current.forEach((circleData) => {
      const { circle, direction } = circleData;
      circle.x += 10 * direction; 
    });
  }

  return <div id="game-container" ref={gameRef} />;
}

export default Game;