import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { sendResetOtp } from "../../../store/slices/userAuthSlice";
import AuthLayout from "../components/AuthLayout";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.userAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address");
    }

    const result = await dispatch(sendResetOtp(email));
    if (sendResetOtp.fulfilled.match(result)) {
      toast.success("Reset code sent to your email!");
      // We pass the email to the reset page so the user doesn't have to type it again
      navigate("/reset-password", { state: { email } });
    } else {
      toast.error(result.payload || "Failed to send reset code");
    }
  };

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="Enter your email to receive a password reset code"
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

        <button 
          type="submit" 
          className="auth-btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={20} />
              <span>Send Reset Code</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer mt-6">
        <Link to="/login" title="title" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
