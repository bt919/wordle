import { afterEach, expect, test, vi, describe } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, screen } from "@testing-library/react";
import { render } from "vitest-browser-react";

import { App as Homepage } from "../../src/routes/index.tsx";
import { Play } from "../../src/routes/play.tsx";
import { RouteComponent as Custom } from "../../src/routes/custom.tsx";

afterEach(() => {
    vi.resetAllMocks();
    window.history.replaceState(null, '', '/')
    cleanup();
})

describe("home page", async () => {
    test("renders all elements", async () => {
        const rootRoute = createRootRoute();

        const indexRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/",
            component: Homepage
        })

        const routeTree = rootRoute.addChildren([indexRoute]);
        const router = createRouter({ routeTree })

        render(<RouterProvider router={router} />)

        expect(await screen.findByText("Wordle")).toBeInTheDocument();
        expect(await screen.findByTitle("Github Repository")).toBeInTheDocument();
        expect(await screen.findByText("Get 6 chances to guess a 5-letter word.")).toBeInTheDocument();
        expect(await screen.findByRole("link", { name: "Play" })).toBeInTheDocument();
        expect(await screen.findByRole("link", { name: "Create your own" })).toBeInTheDocument();
    })

    test("redirects to the /play page", async () => {
        const rootRoute = createRootRoute();

        const indexRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/",
            component: Homepage
        })

        const playRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/play",
            component: Play
        })

        const routeTree = rootRoute.addChildren([indexRoute, playRoute]);
        const router = createRouter({ routeTree });

        render(<RouterProvider router={router} />)

        expect(await screen.findByText("Get 6 chances to guess a 5-letter word.")).toBeInTheDocument();
        const playLink = await screen.findByRole("link", { name: "Play" });
        await userEvent.click(playLink);
        expect(screen.queryByText("Get 6 chances to guess a 5-letter word.")).not.toBeInTheDocument();
    })

    test("redirects to /custom page", async () => {
        const rootRoute = createRootRoute();

        const indexRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/",
            component: Homepage
        })

        const customRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: "/custom",
            component: Custom
        })

        const routeTree = rootRoute.addChildren([indexRoute, customRoute]);
        const router = createRouter({ routeTree });

        render(<RouterProvider router={router} />)

        expect(await screen.findByText("Get 6 chances to guess a 5-letter word.")).toBeInTheDocument();
        const customLink = await screen.findByRole("link", { name: "Create your own" });
        await userEvent.click(customLink);
        expect(screen.queryByText("Get 6 chances to guess a 5-letter word.")).not.toBeInTheDocument();
    })
})
