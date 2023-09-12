import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const LazyLayout = () => {
    return (
        <Suspense fallback={<span>Loading</span>}>
            <Outlet />
        </Suspense>
    );
};
