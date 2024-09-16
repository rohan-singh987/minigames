import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function SpeedRacer() {
  const [gameState, setGameState] = useState('start')
  const [score, setScore] = useState(0)
  const canvasRef = useRef(null)
  const carRef = useRef({ x: 0, y: 0, width: 50, height: 80 })
  const obstaclesRef = useRef([])

  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let animationFrameId

      const car = carRef.current
      car.x = canvas.width / 2 - car.width / 2
      car.y = canvas.height - car.height - 20

      const gameLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw road
        ctx.fillStyle = '#333'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw car
        ctx.fillStyle = 'red'
        ctx.fillRect(car.x, car.y, car.width, car.height)
        
        // Move and draw obstacles
        obstaclesRef.current.forEach((obstacle, index) => {
          obstacle.y += 5
          ctx.fillStyle = 'blue'
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
          
          // Check collision
          if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
          ) {
            setGameState('gameover')
          }
          
          // Remove obstacles that are off screen
          if (obstacle.y > canvas.height) {
            obstaclesRef.current.splice(index, 1)
            setScore(prevScore => prevScore + 1)
          }
        })
        
        // Add new obstacles
        if (Math.random() < 0.02) {
          obstaclesRef.current.push({
            x: Math.random() * (canvas.width - 30),
            y: -50,
            width: 30,
            height: 50
          })
        }
        
        animationFrameId = requestAnimationFrame(gameLoop)
      }
      
      gameLoop()
      
      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [gameState])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    obstaclesRef.current = []
  }

  const handleKeyDown = (event) => {
    if (gameState === 'playing') {
      const car = carRef.current
      const canvas = canvasRef.current
      switch(event.key) {
        case 'ArrowLeft':
          car.x = Math.max(0, car.x - 10)
          break
        case 'ArrowRight':
          car.x = Math.min(canvas.width - car.width, car.x + 10)
          break
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameState])

  return (
    <div className={styles.container}>
      <Head>
        <title>Speed Racer - Minigames</title>
        <meta name="description" content="Play Speed Racer - Race against time in this thrilling car racing game!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Speed Racer</h1>
        <p className={styles.description}>Race against time in this thrilling car racing game!</p>
        
        {gameState === 'start' && (
          <div>
            <button className={styles.button} onClick={startGame}>Start Game</button>
            <p>Instructions: Use left and right arrow keys to avoid obstacles!</p>
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
  )
}