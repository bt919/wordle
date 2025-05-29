import clsx from "clsx";
import { useEffect, useState } from "react";

export function GuessBar({ guess }: { guess: string }) {
	useEffect(() => {}, []);

	// bg-gray-600
	return (
		<div className="flex gap-2">
			<div
				className={clsx(
					"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
					{
						"border-gray-400": guess.length > 0,
					},
					{
						"border-gray-600": guess.length <= 0,
					},
				)}
			>
				{guess.length > 0 ? guess.charAt(0) : ""}
			</div>
			<div
				className={clsx(
					"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
					{
						"border-gray-400": guess.length > 1,
					},
					{
						"border-gray-600": guess.length <= 1,
					},
				)}
			>
				{guess.length > 1 ? guess.charAt(1) : ""}
			</div>
			<div
				className={clsx(
					"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
					{ "border-gray-400": guess.length > 2 },
					{ "border-gray-600": guess.length <= 2 },
				)}
			>
				{guess.length > 2 ? guess.charAt(2) : ""}
			</div>
			<div
				className={clsx(
					"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
					{ "border-gray-400": guess.length > 3 },
					{ "border-gray-600": guess.length <= 3 },
				)}
			>
				{guess.length > 3 ? guess.charAt(3) : ""}
			</div>
			<div
				className={clsx(
					"h-16 w-16 border-2 text-slate-200 text-4xl font-[1000] flex justify-center items-center select-none",
					{ "border-gray-400": guess.length > 4 },
					{ "border-gray-600": guess.length <= 4 },
				)}
			>
				{guess.length > 4 ? guess.charAt(4) : ""}
			</div>
		</div>
	);
}
