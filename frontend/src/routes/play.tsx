import { createFileRoute } from "@tanstack/react-router";

import { WordleLogo } from "@/components/WordleLogo";

export const Route = createFileRoute("/play")({
	component: Play,
});

function Play() {
	return (
		<div className="bg-slate-950 text-slate-300 h-screen w-screen flex flex-col justify-center items-center">
			<WordleLogo theme="dark" />

			<div className="h-14 w-14 border border-slate-700" />
		</div>
	);
}
