import {
    createRootRoute,
    createRouter,
    createRoute,
    Outlet,
    RouterProvider,
} from "@tanstack/react-router";
import { type JSX } from "react";

const rootRoute = createRootRoute();

const router = createRouter({
    routeTree: rootRoute
})

export const Wrapper = (component: JSX.Element) => {
    const rootRoute = createRootRoute({
        component: () => (
            <Outlet />
        ),
    });
    const indexRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/",
        component: () => component,
    });
    const routeTree = rootRoute.addChildren([indexRoute]);
    const router = createRouter({ routeTree });

    return <RouterProvider router={router} />
    // return router;
};

