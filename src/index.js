const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { calculateSyllables } = require("./syllablecounter");

const CSV_FILE = "data/syllables_data.csv";
const OUTPUT_FILE = path.join(process.cwd(), "out/result.txt");

function ensureOutDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

async function processCSVData() {
  console.log("Started processing words...");

  const incorrectWords = [];
  fs.createReadStream(path.join(process.cwd(), CSV_FILE))
    .pipe(csv())
    .on("data", (row) => {
      const word = row["Word"];
      const correctSyllables = parseInt(row["Number of Syllables"], 10);

      const computedSyllables = calculateSyllables(word);

      if (correctSyllables !== computedSyllables) {
        incorrectWords.push({ word, correctSyllables, computedSyllables });
      }
    })
    .on("end", () => {
      if (incorrectWords.length > 0) {
        console.log("Started processing incorrect words...");
        const header = "Word  |  Computed  |  Correct";
        const formattedIncorrectWords = incorrectWords.map(
          (wordObj) =>
            `${wordObj.word}  |  ${wordObj.computedSyllables}  |  ${wordObj.correctSyllables}`
        );

        ensureOutDirectoryExists(OUTPUT_FILE);

        // Calculate total count of incorrect words
        const totalCount = `Total Incorrect Words: ${incorrectWords.length}`;

        // Write incorrect words to file with total count at the top
        fs.writeFileSync(
          OUTPUT_FILE,
          `${totalCount}\n\n${header}\n${formattedIncorrectWords.join("\n")}`
        );
        console.log(`Results have been saved to: ${OUTPUT_FILE}`);
      } else {
        console.log("\nAll words have correct syllable counts.");
      }
    });
}

async function main() {
  try {
    await processCSVData();
  } catch (err) {
    console.log("Failed to calculate syllables: " + err);
  }
}

main();
