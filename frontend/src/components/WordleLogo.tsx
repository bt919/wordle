import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";

export function WordleLogo({ theme = "light" }: { theme?: "light" | "dark" }) {
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
            <Link to="/" className="hover:opacity-80">
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
            </Link>
            <Link
                to="/"
                className={clsx(
                    theme === "light" && "text-slate-900 hover:text-slate-800",
                    theme === "dark" && "text-slate-200 hover:text-slate-300",
                )}
            >
                <h1 className="font-[1000] text-3xl mt-4 mb-4">Wordle</h1>
            </Link>
        </Fragment>
    );
}
