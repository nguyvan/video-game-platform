import React from "react";
import { SocketClient } from "../services/socket";

export const SocketContext = React.createContext<{
    socket?: SocketClient;
    setSocket?: React.Dispatch<React.SetStateAction<SocketClient | undefined>>;
}>({
    socket: undefined,
    setSocket: undefined,
});
