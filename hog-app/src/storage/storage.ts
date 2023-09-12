import { UserSlice } from "./features/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { SnackbarSlice } from "./features/snackbarSlice";
import { ModalNotifSlice } from "./features/modalNotifSlice";
import { ModalEditSlice } from "./features/modalEditSlice";
import { ModalShareSlice } from "./features/modalShareSlice";

export const store = configureStore({
    reducer: {
        user: UserSlice.reducer,
        snackbar: SnackbarSlice.reducer,
        modalNotif: ModalNotifSlice.reducer,
        modalEdit: ModalEditSlice.reducer,
        modelShare: ModalShareSlice.reducer,
    },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
    ReturnType<typeof store.getState>
> = useSelector;
