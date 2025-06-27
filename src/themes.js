// src/themes.js

import { languages } from './languages'; // Assuming this exports an array of language objects
import { archery } from './archery';   // Assuming this exports an array of archery objects

export const themes = [
    {
        id: 'languages',
        name: 'Programming Languages',
        // words: uses .name.toLowerCase() because 'languages' array items are objects
        words: languages.map(lang => lang.name.toLowerCase()),
        lives: languages, // Use the language objects for lives/chips (they have name, color, background)
        farewellTextFn: (wrongGuessIndex) => languages[wrongGuessIndex] ? languages[wrongGuessIndex].name : 'unknown',
        loseMessage: "You lose! Better start learning Assembly 😭"
    },
    {
        id: 'archery',
        name: 'Archery Terms',
        // FIX: words: now uses .name.toLowerCase() because 'archery' array items are also objects
        words: archery.map(term => term.name.toLowerCase()),
        // IMPROVEMENT: lives: now uses the 'archery' objects directly for lives/chips
        // This allows them to use their defined name, backgroundColor, and color
        lives: archery, 
        // IMPROVEMENT: farewellTextFn: can now include the name of the lost arrow/term
        farewellTextFn: (wrongGuessIndex) => archery[wrongGuessIndex] ? `You missed! Goodbye, ${archery[wrongGuessIndex].name}!` : `You missed an arrow!`,
        loseMessage: "You ran out of arrows! 🏹"
    }
    // Add more themes here in the future
    /*
    {
        id: 'animals',
        name: 'Animals',
        words: ['lion', 'tiger', 'elephant', 'giraffe'], // Example for a theme with simple string words
        lives: Array.from({ length: 7 }, (_, i) => ({ // Example for generic lives if not tied to specific data
            name: `Life ${i + 1}`, 
            backgroundColor: '#add8e6', 
            color: '#000' 
        })),
        farewellTextFn: (wrongGuessIndex) => `A life slips away...`,
        loseMessage: "No lives left!"
    }
    */
];

// Helper to get a random word from a specific theme
export const getRandomWordForTheme = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme || theme.words.length === 0) {
        console.warn(`Theme "${themeId}" not found or has no words.`);
        return "default"; // Fallback word
    }
    const randomIndex = Math.floor(Math.random() * theme.words.length);
    return theme.words[randomIndex];
};

// Helper to get farewell text based on theme and wrongGuessIndex
export const getFarewellTextForTheme = (themeId, wrongGuessIndex) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme || !theme.farewellTextFn) {
        return "Oh no!"; // Fallback if farewellTextFn is missing
    }
    
    // Call the theme-specific farewell function
    // Pass the index directly; the function itself should handle boundary checks if needed
    return theme.farewellTextFn(wrongGuessIndex);
};