import { createFileRoute } from "@tanstack/react-router";

import { Game } from "@/components/Game";

export const Route = createFileRoute("/play")({
	component: Play,
});

function Play() {
	return <Game wordLength={5} gameMode="classic" />;
}
