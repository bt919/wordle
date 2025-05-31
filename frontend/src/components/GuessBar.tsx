import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

export function GuessBar({
	isGuessComplete,
	guess,
	correctLetters,
	misplacedLetters,
}: {
	isGuessComplete: boolean;
	guess: string;
	correctLetters: number[];
	misplacedLetters: number[];
}) {
	useEffect(() => {}, []);

	// bg-gray-600
	return (
		<div className="flex gap-2">
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
							"bg-gray-600 border-slate-950": isGuessComplete,
						},
						{
							"bg-[#B59F38]": misplacedLetters.indexOf(0) !== -1,
						},
						{
							"bg-green-600": correctLetters.indexOf(0) !== -1,
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
							"bg-gray-600 border-slate-950": isGuessComplete,
						},
						{
							"bg-[#B59F38]": misplacedLetters.indexOf(1) !== -1,
						},
						{
							"bg-green-600": correctLetters.indexOf(1) !== -1,
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
							"bg-gray-600 border-slate-950": isGuessComplete,
						},
						{
							"bg-[#B59F38]": misplacedLetters.indexOf(2) !== -1,
						},
						{
							"bg-green-600": correctLetters.indexOf(2) !== -1,
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
							"bg-gray-600 border-slate-950": isGuessComplete,
						},

						{
							"bg-[#B59F38]": misplacedLetters.indexOf(3) !== -1,
						},
						{
							"bg-green-600": correctLetters.indexOf(3) !== -1,
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
							"bg-gray-600 border-slate-950": isGuessComplete,
						},

						{
							"bg-[#B59F38]": misplacedLetters.indexOf(4) !== -1,
						},
						{
							"bg-green-600": correctLetters.indexOf(4) !== -1,
						},
					),
				)}
			>
				{guess.length > 4 ? guess.charAt(4) : ""}
			</div>
		</div>
	);
}
