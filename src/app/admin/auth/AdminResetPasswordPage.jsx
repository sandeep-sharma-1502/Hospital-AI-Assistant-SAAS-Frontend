import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetAdminPassword } from "../../../store/slices/authSlice";
import { Lock, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const AdminResetPasswordPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.adminAuth);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please start from the forgot password page.");
      navigate("/admin/forgot-password");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return toast.error("Please enter all 6 digits");
    if (!newPassword) return toast.error("Please enter new password");

    const result = await dispatch(resetAdminPassword({ email, otp: otpString, newPassword }));
    if (resetAdminPassword.fulfilled.match(result)) {
      toast.success("Password reset successful!");
      navigate("/admin/login");
    } else {
      toast.error(result.payload || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
      <div className="bg-[var(--card)] p-8 rounded-3xl shadow-xl border border-[var(--border-subtle)] w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Reset Admin Password</h2>
          <p className="text-[var(--text-secondary)] mt-1">Enter the code sent to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Security Code</label>
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
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">New Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 pl-12 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPasswordPage;
