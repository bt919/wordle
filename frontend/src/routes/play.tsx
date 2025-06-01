import clsx from "clsx";
import { createFileRoute } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

import { apiUrl } from "@/lib/api-url";
import { GuessBar } from "@/components/GuessBar";
import { Keyboard } from "@/components/Keyboard";
import { WordleLogo } from "@/components/WordleLogo";
import { Game } from "@/components/Game";

export const Route = createFileRoute("/play")({
	component: Play,
});

function Play() {
	return <Game wordLength={5} />;
}
