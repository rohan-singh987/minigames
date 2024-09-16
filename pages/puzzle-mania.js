import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function PuzzleMania() {
  const [puzzle, setPuzzle] = useState([])
  const [solution, setSolution] = useState([])
  const [userInput, setUserInput] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    generatePuzzle()
  }, [])

  const generatePuzzle = () => {
    const numbers = Array.from({length: 9}, (_, i) => i + 1)
    const shuffled = numbers.sort(() => 0.5 - Math.random())
    setPuzzle(shuffled.slice(0, 3))
    setSolution(shuffled.slice(0, 3).sort((a, b) => a - b))
    setUserInput('')
    setMessage('')
  }

  const handleInputChange = (e) => {
    setUserInput(e.target.value)
  }

  const checkSolution = () => {
    const userSolution = userInput.split(',').map(num => parseInt(num.trim()))
    if (JSON.stringify(userSolution) === JSON.stringify(solution)) {
      setMessage('Congratulations! You solved the puzzle!')
    } else {
      setMessage('Sorry, that\'s not correct. Try again!')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Puzzle Mania - Minigames</title>
        <meta name="description" content="Play Puzzle Mania - Challenge your mind with various brain-teasing puzzles!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Puzzle Mania</h1>
        <p className={styles.description}>Challenge your mind with various brain-teasing puzzles!</p>
        
        <div className={styles.game}>
          <h2>Number Sorting Puzzle</h2>
          <p>Sort these numbers in ascending order:</p>
          <p className={styles.puzzleNumbers}>{puzzle.join(', ')}</p>
          <input 
            type="text" 
            value={userInput} 
            onChange={handleInputChange} 
            placeholder="Enter sorted numbers, separated by commas"
            className={styles.input}
          />
          <button onClick={checkSolution} className={styles.button}>Check Solution</button>
          <button onClick={generatePuzzle} className={styles.button}>New Puzzle</button>
          {message && <p className={styles.message}>{message}</p>}
        </div>

        <Link href="/">
          <a className={styles.card}>
            <h2>&larr; Back to Home</h2>
          </a>
        </Link>
      </main>
    </div>
  )
}