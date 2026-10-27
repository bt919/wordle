export type LetterStatus = "correct" | "misplaced" | "absent";
export function computeGuessStatus(word: string, guess: string): LetterStatus[] {
    let remaining = word;
    const status: LetterStatus[] = new Array(5).fill("absent");

    for (let i = 0; i < 5; i++) {
        const ch = guess.charAt(i).toLowerCase();
        if (ch === remaining.charAt(i)) {
            status[i] = "correct";
            remaining = `${remaining.slice(0, i)}0${remaining.slice(i + 1, 5)}`
        }
    }
    for (let i = 0; i < 5; i++) {
        if (status[i] === "correct") continue;
        const ch = guess.charAt(i).toLowerCase();
        const index = remaining.indexOf(ch);
        if (index !== -1) {
            status[i] = "misplaced";
            remaining = `${remaining.slice(0, index)}0${remaining.slice(index + 1, 5)}`;
        }
    }

    return status;
}
