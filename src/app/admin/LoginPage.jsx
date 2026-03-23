import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.adminAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      loginAdmin({ email, password })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
      <form
        onSubmit={handleLogin}
        className="bg-[var(--card)] p-8 rounded-3xl shadow-xl border border-[var(--border-subtle)] w-96"
      >
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6 text-center">
          Admin Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Password</span>
              <button 
                type="button"
                onClick={() => navigate("/admin/forgot-password")}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}