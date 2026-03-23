import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyAccount, sendVerifyOtp } from "../../../store/slices/userAuthSlice";
import AuthLayout from "../components/AuthLayout";
import { ShieldCheck, Loader2, RefreshCcw, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAccountVerified, isAuthenticated } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (isAccountVerified) {
      toast.success("Account verified successfully!");
      navigate("/");
    }
  }, [isAccountVerified, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
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
    
    // Focus last input or first empty
    const lastIndex = Math.min(pasteData.length - 1, 5);
    inputRefs.current[lastIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return toast.error("Please enter all 6 digits");
    }

    const result = await dispatch(verifyAccount(otpString));
    if (verifyAccount.fulfilled.match(result)) {
      // Success handled by useEffect
    } else {
      toast.error(result.payload || "Verification failed");
    }
  };

  const handleResend = async () => {
    const result = await dispatch(sendVerifyOtp());
    if (sendVerifyOtp.fulfilled.match(result)) {
      toast.success("New OTP sent to your email");
    } else {
      toast.error(result.payload || "Failed to resend OTP");
    }
  };

  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle="We've sent a 6-digit code to your email address"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="otp-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              className="otp-input"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              required
            />
          ))}
        </div>

        <button 
          type="submit" 
          className="auth-btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Verify Account</span>
            </>
          )}
        </button>

        <button 
          type="button" 
          onClick={handleResend}
          className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mt-4"
        >
          <RefreshCcw size={16} />
          Resend Verification Code
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
