import type { LetterStatus } from "@/lib/word-status";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function GuessBar({
	isGuessComplete,
	guess,
	currentGuessStatus,
	animate = true,
	cn,
	wordLength,
}: {
	isGuessComplete: boolean;
	guess: string;
	currentGuessStatus: LetterStatus[];
	animate?: boolean;
	cn: string;
	wordLength: number;
}) {
	const shouldAnimate = isGuessComplete && animate;

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
									"motion-safe:animate-popout":
										guess.length === index + 1 && !isGuessComplete,
								},
								{
									"border-gray-600": guess.length <= index,
								},
								{
									"transition delay-[400ms] motion-safe:animate-[xRotate_700ms_ease-in-out]":
										shouldAnimate && index === 0,
									"transition delay-[700ms] motion-safe:animate-[xRotate_700ms_ease-in-out_400ms]":
										shouldAnimate && index === 1,
									"transition delay-[1000ms] motion-safe:animate-[xRotate_700ms_ease-in-out_700ms]":
										shouldAnimate && index === 2,
									"transition delay-[1300ms] motion-safe:animate-[xRotate_700ms_ease-in-out_1000ms]":
										shouldAnimate && index === 3,
									"transition delay-[1600ms] motion-safe:animate-[xRotate_700ms_ease-in-out_1300ms]":
										shouldAnimate && index === 4,
									"transition delay-[1900ms] motion-safe:animate-[xRotate_700ms_ease-in-out_1600ms]":
										shouldAnimate && index === 5,
									"transition delay-[2200ms] motion-safe:animate-[xRotate_700ms_ease-in-out_1900ms]":
										shouldAnimate && index === 6,
									"transition delay-[2500ms] motion-safe:animate-[xRotate_700ms_ease-in-out_2200ms]":
										shouldAnimate && index === 7,
									"transition delay-[2800ms] motion-safe:animate-[xRotate_700ms_ease-in-out_2500ms]":
										shouldAnimate && index === 8,
									"transition delay-[3100ms] motion-safe:animate-[xRotate_700ms_ease-in-out_2800ms]":
										shouldAnimate && index === 9,
									"transition delay-[3400ms] motion-safe:animate-[xRotate_700ms_ease-in-out_3100ms]":
										shouldAnimate && index === 10,
								},
								{
									"bg-gray-600 border-slate-950": isGuessComplete,
								},
								{
									"ease-in-out bg-[#B59F38]":
										currentGuessStatus[index] === "misplaced",
								},
								{
									"ease-in-out bg-green-600":
										currentGuessStatus[index] === "correct",
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
