import { afterEach, expect, test, vi, describe } from "vitest";
import { userEvent, page } from "@vitest/browser/context";
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

describe("play page", async () => {
    test("renders all elements", async () => {
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
        const router = createRouter({ routeTree })
        router.navigate({ href: "/play" })

        render(<RouterProvider router={router} />)


        expect(await screen.findByText("Wordle")).toBeInTheDocument();
        expect(screen.queryByText("Get 6 chances to guess a 5-letter word.")).not.toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Q" })).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "P" })).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "A" })).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "L" })).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Enter" })).toBeInTheDocument();
    })

    test("let users make a guess", async () => {
        const mockData = {
            correctLetters: [],
            misplacedLetters: [],
            "guess": "SPORT"
        }

        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockData),
            }),
        ) as any;

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
        const router = createRouter({ routeTree })
        router.navigate({ href: "/play" })

        render(<RouterProvider router={router} />)

        expect(window.fetch).toHaveBeenCalledTimes(0)
        const sButton = await screen.findByRole("button", { name: "S" })
        await userEvent.click(sButton);
        const pButton = await screen.findByRole("button", { name: "P" })
        await userEvent.click(pButton);
        const oButton = await screen.findByRole("button", { name: "O" })
        await userEvent.click(oButton);
        const rButton = await screen.findByRole("button", { name: "R" })
        await userEvent.click(rButton);
        const tButton = await screen.findByRole("button", { name: "T" })
        await userEvent.click(tButton);
        const enterButton = await screen.findByRole("button", { name: "Enter" })
        await userEvent.click(enterButton);

        expect(window.fetch).toHaveBeenCalledTimes(1)
    })

    test("let users make two guesses", async () => {
        const mockData = {
            correctLetters: [],
            misplacedLetters: [],
            "guess": "SPORT"
        }

        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockData),
            }),
        ) as any;

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
        const router = createRouter({ routeTree })
        router.navigate({ href: "/play" })

        render(<RouterProvider router={router} />)

        expect(window.fetch).toHaveBeenCalledTimes(0)
        const sButton = await screen.findByRole("button", { name: "S" })
        await userEvent.click(sButton);
        const pButton = await screen.findByRole("button", { name: "P" })
        await userEvent.click(pButton);
        const oButton = await screen.findByRole("button", { name: "O" })
        await userEvent.click(oButton);
        const rButton = await screen.findByRole("button", { name: "R" })
        await userEvent.click(rButton);
        const tButton = await screen.findByRole("button", { name: "T" })
        await userEvent.click(tButton);
        const enterButton = await screen.findByRole("button", { name: "Enter" })
        await userEvent.click(enterButton);

        expect(window.fetch).toHaveBeenCalledTimes(1)

        await userEvent.click(sButton);
        await userEvent.click(pButton);
        await userEvent.click(oButton);
        await userEvent.click(rButton);
        await userEvent.click(tButton);
        await userEvent.click(enterButton);
        expect(window.fetch).toHaveBeenCalledTimes(2)
    })

    test("disallow users from guessing twice without entering more letters", async () => {
        const mockData = {
            correctLetters: [],
            misplacedLetters: [],
            "guess": "SPORT"
        }

        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockData),
            }),
        ) as any;

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
        const router = createRouter({ routeTree })
        router.navigate({ href: "/play" })

        render(<RouterProvider router={router} />)

        expect(window.fetch).toHaveBeenCalledTimes(0)
        const sButton = await screen.findByRole("button", { name: "S" })
        await userEvent.click(sButton);
        const pButton = await screen.findByRole("button", { name: "P" })
        await userEvent.click(pButton);
        const oButton = await screen.findByRole("button", { name: "O" })
        await userEvent.click(oButton);
        const rButton = await screen.findByRole("button", { name: "R" })
        await userEvent.click(rButton);
        const tButton = await screen.findByRole("button", { name: "T" })
        await userEvent.click(tButton);
        const enterButton = await screen.findByRole("button", { name: "Enter" })
        await userEvent.click(enterButton);

        expect(window.fetch).toHaveBeenCalledTimes(1)

        await userEvent.click(enterButton);
        expect(window.fetch).toHaveBeenCalledTimes(1)
    })
})
