import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { typeModal } from "../../types/modal";

export interface ModalNotifI {
    isOpen: boolean;
    type?: typeModal;
}

const initialState: { modalNotif: ModalNotifI } = {
    modalNotif: {
        isOpen: false,
        type: undefined,
    },
};

export const ModalNotifSlice = createSlice({
    name: "modalNotif",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<typeModal>) => {
            state.modalNotif.isOpen = true;
            state.modalNotif.type = action.payload;
        },
        closeModal: (state) => {
            state.modalNotif = initialState.modalNotif;
        },
    },
});

export const ModalNotifReducer = ModalNotifSlice.reducer;
export const { openModal, closeModal } = ModalNotifSlice.actions;
