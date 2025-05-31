import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api-url";
import { GuessBar } from "@/components/GuessBar";
import { Keyboard } from "@/components/Keyboard";
import { WordleLogo } from "@/components/WordleLogo";

export const Route = createFileRoute("/play")({
	component: Play,
});

function Play() {
	const [isKeyPressed, setIsKeyPressed] = useState(false);
	const [isGuessCorrect, setIsGuessCorrect] = useState(false);
	const [guesses, setGuesses] = useState<string[]>(["", "", "", "", "", ""]);
	const [isFetching, setIsFetching] = useState(false);
	const [correctLetters, setCorrectLetters] = useState<number[][]>([
		[],
		[],
		[],
		[],
		[],
		[],
	]);
	const [misplacedLetters, setMisplacedLetters] = useState<number[][]>([
		[],
		[],
		[],
		[],
		[],
		[],
	]);

	const fetchGuess = async (guess: string, currentIndex: number) => {
		const res = await fetch(`${apiUrl}/word`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ guess }),
		});
		if (!res.ok) {
			// handle errors (could do a toast here)
			return;
		}
		const data = await res.json();
		setCorrectLetters((prev) => [
			...prev.slice(0, currentIndex),
			data.correctLetters,
			...prev.slice(currentIndex + 1, 6),
		]);
		setMisplacedLetters((prev) => [
			...prev.slice(0, currentIndex),
			data.misplacedLetters,
			...prev.slice(currentIndex + 1, 6),
		]);
		if (data.correctLetters.length === 5) {
			setIsGuessCorrect(true);
		}
		setIsFetching(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.repeat) {
			return;
		}

		const currentIndex = guesses.findIndex((guess) => guess.length < 5);
		const ch = e.key;
		if (
			isKeyPressed ||
			isGuessCorrect ||
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
				setIsFetching(true);
				fetchGuess(nextGuess, currentIndex);
			}
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
		<div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col justify-center items-center">
			<WordleLogo theme="dark" />

			<div className="flex flex-col gap-2">
				{guesses.map((guess, i) => (
					<GuessBar
						guess={guess}
						correctLetters={correctLetters[i]}
						misplacedLetters={misplacedLetters[i]}
						key={`${i}${guess}`}
					/>
				))}
			</div>

			<Keyboard
				correctLetters={correctLetters}
				misplacedLetters={misplacedLetters}
				guesses={guesses}
			/>
		</div>
	);
}
