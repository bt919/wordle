import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function GuessBar({
	isGuessComplete,
	guess,
	correctLetters,
	misplacedLetters,
	cn,
}: {
	isGuessComplete: boolean;
	guess: string;
	correctLetters: number[];
	misplacedLetters: number[];
	cn: string;
}) {
	return (
		<div
			className={twMerge(
				clsx("flex gap-2", { [cn]: guess.length === 5 && !isGuessComplete }),
			)}
		>
			<div
				className={twMerge(
					clsx(
						"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
						{
							"border-gray-500": guess.length > 0,
						},
						{
							"animate-popout": guess.length === 1,
						},
						{
							"border-gray-600": guess.length <= 0,
						},
						{
							"transition delay-[400ms] ease-in-out bg-gray-600 border-slate-950 animate-[xRotate_700ms_ease-in-out]":
								isGuessComplete,
						},
						{
							"transition delay-[400ms] ease-in-out bg-[#B59F38]":
								misplacedLetters.indexOf(0) !== -1,
						},
						{
							"transition delay-[400ms] ease-in-out bg-green-600":
								correctLetters.indexOf(0) !== -1,
						},
					),
				)}
			>
				{guess.length > 0 ? guess.charAt(0) : ""}
			</div>
			<div
				className={twMerge(
					clsx(
						"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
						{
							"border-gray-500": guess.length > 1,
						},
						{
							"animate-popout": guess.length === 2,
						},
						{
							"border-gray-600": guess.length <= 1,
						},
						{
							"transition delay-[700ms] ease-in-out bg-gray-600 border-slate-950 animate-[xRotate_700ms_ease-in-out_300ms]":
								isGuessComplete,
						},
						{
							"transition delay-[700ms] ease-in-out bg-[#B59F38]":
								misplacedLetters.indexOf(1) !== -1,
						},
						{
							"transition delay-[700ms] ease-in-out bg-green-600":
								correctLetters.indexOf(1) !== -1,
						},
					),
				)}
			>
				{guess.length > 1 ? guess.charAt(1) : ""}
			</div>
			<div
				className={twMerge(
					clsx(
						"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
						{
							"border-gray-500": guess.length > 2,
						},
						{
							"animate-popout": guess.length === 3,
						},
						{
							"border-gray-600": guess.length <= 2,
						},
						{
							"transition delay-[1000ms] ease-in-out bg-gray-600 border-slate-950 animate-[xRotate_700ms_ease-in-out_600ms]":
								isGuessComplete,
						},
						{
							"transition delay-[1000ms] ease-in-out bg-[#B59F38]":
								misplacedLetters.indexOf(2) !== -1,
						},
						{
							"transition delay-[1000ms] ease-in-out bg-green-600":
								correctLetters.indexOf(2) !== -1,
						},
					),
				)}
			>
				{guess.length > 2 ? guess.charAt(2) : ""}
			</div>
			<div
				className={twMerge(
					clsx(
						"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
						{
							"border-gray-500": guess.length > 3,
						},
						{
							"animate-popout": guess.length === 4,
						},
						{
							"border-gray-600": guess.length <= 3,
						},
						{
							"transition delay-[1300ms] ease-in-out bg-gray-600 border-slate-950 animate-[xRotate_700ms_ease-in-out_900ms]":
								isGuessComplete,
						},
						{
							"transition delay-[1300ms] ease-in-out bg-[#B59F38]":
								misplacedLetters.indexOf(3) !== -1,
						},
						{
							"transition delay-[1300ms] ease-in-out bg-green-600":
								correctLetters.indexOf(3) !== -1,
						},
					),
				)}
			>
				{guess.length > 3 ? guess.charAt(3) : ""}
			</div>
			<div
				className={twMerge(
					clsx(
						"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
						{
							"border-gray-500": guess.length > 4,
						},
						{
							"animate-popout": guess.length === 5,
						},
						{
							"border-gray-600": guess.length <= 4,
						},
						{
							"transition delay-[1600ms] ease-in-out bg-gray-600 border-slate-950 animate-[xRotate_700ms_ease-in-out_1200ms]":
								isGuessComplete,
						},
						{
							"transition delay-[1600ms] ease-in-out bg-[#B59F38]":
								misplacedLetters.indexOf(4) !== -1,
						},
						{
							"transition delay-[1600ms] ease-in-out bg-green-600":
								correctLetters.indexOf(4) !== -1,
						},
					),
				)}
			>
				{guess.length > 4 ? guess.charAt(4) : ""}
			</div>
		</div>
	);
}
