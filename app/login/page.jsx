"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaCheck, FaEnvelope, FaLock } from "react-icons/fa";

axios.defaults.withCredentials = true;

export default function Login() {
  const router = useRouter();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", userData, {
        withCredentials: true,
      });

      if (res.status === 200 && res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/");
      } else {
        setErrorMsg(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6 hover:border-white/30 transition-all duration-300"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-xl shadow-lg">
                <FaCheck className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-300 text-sm">Sign in to your account</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="relative group">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={userData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15"
              />
            </div>

            <div className="relative group">
              <FaLock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-md hover:bg-white/15"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2 animate-shake">
              <span className="text-lg">⚠</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Signing in...
              </span>
            ) : (
              "Log In"
            )}
          </button>

          {/* Footer Link */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}