import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const CANVAS_SIZE = [400, 600];
const BIRD_SIZE = [50, 35];
const GRAVITY = 0.5;
const JUMP_STRENGTH = 10;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;

export default function FlappyBird() {
  const canvasRef = useRef(null);
  const birdRef = useRef({ y: CANVAS_SIZE[1] / 2, velocity: 0 });
  const pipesRef = useRef([]);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const bird = new Image();
    bird.src = '/flappy-bird.png';  // Make sure to add this image to your public folder

    const gameLoop = () => {
      if (gameState === 'playing') {
        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);

        // Update bird position
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;

        // Draw bird as a green ball
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(50 + BIRD_SIZE[0] / 2, birdRef.current.y + BIRD_SIZE[1] / 2, BIRD_SIZE[0] / 2, 0, Math.PI * 2);
        ctx.fill();

        // Update and draw pipes
        pipesRef.current.forEach((pipe, index) => {
          pipe.x -= 2;
          ctx.fillStyle = 'green';
          ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
          ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, CANVAS_SIZE[1] - pipe.bottom);

          // Check collision
          if (
            50 < pipe.x + PIPE_WIDTH &&
            50 + BIRD_SIZE[0] > pipe.x &&
            (birdRef.current.y < pipe.top || birdRef.current.y + BIRD_SIZE[1] > pipe.bottom)
          ) {
            setGameState('gameover');
          }

          // Increase score
          if (pipe.x + PIPE_WIDTH < 50 && !pipe.passed) {
            setScore(prevScore => prevScore + 1);
            pipesRef.current[index].passed = true;
          }
        });

        // Remove off-screen pipes
        if (pipesRef.current[0] && pipesRef.current[0].x < -PIPE_WIDTH) {
          pipesRef.current.shift();
        }

        // Add new pipe
        if (pipesRef.current.length === 0 || pipesRef.current[pipesRef.current.length - 1].x < CANVAS_SIZE[0] - 200) {
          const pipeY = Math.random() * (CANVAS_SIZE[1] - PIPE_GAP - 100) + 50;
          pipesRef.current.push({
            x: CANVAS_SIZE[0],
            top: pipeY,
            bottom: pipeY + PIPE_GAP,
            passed: false
          });
        }

        // Check if bird is off screen
        if (birdRef.current.y > CANVAS_SIZE[1] - BIRD_SIZE[1] || birdRef.current.y < 0) {
          setGameState('gameover');
        }

        requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        if (gameState === 'playing') {
          birdRef.current.velocity = -JUMP_STRENGTH;
        } else if (gameState === 'start' || gameState === 'gameover') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState]);

  const startGame = () => {
    birdRef.current = { y: CANVAS_SIZE[1] / 2, velocity: 0 };
    pipesRef.current = [];
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Flappy Bird - Minigames</title>
        <meta name="description" content="Play Flappy Bird - Navigate through pipes in this addictive flying game!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Flappy Bird</h1>
        <p className={styles.description}>Press Space to flap and navigate through the pipes!</p>
        
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
          style={{ border: '1px solid black' }}
          tabIndex="0"
        />
        
        {gameState === 'start' && (
          <button onClick={startGame} className={styles.button}>Start Game</button>
        )}
        
        {gameState === 'gameover' && (
          <div>
            <p>Game Over! Your score: {score}</p>
            <button onClick={startGame} className={styles.button}>Restart Game</button>
          </div>
        )}
        
        <p>Score: {score}</p>

        <Link href="/">
          <a className={styles.card}>
            <h2>&larr; Back to Home</h2>
          </a>
        </Link>
      </main>
    </div>
  );
}