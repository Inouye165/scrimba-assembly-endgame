import { useState, useEffect } from "react";
import { clsx } from "clsx";
// Import themes and new helpers from your new themes.js file
import { themes, getRandomWordForTheme, getFarewellTextForTheme } from "./themes";

// This is your main App component now
export default function App() { // Renamed from AssemblyEndgame to App
    // State to hold the selected theme ID, default to 'languages'
    const [selectedThemeId, setSelectedThemeId] = useState('languages');

    // Get the current active theme object
    const currentTheme = themes.find(theme => theme.id === selectedThemeId);

    // Initial word generation uses the selected theme
    const [currentWord, setCurrentWord] = useState(() => getRandomWordForTheme(selectedThemeId));
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [isShaking, setIsShaking] = useState(false);

    // Derived values
    const wrongGuesses = Array.from(guessedLetters).filter(letter => !currentWord.includes(letter));
    const wrongGuessCount = wrongGuesses.length;
    // Use currentTheme.lives.length for max guesses, as it's dynamic now
    const isGameLost = wrongGuessCount >= currentTheme.lives.length;
    const isGameWon = currentWord.split("").every(letter => guessedLetters.has(letter));
    const isGameOver = isGameWon || isGameLost;
    const lastWrongGuess = wrongGuesses[wrongGuesses.length - 1];

    useEffect(() => {
        if (lastWrongGuess) {
            setIsShaking(true);
            const timeoutId = setTimeout(() => setIsShaking(false), 500);
            return () => clearTimeout(timeoutId);
        }
    }, [lastWrongGuess]);

    // Effect to reset game when theme changes
    useEffect(() => {
        startNewGame(); // Reset game when selectedThemeId changes
    }, [selectedThemeId]); // Dependency array includes selectedThemeId

    function addGuessedLetter(letter) {
        // Prevent adding letters if game is over
        if (isGameOver) return;
        setGuessedLetters(prev => new Set([...prev, letter]));
    }

    function startNewGame() {
        setCurrentWord(getRandomWordForTheme(selectedThemeId)); // Get new word from selected theme
        setGuessedLetters(new Set());
        setIsShaking(false); // Reset shaking state for new game
    }

    // Handle theme change from dropdown
    const handleThemeChange = (event) => {
        setSelectedThemeId(event.target.value);
    };

    // The chips should now represent the 'lives' of the currently selected theme
    const languageElements = currentTheme.lives.map((life, index) => (
        <span
            key={life.name || index} // Use name or index for key for flexibility
            className={clsx("chip", index < wrongGuessCount && "lost")}
            style={{ backgroundColor: life.backgroundColor, color: life.color }}
        >
            {life.name}
        </span>
    ));

    const letterElements = currentWord.split("").map((letter, index) => {
        const isRevealed = isGameLost || guessedLetters.has(letter);
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
        );
    });

    const keyboardElements = "abcdefghijklmnopqrstuvwxyz".split("").map(letter => {
        const isGuessed = guessedLetters.has(letter);
        const isCorrect = isGuessed && currentWord.includes(letter);
        const isWrong = isGuessed && !currentWord.includes(letter);

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
        );
    });

    function renderGameStatus() {
        if (!isGameOver && lastWrongGuess) {
            // Use the new helper for farewell text
            return (
                <p className="farewell-message">
                    {getFarewellTextForTheme(selectedThemeId, wrongGuessCount - 1)}
                </p>
            );
        }

        if (isGameWon) {
            return (
                <>
                    <h2>YOU WIN!</h2>
                    <p>The programming world is safe. Well done! 🎉</p>
                </>
            );
        }

        if (isGameLost) {
            return (
                <>
                    <h2>GAME OVER</h2>
                    <p>{currentTheme.loseMessage}</p> {/* Use theme-specific lose message */}
                </>
            );
        }

        return null;
    }

    return (
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word. Save the modern web.</p>
                <div className="theme-selector">
                    <label htmlFor="theme-select">Choose Theme: </label>
                    <select id="theme-select" value={selectedThemeId} onChange={handleThemeChange}>
                        {themes.map(theme => (
                            <option key={theme.id} value={theme.id}>
                                {theme.name}
                            </option>
                        ))}
                    </select>
                </div>
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
    );
}