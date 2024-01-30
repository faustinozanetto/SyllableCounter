// List of problematic words and their syllable counts
const problematicWords = {
  example: 3,
  anotherWord: 4,
};

// Function to count syllables in a word
function countSyllables(word) {
  word = word.toLowerCase(); // Lowercase

  if (problematicWords.hasOwnProperty(word)) {
    return problematicWords[word];
  }

  // Splitting hyphenated and compound words
  if (word.includes("-")) {
    return word.split("-").reduce((acc, part) => acc + countSyllables(part), 0);
  }

  word = word.replace(/\W/g, ""); // Remove non-alphabetic characters
  if (word.length <= 3) {
    return 1;
  }

  word = word.replace(/'s$/, ""); // Possessive case

  // Improved regex for vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);

  if (!vowelGroups) return 0; // No vowels, no syllables

  let syllableCount = vowelGroups.length;

  // Handling silent 'e' and specific word endings
  if (word.endsWith("e") && syllableCount > 1 && !/le$/.test(word)) {
    syllableCount -= 1; // Silent 'e' at the end, except for 'le'
  }

  if ((word.endsWith("es") || word.endsWith("ed")) && syllableCount > 1) {
    const secondLastChar = word.charAt(word.length - 3);
    if (!"aeiouy".includes(secondLastChar)) {
      syllableCount -= 1; // Subtract for silent 'es'/'ed'
    }
  }

  return syllableCount;
}

// Function to calculate the total syllables in userInput
function calculateSyllables(userInput) {
  const words = userInput.trim().split(/\s+/);
  let totalSyllables = 0;

  for (let word of words) {
    if (word.length === 0) continue; // Skip empty words
    totalSyllables += countSyllables(word);
  }

  return totalSyllables;
}

module.exports = { calculateSyllables };
