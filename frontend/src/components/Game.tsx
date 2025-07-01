import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api-url";
import { GuessBar } from "@/components/GuessBar";
import { Keyboard } from "@/components/Keyboard";
import { WordleLogo } from "@/components/WordleLogo";

export function Game({
	wordLength,
	wordleId,
	gameMode,
}: {
	wordLength: number;
	wordleId?: string;
	gameMode: "classic" | "custom";
}) {
	const [isInvalidWord, setIsInvalidWord] = useState(false);
	const [showWinMessage, setShowWinMessage] = useState(false);
	const [showLossMessage, setShowLossMessage] = useState(false);
	const [word, setWord] = useState(""); // only shown on loss
	const [isGuessesComplete, setIsGuessesComplete] = useState(
		new Array(6).fill(false),
	);
	const [isGuessCorrect, setIsGuessCorrect] = useState(false);
	const [guesses, setGuesses] = useState<string[]>(["", "", "", "", "", ""]);
	const [isCurrentGuessFull, setIsCurrentGuessFull] = useState(false);
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
		const guessEndpoint =
			gameMode === "classic" ? "/word" : `/custom-word/${wordleId}`;
		const res = await fetch(`${apiUrl}${guessEndpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ guess }),
		});
		if (!res.ok) {
			setIsInvalidWord(true);
			setTimeout(() => {
				setIsFetching(false);
			}, 250);
			setTimeout(() => {
				setIsInvalidWord(false);
			}, 1000);
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

		setIsGuessesComplete((prev) => [
			...prev.slice(0, currentIndex),
			true,
			...prev.slice(currentIndex + 1, 6),
		]);
		if (data.correctLetters.length === wordLength) {
			setIsGuessCorrect(true);
			setTimeout(() => {
				setShowWinMessage(true);
			}, 1500);
			setTimeout(() => {
				setShowWinMessage(false);
			}, 3000);
			return;
		}

		if (isGuessesComplete[4]) {
			// player has lost
			const wordEndpoint =
				gameMode === "classic" ? "/word" : `/custom-word/length/${wordleId}`;
			const wordRes = await fetch(`${apiUrl}${wordEndpoint}`);
			if (!wordRes.ok) {
				return;
			}
			const data = await wordRes.json();
			setTimeout(() => {
				setWord(data.word.toUpperCase());
				setShowLossMessage(true);
			}, 1500);
		}

		setTimeout(() => {
			setIsCurrentGuessFull(false);
			setIsFetching(false);
		}, 1500);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.repeat) {
			return;
		}

		const currentIndex = guesses.findIndex(
			(guess) => guess.length < wordLength,
		);
		const key = e.key;

		// trigger fetch only when "Enter" is hit
		if (isCurrentGuessFull) {
			if (isFetching) {
				return;
			}
			const lastIndex = currentIndex === -1 ? 5 : currentIndex - 1;
			if (key === "Backspace") {
				setGuesses((prev) => {
					return [
						...prev.slice(0, lastIndex),
						prev[lastIndex].slice(0, 4),
						...prev.slice(lastIndex + 1, prev.length),
					];
				});
				setIsCurrentGuessFull(false);
				return;
			}

			if (key !== "Enter") {
				return;
			}

			setIsFetching(true);
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
			if (nextGuess.length === wordLength) {
				setIsCurrentGuessFull(true);
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
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isCurrentGuessFull, handleKeyDown]);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col justify-center items-center relative">
			<WordleLogo theme="dark" />

			<div
				className={twMerge(
					clsx(
						"opacity-80 absolute bg-slate-100 p-2 rounded-lg top-[100px] sm:top-[140px] invisible",
						{
							visible: isInvalidWord,
						},
					),
				)}
			>
				<p className="text-slate-900 font-bold">Not in word list</p>
			</div>

			<div
				className={twMerge(
					clsx(
						"opacity-80 absolute bg-slate-100 p-2 rounded-lg top-[100px] sm:top-[140px] invisible",
						{
							visible: showWinMessage,
						},
					),
				)}
			>
				<p className="text-slate-900 font-bold">Congratulations!</p>
			</div>

			<div
				className={twMerge(
					clsx(
						"opacity-80 absolute bg-slate-100 p-2 rounded-lg top-[100px] sm:top-[140px] invisible",
						{
							visible: showLossMessage,
						},
					),
				)}
			>
				<p className="text-slate-900 font-bold">{word}</p>
			</div>

			<div className="flex flex-col gap-2">
				{guesses.map((guess, i) => (
					<GuessBar
						isGuessComplete={isGuessesComplete[i]}
						guess={guess}
						correctLetters={correctLetters[i]}
						misplacedLetters={misplacedLetters[i]}
						key={`${i}${guess}`}
						cn={isInvalidWord ? "motion-safe:animate-shake" : ""}
						wordLength={wordLength}
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
