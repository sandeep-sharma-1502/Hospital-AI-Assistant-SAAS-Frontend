import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

// -------------------------------
// Load from localStorage
// -------------------------------
const savedUser = localStorage.getItem("adminUser");

// Helper for safe JSON parsing
const getSafeJSON = (val) => {
  if (!val || val === "undefined") return null;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
};

const initialState = {
  user: getSafeJSON(savedUser),
  isAuthenticated: !!getSafeJSON(savedUser),
  isInitialized: false, // ✅ Prevents route guards from evaluating before auth check
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
      const response = await apiClient.post("/admin/auth/login", {
        email,
        password,
      });

      if (response.data.success === false) {
        return rejectWithValue(response.data.message || "Invalid credentials");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.detail || "Login failed"
      );
    }
  }
);

// -------------------------------
// 🔐 Async Logout Thunk
// -------------------------------
export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async () => {
    await apiClient.post("/admin/auth/logout");
    return true;
  }
);

// Check Admin Auth (Persistent)
export const checkAdminAuth = createAsyncThunk(
  "auth/checkAdminAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/admin/auth/is-auth");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Not authenticated");
    }
  }
);

// Send Admin Verify OTP
export const sendAdminVerifyOtp = createAsyncThunk(
  "auth/sendAdminVerifyOtp",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/admin/auth/send-verify-otp");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

// Verify Admin Account
export const verifyAdminAccount = createAsyncThunk(
  "auth/verifyAdminAccount",
  async (otp, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/admin/auth/verify-account", { otp });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

// Send Admin Reset Pass OTP
export const sendAdminResetOtp = createAsyncThunk(
  "auth/sendAdminResetOtp",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/admin/auth/send-reset-otp", { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reset OTP");
    }
  }
);

// Reset Admin Password
export const resetAdminPassword = createAsyncThunk(
  "auth/resetAdminPassword",
  async (resetData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/admin/auth/reset-password", resetData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
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
      state.isAuthenticated = false;
      localStorage.removeItem("adminUser");
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
        state.user = action.payload.userData || action.payload.user;
        state.isAuthenticated = true;

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
        state.isAuthenticated = false;
        state.logoutLoading = false;
        localStorage.removeItem("adminUser");
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.logoutLoading = false;
      })
      // VERIFY ADMIN
      .addCase(verifyAdminAccount.fulfilled, (state, action) => {
        if (state.user) {
          state.user.isAccountVerified = true;
          localStorage.setItem("adminUser", JSON.stringify(state.user));
        }
        state.error = null;
      })
      .addCase(verifyAdminAccount.rejected, (state, action) => {
        state.error = action.payload;
      })
      // SEND OTP ADMIN
      .addCase(sendAdminVerifyOtp.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      // CHECK AUTH
      .addCase(checkAdminAuth.pending, (state) => {
        state.isInitialized = false;
      })
      .addCase(checkAdminAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.success;
        const user = action.payload.user || action.payload.userData;
        if (action.payload.success && user) {
          state.user = user;
          localStorage.setItem("adminUser", JSON.stringify(state.user));
        }
        state.isInitialized = true; // ✅ Auth check done
      })
      .addCase(checkAdminAuth.rejected, (state) => {
        // ✅ Clear auth state when is-auth check fails (e.g. expired cookie)
        state.isAuthenticated = false;
        state.user = null;
        state.isInitialized = true; // ✅ Auth check done (unauthenticated)
        localStorage.removeItem("adminUser");
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;