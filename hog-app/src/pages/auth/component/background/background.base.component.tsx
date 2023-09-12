import React from "react";
import "../../../../assets/css/background.base.scss";

interface BackgroundBaseI {
    children: React.ReactNode;
}

export const BackgroundBase = ({ children }: BackgroundBaseI) => {
    return <div className='background-base'>{children}</div>;
};
