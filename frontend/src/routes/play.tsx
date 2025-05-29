import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api-url";
import { GuessBar } from "@/components/GuessBar";
import { WordleLogo } from "@/components/WordleLogo";

export const Route = createFileRoute("/play")({
    component: Play,
});

function Play() {
    const [guesses, setGuesses] = useState<string[]>(["", "", "", "", "", ""]);
    const [isFetching, setIsFetching] = useState(false)
    const [correctLetters, setCorrectLetters] = useState<Array<number>[]>([
        [],
        [],
        [],
        [],
        [],
        [],
    ]);
    const [misplacedLetters, setMisplacedLetters] = useState<Array<number[]>>([
        [],
        [],
        [],
        [],
        [],
        [],
    ]);

    const fetchGuess = async (guess: string) => {
        const res = await fetch(`${apiUrl}/word`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ guess }),
        });
        if (!res.ok) {
            // handle errors
        }
        const data = await res.json();
        console.log(data);
        return data;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const currentIndex = guesses.findIndex((guess) => guess.length < 5);
        const ch = e.key;
        if (
            currentIndex === -1 ||
            !(
                (ch.length === 1 && ch >= "a" && ch <= "z") ||
                (ch.length === 1 && ch >= "A" && ch <= "Z") ||
                ch === "Backspace"
            )
        ) {
            return;
        }

        setGuesses((prev) => {
            const currentGuess = prev[currentIndex];

            if (ch === "Backspace") {
                if (currentGuess.length > 0) {
                    const newGuesses = [
                        ...prev.slice(0, currentIndex),
                        currentGuess.slice(0, currentGuess.length - 1),
                        ...prev.slice(currentIndex + 1, prev.length),
                    ];
                    return newGuesses;
                }
                return prev;
            }

            const nextGuess = currentGuess.concat(ch.toUpperCase());
            if (nextGuess.length === 5) {
                setIsFetching(true)
                fetchGuess(nextGuess)
            }
            setIsFetching(false)
            const newGuesses = [
                ...prev.slice(0, currentIndex),
                nextGuess,
                ...prev.slice(currentIndex + 1, prev.length),
            ];
            return newGuesses;
        });
    };

    useEffect(() => {
        !isFetching && window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown, isFetching]);

    return (
        <div className="bg-slate-950 text-slate-300 h-screen w-screen flex flex-col justify-center items-center">
            <WordleLogo theme="dark" />

            <div className="flex flex-col gap-2">
                {guesses.map((guess, i) => (
                    <GuessBar guess={guess} key={`${i}${guess}`} />
                ))}
            </div>
        </div>
    );
}
