import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  const games = [
    { name: 'Snake', route: '/snake', description: 'Play the classic Snake game and see how long you can grow!' },
    { name: 'Flappy Bird', route: '/flappy-bird', description: 'Navigate through pipes in this addictive flying game!' },
    { name: 'Speed Racer', route: '/speed-racer', description: 'Race against time in this thrilling car racing game!' },
    { name: 'Puzzle Mania', route: '/puzzle-mania', description: 'Challenge your mind with various brain-teasing puzzles!' },
    { name: 'Helix Jump', route: '/helix-jump', description: 'Test your reflexes in this addictive vertical platformer!' },
    { name: 'Memory Match', route: '/memory-match', description: 'Improve your memory skills with this classic card-matching game!' },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Minigames - Play Fun Games Online!</title>
        <meta name="description" content="Welcome to Minigames, your hub for fun and exciting online games!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Minigames!
        </h1>

        <p className={styles.description}>
          Choose a game and start playing now!
        </p>

        <div className={styles.grid}>
          {games.map((game) => (
            <Link href={game.route} key={game.name}>
              <a className={styles.card}>
                <h2>{game.name} &rarr;</h2>
                <p>{game.description}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
