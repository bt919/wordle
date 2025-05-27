import { Fragment } from "react";
import { Link } from "@tanstack/react-router";

export function WordleLogo() {
	const cube = [
		"bg-slate-50",
		"bg-slate-50",
		"bg-slate-50",
		"bg-slate-50",
		"bg-yellow-500",
		"bg-green-500",
		"bg-green-500",
		"bg-green-500",
		"bg-green-500",
	];

	return (
		<Fragment>
			{" "}
			<div className="grid grid-cols-3 grid-rows-3 w-fit rounded-xl overflow-hidden border-2 border-slate-900">
				{" "}
				{cube.map((x, i) => (
					<div
						key={`${i}${x}`}
						className={`${x} w-6 h-6 border-2 border-slate-900`}
					/>
				))}
			</div>
			<Link to="/" className="hover:text-slate-800">
				<h1 className="font-[1000] text-3xl mt-4 mb-4">Wordle</h1>
			</Link>
		</Fragment>
	);
}
