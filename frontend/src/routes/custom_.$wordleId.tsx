import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api-url";
import { Game } from "@/components/Game";

export const Route = createFileRoute("/custom_/$wordleId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { wordleId } = Route.useParams();
	const [wordLength, setWordLength] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchWordLength = async () => {
			const res = await fetch(`${apiUrl}/custom-word/${wordleId}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				// need better error handling than this
				throw new Error("could not find a wordle with that id");
			}

			const data = await res.json();
			setWordLength(data.wordLength);
			setIsLoading(false);
		};

		fetchWordLength();
	}, []);

	return (
		<div>
			{isLoading ? (
				<p>...is loading</p>
			) : (
				<Game wordLength={wordLength} endpoint={`/custom-word/${wordleId}`} />
			)}
		</div>
	);
}
