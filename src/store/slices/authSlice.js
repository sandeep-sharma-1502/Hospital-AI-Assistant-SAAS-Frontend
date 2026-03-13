import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

// -------------------------------
// Load from localStorage
// -------------------------------
const savedToken = localStorage.getItem("adminToken");
const savedUser = localStorage.getItem("adminUser");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  loading: false,
  logoutLoading: false,
  error: null,
};

// -------------------------------
// 🔐 Async Login Thunk
// -------------------------------
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      return response.data; // { access_token, token_type }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Login failed"
      );
    }
  }
);

// -------------------------------
// 🔐 Async Logout Thunk
// -------------------------------
export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      await apiClient.post("/auth/logout");
    }

    return true;
  }
);

// -------------------------------
// Slice
// -------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = {
          email: action.payload.email,
          full_name: action.payload.full_name,
        };
        state.isAuthenticated = true;

        localStorage.setItem("adminToken", action.payload.access_token);
        localStorage.setItem("adminUser", JSON.stringify(state.user));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutAdmin.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.logoutLoading = false;
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.logoutLoading = false;
      })
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;