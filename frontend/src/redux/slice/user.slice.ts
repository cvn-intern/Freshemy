import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ChangePassword as ChangePasswordType } from "../../types/user";
import { Response } from "../../types/response";
import UserApis from "../../apis/user";

type UserSlice = {
    error: string;
    message: string;
    isLoading: boolean;
};

const initialState: UserSlice = {
    error: "",
    message: "",
    isLoading: false,
};

export const changePassword = createAsyncThunk<Response<null>, ChangePasswordType, { rejectValue: Response<null> }>(
    "auth/verifyEmail",
    async (body, ThunkAPI) => {
        try {
            const response = await UserApis.changePassword(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
        setMessageEmpty: (state) => {
            state.error = "";
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder.addCase(changePassword.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });
        builder.addCase(changePassword.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(changePassword.rejected, (state, action) => {
            state.error = action.payload?.message as string;

            state.isLoading = false;
        });
    },
});

export default userSlice.reducer;

export const { setError, setMessage, setMessageEmpty } = userSlice.actions;
