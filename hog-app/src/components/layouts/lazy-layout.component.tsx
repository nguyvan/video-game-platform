import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Preloading } from "../elements/preloadings/preloadings.component";

export const LazyLayout = () => {
    return (
        <Suspense fallback={<Preloading />}>
            <Outlet />
        </Suspense>
    );
};
