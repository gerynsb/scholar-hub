"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful! Welcome back!", {
        position: "top-center",
        autoClose: 3000, // Toast akan muncul selama 3 detik
      });
      setTimeout(() => {
        router.push("/"); // Redirect ke halaman utama setelah toast selesai
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
        toast.error(`Login failed: ${err.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        console.error("Login failed with an unknown error:", err);
        toast.error("Login failed with an unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warn("Please enter your email before resetting your password.", {
        position: "top-center",
        autoClose: 3000, // Toast akan muncul selama 3 detik
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.", {
        position: "top-center",
        autoClose: 3000, // Toast akan muncul selama 3 detik
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error resetting password:", err.message);
        toast.error(`Error resetting password: ${err.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        console.error("Error resetting password:", err);
        toast.error("An unknown error occurred while resetting the password.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div
      className="relative flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/signin.jpg')" }}
    >
      {/* Toast Notification */}
      <ToastContainer />

      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-6xl font-bold text-white">Welcome!</h1>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-50">
        <form className="w-full max-w-md space-y-6" onSubmit={handleSignIn}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Your Password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 bottom-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-blue focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-blue-400 hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#143F6B] hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign In"}
            </button>
          </div>

          <div className="text-sm text-center text-white mt-4">
            Don’t have an account?{" "}
            <a
              href="/auth/sign-up"
              className="font-medium text-blue-400 hover:underline"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
