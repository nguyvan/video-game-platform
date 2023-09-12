import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserI {
    _id: string;
    username: string;
    email: string;
    urlImage?: string;
    bio?: string;
}

const initialState: { user: UserI | object } = {
    user: {},
};

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<UserI>) => {
            state.user = action.payload;
        },
    },
});

export const UserReducer = UserSlice.reducer;
export const { updateUser } = UserSlice.actions;
