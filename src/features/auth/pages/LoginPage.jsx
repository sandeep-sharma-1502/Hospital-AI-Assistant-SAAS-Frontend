import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../../../store/slices/userAuthSlice";
import AuthLayout from "../components/AuthLayout";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.userAuth);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const userData = result.payload?.userData;
      if (userData?.isAccountVerified) {
        // ✅ Already verified — go straight to the app
        toast.success("Welcome back!");
        navigate("/");
      } else {
        // ✅ Unverified — OTP was sent by backend, go to verify page
        toast.success("OTP sent to your email. Please verify your account.");
        navigate("/verify-email");
      }
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to your hospital assistant account"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <Mail size={18} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="form-input pl-10 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="flex justify-between items-center">
            <label className="form-label" htmlFor="password">Password</label>
            <Link to="/forgot-password" title="title" className="text-xs font-semibold text-blue-600 hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <Lock size={18} />
            </span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="form-input pl-10 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="auth-btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <LogIn size={20} />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? 
        <Link to="/register" title="title" className="auth-link">Create Account</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
