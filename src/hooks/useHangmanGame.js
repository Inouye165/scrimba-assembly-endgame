// src/hooks/useHangmanGame.js
import { useState, useEffect, useCallback } from 'react';
import { getRandomWordForTheme } from '../themes';

/**
 * Custom hook encapsulating the game logic:
 * - Word selection
 * - Tracking guesses
 * - Win/loss detection
 * - Shaking state
 */
export default function useHangmanGame(themeId) {
  const [currentWord, setCurrentWord] = useState(() => getRandomWordForTheme(themeId));
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [isShaking, setIsShaking] = useState(false);

  // Derived state
  const wrongGuesses = Array.from(guessedLetters).filter(l => !currentWord.includes(l));
  const wrongGuessCount = wrongGuesses.length;
  const isGameLost = useCallback(() => wrongGuessCount >= 6, [wrongGuessCount]);
  const isGameWon = useCallback(
    () => currentWord.split('').every(l => guessedLetters.has(l)),
    [currentWord, guessedLetters]
  );
  const isGameOver = isGameWon() || isGameLost();

  // Shake effect on wrong guess
  useEffect(() => {
    if (wrongGuesses.length > 0 && !isGameOver) {
      setIsShaking(true);
      const id = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(id);
    }
  }, [wrongGuesses, isGameOver]);

  // Add a guessed letter
  const addGuess = letter => {
    if (isGameOver) return;
    setGuessedLetters(prev => new Set(prev).add(letter));
  };

  // Reset game (word & guesses)
  const resetGame = () => {
    setCurrentWord(getRandomWordForTheme(themeId));
    setGuessedLetters(new Set());
    setIsShaking(false);
  };

  return {
    currentWord,
    guessedLetters,
    wrongGuessCount,
    isGameWon: isGameWon(),
    isGameLost: isGameLost(),
    isGameOver,
    isShaking,
    addGuess,
    resetGame
  };
}
