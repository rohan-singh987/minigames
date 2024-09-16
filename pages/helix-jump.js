import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function HelixJump() {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 0, y: 0, radius: 10, speed: 0 });

  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ballRef.current = { ...ballRef.current, x: centerX, y: 50, speed: 0 };
      let helix = {
        rotation: 0,
        rotationSpeed: 0.02,
        levels: 10,
        levelHeight: 50,
        radius: 150,
        holeSize: Math.PI / 3,
      };
      let currentLevel = 0;
      let gravity = 0.2;

      const drawHelix = () => {
        for (let i = 0; i < helix.levels; i++) {
          const y = canvas.height - i * helix.levelHeight;
          const startAngle = helix.rotation + i * (Math.PI / 4);
          const endAngle = startAngle + 2 * Math.PI - helix.holeSize;

          ctx.beginPath();
          ctx.arc(centerX, centerY, helix.radius, startAngle, endAngle);
          ctx.strokeStyle = i === currentLevel ? 'red' : 'blue';
          ctx.lineWidth = 10;
          ctx.stroke();
        }
      };

      const drawBall = () => {
        ctx.beginPath();
        ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
      };

      const drawInstructions = () => {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('Press Space to Jump!', 10, 20);
      };

      const checkCollision = () => {
        const levelY = canvas.height - currentLevel * helix.levelHeight;
        if (ballRef.current.y + ballRef.current.radius > levelY - 5 && ballRef.current.y - ballRef.current.radius < levelY + 5) {
          const angle = Math.atan2(ballRef.current.y - centerY, ballRef.current.x - centerX) - helix.rotation - currentLevel * (Math.PI / 4);
          if (angle > 0 && angle < 2 * Math.PI - helix.holeSize) {
            ballRef.current.speed = -8; // Bounce
            currentLevel++;
            setScore((prevScore) => prevScore + 1);
          }
        }
      };

      const gameLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        helix.rotation += helix.rotationSpeed;
        ballRef.current.y += ballRef.current.speed;
        ballRef.current.speed += gravity;

        const angle = helix.rotation + currentLevel * (Math.PI / 4);
        ballRef.current.x = centerX + helix.radius * Math.cos(angle);

        drawHelix();
        drawBall();
        drawInstructions();
        checkCollision();

        if (ballRef.current.y > canvas.height + ballRef.current.radius) {
          setGameState('gameover');
        }

        animationFrameId = requestAnimationFrame(gameLoop);
      };

      gameLoop();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const handleKeyPress = (event) => {
    if (event.code === 'Space' && gameState === 'playing') {
      ballRef.current.speed = -8; // Adjust jump height
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Helix Jump - Minigames</title>
        <meta name="description" content="Play Helix Jump - Test your reflexes in this addictive vertical platformer!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Helix Jump</h1>
        <p className={styles.description}>Test your reflexes in this addictive vertical platformer!</p>
        
        {gameState === 'start' && (
          <div>
            <button className={styles.button} onClick={startGame}>Start Game</button>
            <p>Instructions: Press Space to jump through the gaps!</p>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <p>Score: {score}</p>
            <canvas ref={canvasRef} width="400" height="600" style={{ border: '1px solid black' }} />
          </div>
        )}

        {gameState === 'gameover' && (
          <div>
            <p>Game Over! Your score: {score}</p>
            <button className={styles.button} onClick={startGame}>Restart</button>
          </div>
        )}

        <Link href="/">
          <a className={styles.card}>
            <h2>&larr; Back to Home</h2>
          </a>
        </Link>
      </main>
    </div>
  );
}