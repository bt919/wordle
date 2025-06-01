import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function GuessBar({
	isGuessComplete,
	guess,
	correctLetters,
	misplacedLetters,
	cn,
	wordLength,
}: {
	isGuessComplete: boolean;
	guess: string;
	correctLetters: number[];
	misplacedLetters: number[];
	cn: string;
	wordLength: number;
}) {
	return (
		<div
			className={twMerge(
				clsx("flex gap-2", {
					[cn]: guess.length === wordLength && !isGuessComplete,
				}),
			)}
		>
			{new Array(wordLength).fill(0).map((value, index) => {
				return (
					<div
						key={`${index}-${value}`}
						className={twMerge(
							clsx(
								"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
								{
									"border-gray-500": guess.length > index,
								},
								{
									"animate-popout": guess.length === index + 1,
								},
								{
									"border-gray-600": guess.length <= index,
								},
								{
									"transition delay-[400ms] animate-[xRotate_700ms_ease-in-out]":
										isGuessComplete && index === 0,
									"transition delay-[700ms] animate-[xRotate_700ms_ease-in-out_400ms]":
										isGuessComplete && index === 1,
									"transition delay-[1000ms] animate-[xRotate_700ms_ease-in-out_700ms]":
										isGuessComplete && index === 2,
									"transition delay-[1300ms] animate-[xRotate_700ms_ease-in-out_1000ms]":
										isGuessComplete && index === 3,
									"transition delay-[1600ms] animate-[xRotate_700ms_ease-in-out_1300ms]":
										isGuessComplete && index === 4,
									"transition delay-[1900ms] animate-[xRotate_700ms_ease-in-out_1600ms]":
										isGuessComplete && index === 5,
									"transition delay-[2200ms] animate-[xRotate_700ms_ease-in-out_1900ms]":
										isGuessComplete && index === 6,
									"transition delay-[2500ms] animate-[xRotate_700ms_ease-in-out_2200ms]":
										isGuessComplete && index === 7,
									"transition delay-[2800ms] animate-[xRotate_700ms_ease-in-out_2500ms]":
										isGuessComplete && index === 8,
									"transition delay-[3100ms] animate-[xRotate_700ms_ease-in-out_2800ms]":
										isGuessComplete && index === 9,
									"transition delay-[3400ms] animate-[xRotate_700ms_ease-in-out_3100ms]":
										isGuessComplete && index === 10,
								},
								{
									"bg-gray-600 border-slate-950": isGuessComplete,
								},
								{
									"ease-in-out bg-[#B59F38]":
										misplacedLetters.indexOf(index) !== -1,
								},
								{
									"ease-in-out bg-green-600":
										correctLetters.indexOf(index) !== -1,
								},
							),
						)}
					>
						{guess.length > index ? guess.charAt(index) : ""}
					</div>
				);
			})}
		</div>
	);
}
