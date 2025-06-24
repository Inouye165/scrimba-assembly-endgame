import { useState, useEffect } from "react"
import { clsx } from "clsx"
import Confetti from "react-confetti"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"

export default function AssemblyEndgame() {
    // State values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])
    // New state for the shake effect
    const [isShaking, setIsShaking] = useState(false) 

    // Derived values
    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const numGuessesLeft = languages.length - wrongGuessCount
    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    // Effect to trigger the shake animation on a wrong guess
    useEffect(() => {
        if (isLastGuessIncorrect) {
            setIsShaking(true)
            const timeoutId = setTimeout(() => setIsShaking(false), 500) // Duration of the shake animation
            return () => clearTimeout(timeoutId)
        }
    }, [guessedLetters, isLastGuessIncorrect])

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }
    
    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            "letter-box",
            shouldRevealLetter && "revealed",
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                <span className="letter-inner">
                    {shouldRevealLetter ? letter.toUpperCase() : ""}
                </span>
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver || isGuessed}
                aria-disabled={isGuessed}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
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
            {isGameWon && <Confetti gravity={0.15} numberOfPieces={300} />}
            
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word. Save the modern web.</p>
            </header>

            <section 
                aria-live="polite" 
                role="status" 
                className={gameStatusClass}
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

            {isGameOver && 
                <button 
                    className="new-game" 
                    onClick={startNewGame}
                >Play Again</button>}
        </main>
    )
}