import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { sendAdminResetOtp } from "../../../store/slices/authSlice";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

const AdminForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.adminAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    const result = await dispatch(sendAdminResetOtp(email));
    if (sendAdminResetOtp.fulfilled.match(result)) {
      toast.success("Reset code sent to your email!");
      navigate("/admin/reset-password", { state: { email } });
    } else {
      toast.error(result.payload || "Failed to send reset code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
      <div className="bg-[var(--card)] p-8 rounded-3xl shadow-xl border border-[var(--border-subtle)] w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Forgot Password</h2>
          <p className="text-[var(--text-secondary)] mt-2">Enter your admin email to receive a reset code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full p-4 pl-12 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

        <div className="mt-8 text-center">
          <Link 
            to="/admin/login" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPasswordPage;
