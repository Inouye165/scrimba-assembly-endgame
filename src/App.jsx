import { useState, useEffect } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"

export default function AssemblyEndgame() {
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState(new Set())
    const [isShaking, setIsShaking] = useState(false)

    // Derived values
    const wrongGuesses = Array.from(guessedLetters).filter(letter => !currentWord.includes(letter))
    const wrongGuessCount = wrongGuesses.length
    const isGameWon = currentWord.split("").every(letter => guessedLetters.has(letter))
    const isGameLost = wrongGuessCount >= languages.length
    const isGameOver = isGameWon || isGameLost
    const lastWrongGuess = wrongGuesses[wrongGuesses.length - 1]

    useEffect(() => {
        if (lastWrongGuess) {
            setIsShaking(true)
            const timeoutId = setTimeout(() => setIsShaking(false), 500)
            return () => clearTimeout(timeoutId)
        }
    }, [lastWrongGuess])

    function addGuessedLetter(letter) {
        setGuessedLetters(prev => new Set([...prev, letter]))
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters(new Set())
    }

    const languageElements = languages.map((lang, index) => (
        <span
            key={lang.name}
            className={clsx("chip", index < wrongGuessCount && "lost")}
            style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
        >
            {lang.name}
        </span>
    ))

    const letterElements = currentWord.split("").map((letter, index) => {
        const isRevealed = isGameLost || guessedLetters.has(letter)
        return (
            <span 
                key={index} 
                className={clsx(
                    "letter-box",
                    isRevealed && "revealed",
                    isGameLost && !guessedLetters.has(letter) && "missed-letter"
                )}
            >
                <span className="letter-inner">
                    {isRevealed ? letter.toUpperCase() : ""}
                </span>
            </span>
        )
    })

    const keyboardElements = "abcdefghijklmnopqrstuvwxyz".split("").map(letter => {
        const isGuessed = guessedLetters.has(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)

        return (
            <button
                key={letter}
                className={clsx({ correct: isCorrect, wrong: isWrong })}
                disabled={isGameOver || isGuessed}
                aria-disabled={isGuessed}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    function renderGameStatus() {
        if (!isGameOver && lastWrongGuess) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>YOU WIN!</h2>
                    <p>The programming world is safe. Well done! 🎉</p>
                </>
            )
        }
        
        if (isGameLost) {
            return (
                <>
                    <h2>GAME OVER</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }

        return null
    }

    return (
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word. Save the modern web.</p>
            </header>

            <section
                aria-live="polite"
                role="status"
                className={clsx("game-status", {
                    won: isGameWon,
                    lost: isGameLost,
                    farewell: !isGameOver && lastWrongGuess
                })}
            >
                {renderGameStatus()}
            </section>

            <section className="language-chips" aria-label="Guesses left">
                {languageElements}
            </section>

            <section className={clsx("word", isShaking && "shake")} aria-label="Current word">
                {letterElements}
            </section>
            
            <section className="keyboard" aria-label="Keyboard">
                {keyboardElements}
            </section>

            {isGameOver && (
                <button className="new-game" onClick={startNewGame}>
                    Play Again
                </button>
            )}
        </main>
    )
}