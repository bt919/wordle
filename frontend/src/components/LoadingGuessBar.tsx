import { WordleLogo } from "./WordleLogo";

export function LoadingGuessBar({ wordLength }: { wordLength: number }) {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col gap-4 justify-center items-center relative">
			<WordleLogo theme="dark" />
			{new Array(6).fill(0).map((x, y) => (
				<div
					key={`${x}-${2 * y}`}
					className="bg-gray-500 w-96 h-16 rounded-md animate-pulse"
				/>
			))}
		</div>
	);
}
