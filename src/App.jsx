import React, { useState } from "react";
import { clsx } from "clsx";
import { themes, getFarewellTextForTheme } from "./themes";
import useHangmanGame from "./hooks/useHangmanGame";

export default function App() {
  const [selectedThemeId, setSelectedThemeId] = useState("languages");
  const currentTheme = themes.find(t => t.id === selectedThemeId);

  const {
    currentWord,
    guessedLetters,
    wrongGuessCount,
    isGameWon,
    isGameLost,
    isGameOver,
    isShaking,
    addGuess,
    resetGame,
  } = useHangmanGame(selectedThemeId);

  const handleThemeChange = e => {
    const newThemeId = e.target.value;
    setSelectedThemeId(newThemeId);
    resetGame(newThemeId);
  };

  // Render life chips (e.g., arrows or languages)
  const lifeChips = currentTheme.lives.map((life, idx) => (
    <span
      key={idx}
      className={clsx("chip", idx < wrongGuessCount && "lost")}
      style={{ backgroundColor: life.backgroundColor, color: life.color }}
    >
      {life.name}
    </span>
  ));

  // Render the word boxes
  const letterBoxes = currentWord.split("").map((letter, idx) => {
    const isRevealed = isGameLost || guessedLetters.has(letter);
    return (
      <span
        key={idx}
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

  // Render the on-screen keyboard
  const keyboardButtons = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map(letter => {
      const isGuessed = guessedLetters.has(letter);
      const isCorrect = isGuessed && currentWord.includes(letter);
      const isWrong = isGuessed && !currentWord.includes(letter);
      return (
        <button
          key={letter}
          className={clsx({ correct: isCorrect, wrong: isWrong })}
          disabled={isGameOver || isGuessed}
          aria-label={`Letter ${letter}`}
          onClick={() => addGuess(letter)}
        >
          {letter.toUpperCase()}
        </button>
      );
    });

  function renderGameStatus() {
    if (!isGameOver && wrongGuessCount > 0) {
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
          <p>{currentTheme.loseMessage}</p>
        </>
      );
    }
    return null;
  }

  return (
    <main>
      <header>
        <h1>{currentTheme.title}</h1>
        <p>{currentTheme.tagline}</p>
        <div className="theme-selector">
          <label htmlFor="theme-select">Choose Theme: </label>
          <select
            id="theme-select"
            value={selectedThemeId}
            onChange={handleThemeChange}
          >
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
          farewell: !isGameOver && wrongGuessCount > 0,
        })}
      >
        {renderGameStatus()}
      </section>

      <section className="language-chips" aria-label="Guesses left">
        {lifeChips}
      </section>

      <section className={clsx("word", isShaking && "shake")} aria-label="Current word">
        {letterBoxes}
      </section>

      <section className="keyboard" aria-label="Keyboard">
        {keyboardButtons}
      </section>

      {isGameOver && (
        <button className="new-game" onClick={() => resetGame(selectedThemeId)}>
          Play Again
        </button>
      )}
    </main>
  );
}
