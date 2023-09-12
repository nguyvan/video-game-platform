import { lazyImport } from "../utils/lazy-import.util";
import { Navigate } from "react-router-dom";
import { LazyLayout as App } from "../components/layouts/lazy-layout.component";

const { NewFeedPage } = lazyImport(
    () => import("../pages/new-feed/new-feed.page"),
    "NewFeedPage"
);

const { ProfilePage } = lazyImport(
    () => import("../pages/profile/profile.page"),
    "ProfilePage"
);

export const protectedRoutes = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <NewFeedPage /> },
            { path: "/profile", element: <ProfilePage /> },
            { path: "*", element: <Navigate to='.' /> },
        ],
    },
];
