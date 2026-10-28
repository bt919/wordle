import clsx from "clsx";
import {
	type AnimationEvent as ReactAnimationEvent,
	useCallback,
	useEffect,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";

import { GuessBar } from "@/components/GuessBar";
import { Keyboard } from "@/components/Keyboard";
import { WordleLogo } from "@/components/WordleLogo";
import { apiUrl } from "@/lib/api-url";
import {
	CLASSIC_MAX_GUESSES,
	createClassicProgress,
	loadClassicProgress,
	pruneOldClassicProgress,
	saveClassicProgress,
	utcDateKey,
} from "@/lib/save-progress";
import type { LetterStatus } from "@/lib/word-status";

function isWinningStatus(status: LetterStatus[], wordLength: number): boolean {
	return status.length === wordLength && status.every((s) => s === "correct");
}

function deriveHasPlayerLost(
	statuses: LetterStatus[][],
	wordLength: number,
): boolean {
	return (
		!statuses.some((status) => isWinningStatus(status, wordLength)) &&
		statuses.every((status) => status.length === wordLength)
	);
}

export function Game({
	wordLength,
	wordleId,
	gameMode,
}: {
	wordLength: number;
	wordleId?: string;
	gameMode: "classic" | "custom";
}) {
	const [sessionDate] = useState(() => utcDateKey());
	const [initialData] = useState(() =>
		gameMode === "classic" ? loadClassicProgress(sessionDate) : null,
	);
	const restoredCompletedRows = initialData
		? initialData.guessStatuses.filter((s) => s.length === wordLength).length
		: 0;

	const [isInvalidWord, setIsInvalidWord] = useState(false);
	const [showWinMessage, setShowWinMessage] = useState(false);
	const [showLossMessage, setShowLossMessage] = useState(() =>
		initialData
			? deriveHasPlayerLost(initialData.guessStatuses, wordLength)
			: false,
	);
	const [correctWord, setCorrectWord] = useState(
		() => initialData?.correctWord ?? "",
	);
	const [guesses, setGuesses] = useState<string[]>(() =>
		initialData
			? [...initialData.guesses]
			: Array.from({ length: CLASSIC_MAX_GUESSES }, () => ""),
	);
	const [isCurrentGuessFull, setIsCurrentGuessFull] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	// used for timing css animations
	const [numberOfCorrectLettersFlipped, setNumberOfCorrectLettersFlipped] =
		useState(0);
	// used for timing css animations
	const [numberOfLettersFlipped, setNumberOfLettersFlipped] = useState(0);
	const [guessStatuses, setGuessStatuses] = useState<LetterStatus[][]>(() =>
		initialData
			? initialData.guessStatuses.map((status) => [...status])
			: Array.from({ length: CLASSIC_MAX_GUESSES }, () => [] as LetterStatus[]),
	);

	const isGuessesComplete = guessStatuses.map(
		(status) => status.length === wordLength,
	);
	const isGuessCorrect = guessStatuses.some((status) =>
		isWinningStatus(status, wordLength),
	);
	const hasPlayerLost =
		!isGuessCorrect &&
		guessStatuses.every((status) => status.length === wordLength);

	const fetchGuess = useCallback(
		async (guess: string, currentIndex: number) => {
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
			setGuessStatuses((prev) => [
				...prev.slice(0, currentIndex),
				data.status,
				...prev.slice(currentIndex + 1, 6),
			]);

			if (data.status.every((s: LetterStatus) => s === "correct")) {
				return;
			}

			if (currentIndex === CLASSIC_MAX_GUESSES - 1) {
				// player has lost
				const wordEndpoint =
					gameMode === "classic" ? "/word" : `/custom-word/length/${wordleId}`;
				const wordRes = await fetch(`${apiUrl}${wordEndpoint}`);
				if (!wordRes.ok) {
					return;
				}
				const data = await wordRes.json();
				setCorrectWord(data.word.toUpperCase());
			}
		},
		[gameMode, wordleId],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.altKey || e.ctrlKey || e.metaKey) {
				return;
			}
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
		},
		[
			guesses,
			wordLength,
			isCurrentGuessFull,
			isFetching,
			isGuessCorrect,
			fetchGuess,
		],
	);
	//  ReactAnimationEvent<HTMLDivElement>
	const handleAnimationEnd = (e: ReactAnimationEvent<HTMLDivElement>) => {
		if (e.animationName === "xRotate") {
			if (isGuessCorrect) {
				setNumberOfCorrectLettersFlipped((prev) => prev + 1);
				if (numberOfCorrectLettersFlipped === 4) {
					setShowWinMessage(true);
					setTimeout(() => {
						setShowWinMessage(false);
					}, 2000);
				}
			} else {
				setNumberOfLettersFlipped((prev) => prev + 1);
				if ((numberOfLettersFlipped + 1) % 5 === 0) {
					setIsCurrentGuessFull(false);
					setIsFetching(false);
					if (hasPlayerLost) {
						setShowLossMessage(true);
					}
				}
			}
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	useEffect(() => {
		if (gameMode !== "classic") return;

		const scoredCount = guessStatuses.filter(
			(status) => status.length === wordLength,
		).length;
		if (scoredCount === 0) return;

		saveClassicProgress(
			sessionDate,
			createClassicProgress(sessionDate, guesses, guessStatuses, correctWord),
		);
	}, [gameMode, sessionDate, guesses, guessStatuses, correctWord, wordLength]);

	useEffect(() => {
		if (gameMode === "classic") pruneOldClassicProgress(sessionDate);
	}, [gameMode, sessionDate]);

	return (
		<div
			className="min-h-screen bg-slate-950 text-slate-300 flex flex-col justify-center items-center relative"
			onAnimationEnd={handleAnimationEnd}
		>
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
				<p className="text-slate-900 font-bold">{correctWord}</p>
			</div>

			<div className="flex flex-col gap-2">
				{guesses.map((guess, i) => (
					<GuessBar
						isGuessComplete={isGuessesComplete[i]}
						guess={guess}
						currentGuessStatus={guessStatuses[i]}
						animate={i >= restoredCompletedRows}
						key={`${i}${guess}`}
						cn={isInvalidWord ? "motion-safe:animate-shake" : ""}
						wordLength={wordLength}
					/>
				))}
			</div>

			<Keyboard guessStatuses={guessStatuses} guesses={guesses} />
		</div>
	);
}
