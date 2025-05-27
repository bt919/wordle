import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { WordleLogo } from "@/components/WordleLogo";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <WordleLogo />
            <p className="text-2xl mb-4">Get 6 chances to guess a 5-letter word.</p>
            <div className="flex gap-4">
                <Link
                    to="/custom"
                    className="bg-slate-600 text-slate-50 p-4 w-48 h-12 rounded-4xl flex justify-center items-center font-bold hover:bg-slate-500 hover:cursor-pointer hover:text-slate-100"
                >
                    Create your own
                </Link>
                <Link
                    to="/play"
                    className="bg-slate-900 text-slate-50 p-4 w-48 h-12 rounded-4xl flex justify-center items-center font-bold hover:bg-slate-800 hover:cursor-pointer hover:text-slate-100"
                >
                    Play
                </Link>
            </div>
        </div>
    );
}
