import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReturnI } from "../../api/new-feed/getUser";
import { SendNotifI, typeNotification } from "../../types/event";

export interface SnackbarI {
    isOpen: boolean;
    body: {
        user?: UserReturnI;
        date?: string;
        type?: typeNotification;
        title?: string;
    };
}

const initialState: { snackbar: SnackbarI } = {
    snackbar: {
        isOpen: false,
        body: {
            user: undefined,
            date: undefined,
            type: undefined,
            title: undefined,
        },
    },
};

export const SnackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        openSlackbar: (state, action: PayloadAction<SendNotifI>) => {
            state.snackbar.isOpen = true;
            state.snackbar.body = action.payload;
        },
        closeSlackbar: (state) => {
            state.snackbar = initialState.snackbar;
        },
    },
});

export const SnackbarReducer = SnackbarSlice.reducer;
export const { openSlackbar, closeSlackbar } = SnackbarSlice.actions;
