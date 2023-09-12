import React from "react";

interface MainLayoutI {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutI> = ({
    children,
}: MainLayoutI) => {
    return <div>{children}</div>;
};
