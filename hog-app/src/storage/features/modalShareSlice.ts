import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalShareI {
    isOpen: boolean;
    idPost?: string;
}

const initialState: { modalShare: ModalShareI } = {
    modalShare: {
        isOpen: false,
        idPost: undefined,
    },
};

export const ModalShareSlice = createSlice({
    name: "modalShare",
    initialState,
    reducers: {
        openModalShare: (state, action: PayloadAction<string>) => {
            state.modalShare.isOpen = true;
            state.modalShare.idPost = action.payload;
        },
        closeModalShare: (state) => {
            state.modalShare = initialState.modalShare;
        },
    },
});

export const ModalShareReducer = ModalShareSlice.reducer;
export const { openModalShare, closeModalShare } = ModalShareSlice.actions;
