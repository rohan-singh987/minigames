import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const CANVAS_SIZE = [800, 600];
const SNAKE_START = [[8, 7], [8, 8]];
const APPLE_START = [8, 3];
const SCALE = 40;
const SPEED = 200; // Adjust speed here
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export default function Snake() {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (DIRECTIONS[keyCode]) {
        setDir(DIRECTIONS[keyCode]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const moveSnake = () => {
    const snakeCopy = [...snake];
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const createApple = () => apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    ) return true;

    for (const segment of snake) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple)) {
        newApple = createApple();
      }
      setApple(newApple);
      setScore(score + 1);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    moveSnake();
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(([x, y]) => {
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    });

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple[0] * SCALE, apple[1] * SCALE, SCALE, SCALE);
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Snake Game - Minigames</title>
        <meta name="description" content="Play the classic Snake game and see how long you can grow!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Snake Game</h1>
        <p className={styles.description}>Use arrow keys to move the snake. Eat apples to grow!</p>
        
        <div role="button" tabIndex="0">
          <canvas
            style={{ border: "1px solid red" }}
            ref={canvasRef}
            width={`${CANVAS_SIZE[0]}px`}
            height={`${CANVAS_SIZE[1]}px`}
          />
        </div>
        
        {gameOver && <div>Game Over! Your score: {score}</div>}
        
        <button onClick={startGame} className={styles.button}>
          {gameOver ? 'Restart Game' : 'Start Game'}
        </button>
        
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

// Custom hook for game loop
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}