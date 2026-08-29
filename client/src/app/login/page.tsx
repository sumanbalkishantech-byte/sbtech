"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://sbtech-production.up.railway.app/api/auth/login", {
        email,
        password,
      });

      // Save the JWT token securely to localStorage
      localStorage.setItem("token", response.data.token);
      
      // Save user info (to determine if they are super_admin or user)
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect based on role
      if (response.data.user.role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#F9F8F4] overflow-hidden">
      
      {/* Seamless Washi Paper Texture */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-sm border border-[#183629]/5 p-8 md:p-10 relative z-10">
        
        {/* Header with Client Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="group mb-6">
            <img 
              src="/kp_logo.png" 
              alt="KitabPoint Logo" 
              className="h-16 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h1 className="text-3xl font-black text-[#183629] tracking-tight">Welcome Back</h1>
          <p className="text-sm font-medium text-[#183629]/60 mt-2">Enter your credentials to access your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-wider font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#183629]/40 stroke-[2]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] transition-all outline-none text-[#183629] font-bold placeholder-[#183629]/30"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#183629]/40 stroke-[2]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] transition-all outline-none text-[#183629] font-bold placeholder-[#183629]/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#183629] hover:bg-[#12291f] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-[#183629]/20 hover:-translate-y-1 disabled:opacity-70 disabled:hover:-translate-y-0 group mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-bold text-[#183629]/50">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#E27142] hover:text-[#c45a31] transition-colors uppercase tracking-wider text-xs ml-1">
            Create one here
          </Link>
        </p>
      </div>
    </main>
  );
}