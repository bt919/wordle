import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function Keyboard({
	correctLetters,
	misplacedLetters,
	guesses,
}: {
	correctLetters: number[][];
	misplacedLetters: number[][];
	guesses: string[];
}) {
	const [greenLetters, setGreenLetters] = useState(new Set());
	const [yellowLetters, setYellowLetters] = useState(new Set());
	const [lettersGuessed, setLettersGuessed] = useState(new Set());

	useEffect(() => {
		console.log("useEffect fired from keyboard.tsx");
		const guessIndex = guesses.findLastIndex((g) => g.length === 5);
		if (guessIndex === -1) {
			return;
		}

		const currentGuess = guesses[guessIndex];
		for (const letter of currentGuess) {
			if (!lettersGuessed.has(letter)) {
				setLettersGuessed((prev) => new Set(prev).add(letter));
			}
		}

		const currentCorrect = correctLetters[guessIndex];
		for (const letterIndex of currentCorrect) {
			const ch = currentGuess[letterIndex];
			if (!greenLetters.has(ch)) {
				setGreenLetters((prev) => new Set(prev).add(ch));
			}
		}

		const currentMisplaced = misplacedLetters[guessIndex];
		for (const letterIndex of currentMisplaced) {
			const ch = currentGuess[letterIndex];
			if (!yellowLetters.has(ch)) {
				setYellowLetters((prev) => new Set(prev).add(ch));
			}
		}
	}, [
		correctLetters,
		misplacedLetters,
		greenLetters,
		yellowLetters,
		greenLetters.add,
		greenLetters.has,
		yellowLetters.add,
		yellowLetters.has,
	]);

	const layout = [
		"Q",
		"W",
		"E",
		"R",
		"T",
		"Y",
		"U",
		"I",
		"O",
		"P",
		"A",
		"S",
		"D",
		"F",
		"G",
		"H",
		"J",
		"K",
		"L",
		"Enter",
		"Z",
		"X",
		"C",
		"V",
		"B",
		"N",
		"M",
		"Backspace",
	];

	return (
		<div className="mb-4 sm:mb-2 mt-8 flex gap-1 flex-wrap justify-center items-center">
			{layout.map((k) => {
				if (k === "P" || k === "L") {
					return (
						<Fragment key={k}>
							<button
								type="button"
								key={k}
								className={twMerge(
									clsx(
										"hover:bg-gray-400 active:bg-gray-600 hover:cursor-pointer bg-gray-500 text-slate-100 p-[8px] text-md sm:p-4 sm:text-lg font-bold rounded-md",
										{ "bg-[#3A3A3C]": lettersGuessed.has(k) },
										{ "bg-[#B59F38]": yellowLetters.has(k) },
										{ "bg-green-600": greenLetters.has(k) },
									),
								)}
								onClick={() => {
									window.dispatchEvent(
										new KeyboardEvent("keydown", { key: k }),
									);
								}}
							>
								{k}
							</button>
							<div className="basis-full h-0" key={`${k}-line-breaker`} />
						</Fragment>
					);
				}
				return (
					<button
						type="button"
						key={k}
						className={twMerge(
							clsx(
								"hover:bg-gray-400 active:bg-gray-600 hover:cursor-pointer bg-gray-500 text-slate-100 p-[8px] text-md sm:p-4 sm:text-lg font-bold rounded-md",
								{ "bg-[#3A3A3C]": lettersGuessed.has(k) },
								{ "bg-[#B59F38]": yellowLetters.has(k) },
								{ "bg-green-600": greenLetters.has(k) },
							),
						)}
						onClick={() => {
							window.dispatchEvent(new KeyboardEvent("keydown", { key: k }));
						}}
					>
						{k === "Backspace" ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<title>backspace</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
								/>
							</svg>
						) : (
							k
						)}
					</button>
				);
			})}
		</div>
	);
}
