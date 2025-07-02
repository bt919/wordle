import { afterEach, expect, test, vi, describe } from "vitest";
import { userEvent, page } from "@vitest/browser/context";
import { createRootRoute, createRoute, createRouter, Link, RouterProvider } from "@tanstack/react-router";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "vitest-browser-react";

import { App } from "../../src/routes/index.tsx";
import { Play } from "../../src/routes/play.tsx";

afterEach(() => {
    vi.resetAllMocks();
    window.history.replaceState(null, '', '/')
    cleanup();
})

describe("WordleLogo", async () => {
    test("navigates to home page through wordle heading title", async () => {
        const rootRoute = createRootRoute();

        const indexRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/",
            component: App
        })

        const playRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/play",
            component: Play
        })

        const routeTree = rootRoute.addChildren([indexRoute, playRoute])
        const router = createRouter({ routeTree })
        router.navigate({ href: "/play" })

        render(<RouterProvider router={router} />)

        expect(screen.queryByText("Get 6 chances to guess a 5-letter word.")).not.toBeInTheDocument();

        const wordleLogo = await screen.findByText("Wordle");
        await userEvent.click(wordleLogo);
        expect(screen.queryByText("Get 6 chances to guess a 5-letter word.")).toBeInTheDocument();
    })
})
