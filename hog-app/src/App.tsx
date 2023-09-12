import { AppRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./storage/storage";
import { getUserById } from "./api/new-feed/getUser";
import React from "react";
import { updateUser } from "./storage/features/userSlice";
import { Auth } from "./lib/auth";
import { SocketClient } from "./services/socket";
import { SocketContext } from "./contexts/socket.context";
import { Snackbar } from "./components/elements/snackbar/snackbar.component";
import { openSlackbar } from "./storage/features/snackbarSlice";
import { SendNotifI } from "./types/event";
import { ModalBase } from "./components/elements/modal/modal.base";
import { Notifs } from "./components/elements/modal/components/notifs.component";
import { closeModal } from "./storage/features/modalNotifSlice";
import { ModalShare } from "./components/elements/modal/share/modal-share.component";

export const App = () => {
    const dispatch = useAppDispatch();
    const [socket, setSocket] = React.useState<SocketClient>();
    const modalNotif = useAppSelector((state) => state.modalNotif.modalNotif);

    const handleCloseModalNotif = () => {
        dispatch(closeModal());
    };

    const getNotif = ({ user, date, type, title }: SendNotifI) => {
        dispatch(
            openSlackbar({ user: user, date: date, type: type, title: title })
        );
        return;
    };

    React.useEffect(() => {
        (async () => {
            try {
                if (Auth.isAuth()) {
                    const response = await getUserById();
                    dispatch(updateUser(response));
                }
            } catch (error) {
                window.location.href = "/";
            }
        })();
    }, []);

    React.useEffect(() => {
        const socketClient = new SocketClient();
        socketClient.connect();
        socketClient?.receiveNotif(getNotif);
        setSocket(socketClient);
        return () => {
            socketClient.disconnect();
            setSocket(undefined);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            <BrowserRouter>
                <AppRoutes />
                <ModalBase
                    isOpen={modalNotif.isOpen}
                    handleClose={handleCloseModalNotif}
                >
                    <Notifs />
                </ModalBase>
                <ModalShare />
            </BrowserRouter>
            <Snackbar />
        </SocketContext.Provider>
    );
};
