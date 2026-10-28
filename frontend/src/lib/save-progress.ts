import type { LetterStatus } from "@/lib/word-status";

export const CLASSIC_PROGRESS_PREFIX = "wordle:classic:";
export const CLASSIC_MAX_GUESSES = 6;
export const CLASSIC_WORD_LENGTH = 5;
export const CLASSIC_PROGRESS_VERSION = 1 as const;

export type ClassicProgress = {
	version: typeof CLASSIC_PROGRESS_VERSION;
	date: string; // YYYY-MM-DD (UTC), captured at game start
	guesses: string[]; // length 6; only scored rows populated, rest ""
	guessStatuses: LetterStatus[][]; // length 6; only scored rows length 5, rest []
	correctWord: string; // "" unless the player lost and it was revealed
};

/** Current UTC day as "YYYY-MM-DD" (uses the system clock). */
export function utcDateKey(date: Date = new Date()): string {
	return date.toISOString().slice(0, 10);
}

/** Full localStorage key for a day, e.g. `wordle:classic:2026-06-30`. */
export function classicProgressKey(dateKey: string): string {
	return `${CLASSIC_PROGRESS_PREFIX}${dateKey}`;
}

/** Builds a normalized snapshot: drops any partially typed row, pads to 6. */
export function createClassicProgress(
	dateKey: string,
	guesses: readonly string[],
	guessStatuses: readonly LetterStatus[][],
	correctWord: string,
): ClassicProgress {
	// Keep only the contiguous prefix of completed (scored) rows.
	let scoredCount = 0;
	while (
		scoredCount < CLASSIC_MAX_GUESSES &&
		guessStatuses[scoredCount]?.length === CLASSIC_WORD_LENGTH
	) {
		scoredCount += 1;
	}

	const normalizedGuesses: string[] = Array.from(
		{ length: CLASSIC_MAX_GUESSES },
		(_, i) => (i < scoredCount ? (guesses[i] ?? "") : ""),
	);

	const normalizedStatuses: LetterStatus[][] = Array.from(
		{ length: CLASSIC_MAX_GUESSES },
		(_, i) => (i < scoredCount ? [...guessStatuses[i]] : []),
	);

	return {
		version: CLASSIC_PROGRESS_VERSION,
		date: dateKey,
		guesses: normalizedGuesses,
		guessStatuses: normalizedStatuses,
		correctWord,
	};
}

const ALLOWED_STATUSES: ReadonlySet<string> = new Set([
	"correct",
	"misplaced",
	"absent",
]);

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Runtime-shape check (version, date match, array lengths, allowed statuses). */
export function isValidClassicProgress(
	value: unknown,
	expectedDateKey: string,
): value is ClassicProgress {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	if (candidate.version !== CLASSIC_PROGRESS_VERSION) return false;
	if (candidate.date !== expectedDateKey) return false;
	if (typeof candidate.correctWord !== "string") return false;
	if (!Array.isArray(candidate.guesses)) return false;
	if (!Array.isArray(candidate.guessStatuses)) return false;

	const guesses = candidate.guesses;
	const guessStatuses = candidate.guessStatuses;

	if (guesses.length !== CLASSIC_MAX_GUESSES) return false;
	if (guessStatuses.length !== CLASSIC_MAX_GUESSES) return false;

	let sawUnscoredRow = false;

	for (let i = 0; i < CLASSIC_MAX_GUESSES; i += 1) {
		const guess = guesses[i];
		const status = guessStatuses[i];

		if (typeof guess !== "string") return false;
		if (!Array.isArray(status)) return false;

		if (status.length === 0) {
			if (guess !== "") return false;
			sawUnscoredRow = true;
			continue;
		}

		if (sawUnscoredRow) return false;
		if (status.length !== CLASSIC_WORD_LENGTH) return false;
		if (guess.length !== CLASSIC_WORD_LENGTH) return false;

		if (
			!status.every((s) => typeof s === "string" && ALLOWED_STATUSES.has(s))
		) {
			return false;
		}
	}

	return true;
}

/** Returns null when missing, corrupt, wrong version, or wrong date. */
export function loadClassicProgress(dateKey: string): ClassicProgress | null {
	try {
		const raw = localStorage.getItem(classicProgressKey(dateKey));
		if (raw === null) return null;

		const parsed: unknown = JSON.parse(raw);
		if (!isValidClassicProgress(parsed, dateKey)) return null;

		return parsed;
	} catch {
		return null;
	}
}

/** Synchronous; swallows quota/private-mode errors. */
export function saveClassicProgress(
	dateKey: string,
	progress: ClassicProgress,
): void {
	try {
		localStorage.setItem(classicProgressKey(dateKey), JSON.stringify(progress));
	} catch {
		return;
	}
}

/** Removes today's entry (useful for tests / reset). */
export function clearClassicProgress(dateKey: string): void {
	try {
		localStorage.removeItem(classicProgressKey(dateKey));
	} catch {
		return;
	}
}

/** Removes `wordle:classic:*` keys whose date is before `todayKey`. */
export function pruneOldClassicProgress(todayKey: string): void {
	try {
		const keysToRemove: string[] = [];

		for (let i = 0; i < localStorage.length; i += 1) {
			const key = localStorage.key(i);
			if (key === null || !key.startsWith(CLASSIC_PROGRESS_PREFIX)) {
				continue;
			}

			const dateKey = key.slice(CLASSIC_PROGRESS_PREFIX.length);
			if (!DATE_KEY_PATTERN.test(dateKey)) continue;
			if (dateKey < todayKey) keysToRemove.push(key);
		}

		for (const key of keysToRemove) {
			localStorage.removeItem(key);
		}
	} catch {
		return;
	}
}
