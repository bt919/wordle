import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

import { apiUrl } from "@/lib/api-url";
import { WordleLogo } from "@/components/WordleLogo";

export const Route = createFileRoute("/custom")({
	component: RouteComponent,
});

export function RouteComponent() {
	const [word, setWord] = useState("");
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [wordleId, setWordleId] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (word.length !== 5) {
			return;
		}

		const res = await fetch(`${apiUrl}/custom-word`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				word,
			}),
		});

		if (!res.ok) {
			setShowErrorMessage(true);
		}

		const data = await res.json();
		setWordleId(data.id);
		setShowModal(true);

		return;
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col justify-center items-center relative">
			<WordleLogo theme="dark" />

			{/* a modal that covers the background while link modal is active */}
			<div
				onClick={() => {
					setShowModal(false);
				}}
				onKeyPress={() => {
					setShowModal(false);
				}}
				className={twMerge(
					clsx(
						"absolute h-full w-full opacity-30 bg-slate-300 z-10 invisible",
						{
							visible: showModal,
						},
					),
				)}
			/>

			{/* a modal that lets users copy paste their custom wordle link */}
			<div
				className={twMerge(
					clsx(
						"absolute h-[150px] w-[400px] bg-slate-800 rounded-2xl flex flex-col justify-center items-center z-20 text-slate-400 font-bold text-lg not-sm:w-[350px] not-sm:text-[15px] invisible",
						{
							visible: showModal,
						},
					),
				)}
			>
				<p className="sm:text-lg mb-auto mt-4">
					Your custom wordle link has been created!
				</p>

				<div className="flex justify-center items-center gap-4 mb-8">
					<input
						type="text"
						readOnly
						value={`${document.location.origin}/custom/${wordleId}`}
						className="outline-none border-2 border-slate-500 rounded-lg p-2 focus:border-slate-300"
					/>
					<button
						type="button"
						className="p-2 bg-slate-400 rounded-lg hover:cursor-pointer hover:bg-slate-500 active:bg-slate-600"
						onClick={async () => {
							await navigator.clipboard.writeText(
								`${document.location.origin}/custom/${wordleId}`,
							);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 text-slate-950"
						>
							<title>copy to clipboard</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
							/>
						</svg>
					</button>
				</div>
			</div>

			<h2 className="text-2xl mt-4">Create your custom wordle</h2>

			<form
				className="flex flex-col justify-center items-center mt-8 gap-2"
				onSubmit={handleSubmit}
			>
				<p className="text-lg text-slate-400 pl-12 pr-12">
					Type in a word and a custom link will be created!
				</p>
				<p className="text-md text-slate-400 pl-12 pr-12">
					*Note that in this mode, guesses don't have to be a valid word
				</p>

				<div className="flex not-sm:flex-col gap-4 justify-center items-center">
					<div className="flex justify-center items-center relative">
						<label htmlFor="word">
							<input
								spellCheck={false}
								value={word}
								minLength={5}
								maxLength={5}
								onChange={(e) => {
									setShowErrorMessage(false);
									setWord(e.currentTarget.value);
								}}
								type="text"
								id="word"
								name="word"
								className={twMerge(
									clsx(
										"border-2 border-green-400 appearance-none outline-none bg-slate-100 p-2 rounded-lg text-lg font-bold text-slate-800 placeholder-text-slate-800",
										{
											"border-red-400": word.length !== 5,
										},
									),
								)}
								placeholder="Enter 5-letter word"
							/>
						</label>
						<p
							className={twMerge(
								clsx("absolute text-slate-700 right-4", {
									"text-red-400": word.length !== 5,
								}),
							)}
						>{`${word.length}/5`}</p>
					</div>

					<button
						type="submit"
						className="not-sm:w-full bg-slate-300 text-slate-800 p-4 w-48 h-12 rounded-4xl flex justify-center items-center font-bold hover:bg-slate-400 hover:cursor-pointer hover:text-slate-900"
					>
						Create Link
					</button>
				</div>
			</form>

			<p
				className={twMerge(
					clsx("mt-4 text-lg text-red-500 invisible", {
						visible: showErrorMessage,
					}),
				)}
			>
				Something went wrong.
				<span>
					<br />
				</span>{" "}
				Please try again later.
			</p>
		</div>
	);
}
