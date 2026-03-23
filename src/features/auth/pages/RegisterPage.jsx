import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../../../store/slices/userAuthSlice";
import AuthLayout from "../components/AuthLayout";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/verify-email"); // Redirect to OTP verification after success
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Please verify your email.");
      navigate("/verify-email");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join our hospital assistance platform today"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <User size={18} />
            </span>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="form-input pl-10 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

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
          <label className="form-label" htmlFor="password">Password</label>
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
              <UserPlus size={20} />
              <span>Sign Up</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? 
        <Link to="/login" title="title" className="auth-link">Log In</Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
