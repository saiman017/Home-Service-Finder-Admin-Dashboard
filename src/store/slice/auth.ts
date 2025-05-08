// src/store/slice/auth.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios/axiosinstance";
import { decodeBase64Data } from "../../utils/decoder";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  role: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,
};

export const login = createAsyncThunk("auth/login", async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const decoded = decodeBase64Data(res.data?.data);

    if (!decoded || decoded.role?.toLowerCase() !== "admin") {
      throw new Error("Unauthorized: Only admins allowed.");
    }

    return {
      accessToken: decoded.accessToken,
      refreshToken: decoded.refreshToken,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
