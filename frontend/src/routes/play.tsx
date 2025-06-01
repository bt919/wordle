import clsx from "clsx";
import { createFileRoute } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api-url";
import { GuessBar } from "@/components/GuessBar";
import { Keyboard } from "@/components/Keyboard";
import { WordleLogo } from "@/components/WordleLogo";

export const Route = createFileRoute("/play")({
	component: Play,
});

function Play() {
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [isGuessesComplete, setIsGuessesComplete] = useState(
		new Array(6).fill(false),
	);
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
			setShowErrorMessage(true);
			setTimeout(() => {
				setShowErrorMessage(false);
			}, 1000);
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
		setIsGuessesComplete((prev) => [
			...prev.slice(0, currentIndex),
			true,
			...prev.slice(currentIndex + 1, 6),
		]);
		setIsFetching(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.repeat) {
			return;
		}

		const currentIndex = guesses.findIndex((guess) => guess.length < 5);
		const key = e.key;

		// trigger fetch only when "Enter" is hit
		if (isFetching) {
			const lastIndex = currentIndex === -1 ? 5 : currentIndex - 1;
			if (key === "Backspace") {
				setGuesses((prev) => {
					return [
						...prev.slice(0, lastIndex),
						prev[lastIndex].slice(0, 4),
						...prev.slice(lastIndex + 1, prev.length),
					];
				});
				setIsFetching(false);
				return;
			}

			if (key !== "Enter") {
				return;
			}

			fetchGuess(guesses[lastIndex], lastIndex);
			return;
		}

		if (
			isGuessCorrect ||
			currentIndex === -1 ||
			!(
				(key.length === 1 && key >= "a" && key <= "z") ||
				(key.length === 1 && key >= "A" && key <= "Z") ||
				key === "Backspace"
			)
		) {
			return;
		}

		setGuesses((prev) => {
			const currentGuess = prev[currentIndex];

			if (key === "Backspace") {
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

			const nextGuess = currentGuess.concat(key.toUpperCase());
			if (nextGuess.length === 5) {
				setIsFetching(true);
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
		console.log("useEffect fired from play.tsx");
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isFetching, handleKeyDown]);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col justify-center items-center relative">
			<WordleLogo theme="dark" />

			<div
				className={twMerge(
					clsx(
						"absolute bg-slate-100 p-2 rounded-lg top-[100px] sm:top-[140px] invisible",
						{
							visible: showErrorMessage,
						},
					),
				)}
			>
				<p className="text-slate-900 font-bold">Not in word list</p>
			</div>

			<div className="flex flex-col gap-2">
				{guesses.map((guess, i) => (
					<GuessBar
						isGuessComplete={isGuessesComplete[i]}
						guess={guess}
						correctLetters={correctLetters[i]}
						misplacedLetters={misplacedLetters[i]}
						key={`${i}${guess}`}
						cn={showErrorMessage ? "animate-shake" : ""}
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
