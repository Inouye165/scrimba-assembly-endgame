// src/hooks/useHangmanGame.js

import { useState, useEffect, useCallback, useMemo } from 'react';
// 1. Import themes to access the lives count
import { themes, getRandomWordForTheme } from '../themes';

export default function useHangmanGame(themeId) {
  // 2. Find the full theme object to get its properties
  const currentTheme = useMemo(() => themes.find(t => t.id === themeId), [themeId]);
  const livesForTheme = useMemo(() => currentTheme.lives.length, [currentTheme]);

  const [currentWord, setCurrentWord] = useState(() => getRandomWordForTheme(themeId));
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [isShaking, setIsShaking] = useState(false);

  // Derived state
  const wrongGuesses = Array.from(guessedLetters).filter(l => !currentWord.includes(l));
  const wrongGuessCount = wrongGuesses.length;
  
  // 3. Use the dynamic 'livesForTheme' instead of hardcoded '6'
  const isGameLost = useCallback(() => wrongGuessCount >= livesForTheme, [wrongGuessCount, livesForTheme]);
  
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
  const resetGame = (newThemeId = themeId) => {
    setCurrentWord(getRandomWordForTheme(newThemeId));
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