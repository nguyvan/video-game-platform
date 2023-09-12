import React from "react";
import { closeSlackbar } from "../../../storage/features/snackbarSlice";
import { useAppDispatch, useAppSelector } from "../../../storage/storage";
import "./snackbar.component.scss";
import { distanceTime } from "../../../utils/time.utl";

export const Snackbar = () => {
    const TIME = 2500;
    let TIMER: NodeJS.Timer | undefined = undefined;
    const dispatch = useAppDispatch();

    function handleTimeout() {
        TIMER = setTimeout(() => {
            dispatch(closeSlackbar());
        }, TIME);
    }

    function handleClose() {
        clearTimeout(TIMER);
    }

    const snackbar = useAppSelector((state) => state.snackbar.snackbar);

    React.useEffect(() => {
        if (snackbar.isOpen) {
            handleTimeout();
        }
        return () => {
            handleClose();
        };
    }, [snackbar.isOpen, TIMER]);

    return snackbar.isOpen ? (
        <div className='snackbar-container'>
            {snackbar.body.user ? (
                <div className='snackbar-header-container'>
                    <div className='snack-header-content'>
                        {snackbar.body.user.urlImage ? (
                            <img
                                src={snackbar.body.user.urlImage}
                                alt=''
                                className='image-avatar'
                            />
                        ) : (
                            <div className='image-no-avatar'>
                                <span>
                                    {snackbar.body.user.username
                                        ?.at(0)
                                        ?.toUpperCase()}
                                </span>
                            </div>
                        )}
                        <span className='title'>{snackbar.body.title}</span>
                    </div>
                    <span className='time'>
                        {distanceTime(snackbar.body.date)}
                    </span>
                </div>
            ) : (
                <></>
            )}
        </div>
    ) : (
        <></>
    );
};
