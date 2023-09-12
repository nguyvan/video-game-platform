import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./public.route";
import { protectedRoutes } from "./protected.route";
import { Auth } from "../lib/auth";
import { useAppDispatch } from "../storage/storage";
import { SendNotifI } from "../types/event";
import { openSlackbar } from "../storage/features/snackbarSlice";
import { SocketContext } from "../contexts/socket.context";
import React from "react";

export const AppRoutes = () => {
    const routes = Auth.isAuth() ? protectedRoutes : publicRoutes;
    const dispatch = useAppDispatch();
    const { socket } = React.useContext(SocketContext);
    const getNotif = ({ user, date, type, title }: SendNotifI) => {
        dispatch(
            openSlackbar({ user: user, date: date, type: type, title: title })
        );
        return;
    };

    React.useEffect(() => {
        socket?.connect();
        socket?.receiveNotif(getNotif);
        return () => {
            socket?.disconnect();
        };
    }, [routes]);

    const element = useRoutes([...routes]);

    return <>{element}</>;
};
