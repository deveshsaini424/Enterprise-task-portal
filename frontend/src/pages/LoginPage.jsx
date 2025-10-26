import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth, localLogin } from "../api"; 
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingLocal(true);
    try {
      const response = await localLogin({ email, password });
      const { token, user } = response.data;
      login(user, token);
    } catch (err) {
      console.error("Local login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
        setLoadingLocal(false);
    }
  };

  const responseGoogle = async (authResult) => {
    setError("");
    setLoadingGoogle(true);
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        const { token, user } = result.data;
        login(user, token); 
        navigate('/app/dashboard', { replace: true }); 
      } else {
         throw new Error("Google authentication failed: No code received.");
      }
    } catch (err) {
      console.error("Google login processing error:", err);
      setError("Google login failed. Please try again.");
    } finally {
        setLoadingGoogle(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle, 
    onError: (err) => {
      console.error("Google Login Initialization Error:", err);
      setError("Failed to initiate Google login.");
      setLoadingGoogle(false);
    },
    flow: "auth-code",
  });
  
  const triggerGoogleLogin = () => {
      setError("");
      setLoadingGoogle(true);
      googleLogin();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-6 border border-white/20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">Sign in to continue your journey</p>
          </div>
        
          {error && (
            <div className="p-4 text-sm text-red-800 bg-red-50 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form className="space-y-4 sm:space-y-5" onSubmit={handleLocalLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loadingLocal || loadingGoogle}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loadingLocal || loadingGoogle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingLocal || loadingGoogle}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loadingLocal && <Loader2 className="animate-spin" size={18}/>}
              Sign in
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative px-4 text-sm font-medium text-gray-500 bg-white/80">
              OR
            </div>
          </div>

          <button
            onClick={triggerGoogleLogin}
            disabled={loadingLocal || loadingGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loadingGoogle ? (
              <Loader2 className="animate-spin" size={18}/>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Sign in with Google
          </button>
        
          <p className="text-sm text-center text-gray-600 pt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default LoginPage;