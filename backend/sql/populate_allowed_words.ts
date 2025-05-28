import fs from "node:fs";

// the file below can be found here: https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c
// this file also contains previous wordle answers so this script should be ran twice: https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b
const filePath = "wordle-allowed-guesses.txt";
const filePath1 = "wordle-answers-alphabetical.txt";
fs.readFile(filePath1, "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let count = 0;
    let current = "";
    for (const ch of data) {
        if (count === 5) {
            console.log(`INSERT INTO allowed_words SELECT '${current}';`);
            count = 0;
            current = "";
        } else {
            count += 1;
            current += ch;
        }
    }
});
