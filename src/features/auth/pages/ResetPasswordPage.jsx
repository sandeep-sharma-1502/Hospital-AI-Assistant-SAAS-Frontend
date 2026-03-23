import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../../../store/slices/userAuthSlice";
import AuthLayout from "../components/AuthLayout";
import { Lock, ShieldCheck, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.userAuth);

  // Get email from location state
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please start from the forgot password page.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(pasteData.length - 1, 5);
    inputRefs.current[lastIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return toast.error("Please enter all 6 digits of the code");
    }
    if (!newPassword) {
      return toast.error("Please enter your new password");
    }

    const result = await dispatch(resetPassword({ email, otp: otpString, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Failed to reset password");
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle={`Enter the code sent to ${email} and your new password`}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group pb-2">
          <label className="form-label">Reset Code</label>
          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="otp-input"
                value={digit}
                style={{ width: '40px', height: '50px' }}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                required
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">New Password</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400">
              <Lock size={18} />
            </span>
            <input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className="form-input pl-10 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="auth-btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <KeyRound size={20} />
              <span>Reset Password</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer mt-6">
        <Link to="/forgot-password" title="title" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
