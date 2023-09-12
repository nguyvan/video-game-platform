import { lazyImport } from "../utils/lazy-import.util";
import { Navigate } from "react-router-dom";
import { LazyLayout as App } from "../components/layouts/lazy-layout.component";

const { HomePage } = lazyImport(
    () => import("../pages/auth/home.page"),
    "HomePage"
);

const { LoginPage } = lazyImport(
    () => import("../pages/auth/login.page"),
    "LoginPage"
);

const { SignUpPage } = lazyImport(
    () => import("../pages/auth/signup.page"),
    "SignUpPage"
);

export const publicRoutes = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/signup", element: <SignUpPage /> },
            { path: "*", element: <Navigate to='.' /> },
        ],
    },
];
