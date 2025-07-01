// src/themes.js

import { languages } from './languages'; // for lives and metadata
import { archery } from './archery';   // for lives and metadata
import { words as commonWords } from './words'; // master word list for guessing

// Theme definitions now only include lives and messaging logic
export const themes = [
  {
    id: 'languages',
    name: 'Programming Languages',
    lives: languages,
    farewellTextFn: (wrongGuessIndex) =>
      languages[wrongGuessIndex]
        ? languages[wrongGuessIndex].name
        : 'unknown',
    loseMessage: "You lose! Better start learning Assembly 😭"
  },
  {
    id: 'archery',
    name: 'Archery Terms',
    lives: archery,
    farewellTextFn: (wrongGuessIndex) =>
      archery[wrongGuessIndex]
        ? `You missed! Goodbye, ${archery[wrongGuessIndex].name}!`
        : `You missed an arrow!`,
    loseMessage: "You ran out of arrows! 🏹"
  }
];

// Always pick from the single master list, ignoring theme-specific words
export function getRandomWordForTheme() {
  if (!commonWords.length) {
    console.warn('No words available in the master list.');
    return '';
  }
  const idx = Math.floor(Math.random() * commonWords.length);
  return commonWords[idx];
}

// Retain theme-specific farewell messaging
export function getFarewellTextForTheme(themeId, wrongGuessIndex) {
  const theme = themes.find(t => t.id === themeId);
  if (!theme || typeof theme.farewellTextFn !== 'function') {
    return 'Oh no!';
  }
  return theme.farewellTextFn(wrongGuessIndex);
}
