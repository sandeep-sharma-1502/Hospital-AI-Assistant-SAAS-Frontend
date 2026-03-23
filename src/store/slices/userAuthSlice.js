import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/userApiClient";

// 1. Load from localStorage
const savedUser = localStorage.getItem("user");

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
  isAccountVerified: getSafeJSON(savedUser)?.isAccountVerified || false,
  loading: false,
  error: null,
  message: null,
};

// 2. Thunks

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/register", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/login", userData);
      if (data.success === false) {
        return rejectWithValue(data.message || "Login failed");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Send Verify OTP
export const sendVerifyOtp = createAsyncThunk(
  "auth/sendVerifyOtp",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/send-verify-otp");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

// Verify Account
export const verifyAccount = createAsyncThunk(
  "auth/verifyAccount",
  async (otp, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/verify-account", { otp });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

// Send Reset Pass OTP
export const sendResetOtp = createAsyncThunk(
  "auth/sendResetOtp",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/send-reset-otp", { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reset OTP");
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/reset-password", resetData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// Check if Auth (Persistent)
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/auth/is-auth");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Not authenticated");
    }
  }
);

// Get User Data
// Get User Data
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/user/data"); 
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/logout");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// 3. Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAccountVerified = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.userData;
        state.isAccountVerified = action.payload.userData?.isAccountVerified;
        localStorage.setItem("user", JSON.stringify(state.user));
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.isAccountVerified = true;
        state.message = action.payload.message;
      })
      // LOGOUT (from logoutUser thunk)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAccountVerified = false;
        localStorage.removeItem("user");
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.success;
        const user = action.payload.user || action.payload.userData;
        if (action.payload.success && user) {
          state.user = user;
          state.isAccountVerified = user.isAccountVerified;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      // User Data
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload.userData;
        state.isAccountVerified = action.payload.userData?.isAccountVerified;
        localStorage.setItem("user", JSON.stringify(state.user));
      });
  },
});

export const { clearError, clearMessage, logout } = authSlice.actions;
export default authSlice.reducer;
