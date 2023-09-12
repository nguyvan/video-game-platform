import React from "react";
import "./button.component.scss";

interface ButtonI {
    title?: string;
    onClick: (args?: any) => void;
    style?: React.CSSProperties;
    className?: string;
    textStyle?: React.CSSProperties;
}

interface ButtonActionI extends ButtonI {
    nbAction?: number;
    icon?: React.ReactNode;
    nbNotif?: number;
}

export const Button = ({
    title,
    onClick,
    style,
    className,
    textStyle,
}: ButtonI) => {
    return (
        <div
            onClick={onClick}
            style={style}
            className={`base-button${className ? " " + className : ""}`}
        >
            <span style={textStyle}>{title}</span>
        </div>
    );
};

export const ButtonAction = ({
    onClick,
    style,
    className,
    textStyle,
    nbAction,
    nbNotif,
    icon,
}: ButtonActionI) => {
    return (
        <div
            onClick={onClick}
            style={style}
            className={`action-button${className ? " " + className : ""}`}
        >
            {icon}
            {typeof nbAction === "number" ? (
                <span style={textStyle}>{nbAction}</span>
            ) : (
                <></>
            )}
            {nbNotif ? (
                <div className='number-notif'>
                    <span>{nbNotif <= 9 ? nbNotif : "9+"}</span>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
