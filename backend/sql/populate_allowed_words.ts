import fs from "node:fs";

// the file below can be found here: https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c
const filePath = "wordle-allowed-guesses.txt";
fs.readFile(filePath, "utf8", (err, data) => {
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
