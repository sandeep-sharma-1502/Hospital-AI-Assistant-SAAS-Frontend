import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyAdminAccount, sendAdminVerifyOtp } from "../../../store/slices/authSlice";
import { ShieldCheck, Loader2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

const AdminVerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (user?.isAccountVerified) {
      toast.success("Admin account verified!");
      navigate("/admin/dashboard");
    }
  }, [user?.isAccountVerified, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return toast.error("Please enter all 6 digits");

    const result = await dispatch(verifyAdminAccount(otpString));
    if (verifyAdminAccount.fulfilled.match(result)) {
      // Success handled by useEffect
    } else {
      toast.error(result.payload || "Verification failed");
    }
  };

  const handleResend = async () => {
    const result = await dispatch(sendAdminVerifyOtp());
    if (sendAdminVerifyOtp.fulfilled.match(result)) {
      toast.success("New OTP sent to your admin email");
    } else {
      toast.error(result.payload || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
      <div className="bg-[var(--card)] p-8 rounded-3xl shadow-xl border border-[var(--border-subtle)] w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Verify Admin Account</h2>
        <p className="text-[var(--text-secondary)] mb-8">Enter the 6-digit code sent to your email</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                required
              />
            ))}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Account"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <RefreshCcw size={16} />
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVerifyEmailPage;
