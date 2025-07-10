// src/themes.js

// Import your theme data and the master word list
import { languages } from './languages';
import { archery }   from './archery';
import { words as commonWords } from './words';

/**
 * An array of “themes” for your hangman game.
 * Each theme carries:
 *  - id      — used in your <select> and to look it up
 *  - name    — human-readable, for the dropdown
 *  - title   — the header <h1>
 *  - tagline — the header <p>
 *  - lives   — an array of life-tokens (languages or arrows)
 *  - farewellTextFn — a function that picks your “missed” message
 *  - loseMessage    — shown when you fully run out of lives
 */
export const themes = [
  {
    id: 'languages',
    name: 'Programming Languages',
    title: 'Assembly: Endgame',
    tagline: 'Guess the word. Save the modern web.',
    lives: languages,
    farewellTextFn: wrongIndex =>
      languages[wrongIndex]?.name ?? 'unknown',
    loseMessage: "You lose! Better start learning Assembly 😭"
  },
  {
    id: 'archery',
    name: 'Archery Terms',
    title: 'Bullseye: Endgame',
    tagline: 'Aim true — don’t let your arrows fly forever!',
    lives: archery,
    farewellTextFn: wrongIndex =>
      archery[wrongIndex]
        ? `You missed! Goodbye, ${archery[wrongIndex].name}!`
        : `You missed an arrow!`,
    loseMessage: "You ran out of arrows! 🏹"
  }
];

/**
 * Picks a random word from your single master word list.
 * (Themes all share the same guess-words.)
 */
export function getRandomWordForTheme() {
  if (!commonWords.length) {
    console.warn('No words available in the master list.');
    return '';
  }
  const idx = Math.floor(Math.random() * commonWords.length);
  return commonWords[idx];
}

/**
 * Given a themeId and the index of the wrong guess,
 * returns the appropriate “farewell” message.
 */
export function getFarewellTextForTheme(themeId, wrongGuessIndex) {
  const theme = themes.find(t => t.id === themeId);
  if (!theme || typeof theme.farewellTextFn !== 'function') {
    return 'Oh no!';
  }
  return theme.farewellTextFn(wrongGuessIndex);
}
