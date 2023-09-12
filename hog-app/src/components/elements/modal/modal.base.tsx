import React from "react";
import "./modal.base.scss";

interface ModalBaseI {
    children: React.ReactNode;
    handleClose: () => void;
    isOpen: boolean;
    className?: string;
    isOverlay?: boolean;
    isFixed?: boolean;
}

export const ModalBase = ({
    children,
    handleClose,
    isOpen,
    className,
    isOverlay,
    isFixed,
}: ModalBaseI) => {
    return isOpen ? (
        <div
            className='modal-base-container'
            style={{
                background: isOverlay ? "rgba(0, 0, 0, 0.7)" : "inherit",
                position: isFixed ? "fixed" : "absolute",
            }}
        >
            <div className='modal-base-outline' onClick={handleClose} />
            <div
                className={`modal-base-content${
                    className ? " " + className : ""
                }`}
            >
                {children}
            </div>
        </div>
    ) : (
        <></>
    );
};
