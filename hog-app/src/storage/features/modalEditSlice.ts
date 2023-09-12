import { createSlice } from "@reduxjs/toolkit";

export interface ModalEditI {
    isOpen: boolean;
}

const initialState: { modalEdit: ModalEditI } = {
    modalEdit: {
        isOpen: false,
    },
};

export const ModalEditSlice = createSlice({
    name: "modalEdit",
    initialState,
    reducers: {
        openModalEdit: (state) => {
            state.modalEdit.isOpen = true;
        },
        closeModalEdit: (state) => {
            state.modalEdit = initialState.modalEdit;
        },
    },
});

export const ModalEditReducer = ModalEditSlice.reducer;
export const { openModalEdit, closeModalEdit } = ModalEditSlice.actions;
