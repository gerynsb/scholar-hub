"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig"; // Firebase config
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Swal from "sweetalert2"; // Import SweetAlert2
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // State user
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile
  const router = useRouter();
  const pathname = usePathname(); // Dapatkan path saat ini

  // Cek status autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update state user
    });

    return () => unsubscribe(); // Cleanup listener saat komponen dilepas
  }, []);

  // Fungsi untuk logout dengan SweetAlert2
  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be signed out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, sign out!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          toast.success("You have successfully signed out.", {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => {
            router.push("/");
          }, 3000); // Tunggu 3 detik sebelum redirect
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error signing out:", error.message);
            toast.error(`Failed to sign out: ${error.message}`, {
              position: "top-center",
              autoClose: 3000,
            });
          } else {
            console.error("Unexpected error signing out:", error);
            toast.error("Failed to sign out due to an unexpected error.", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        }
      }
    });
  };

  return (
    <nav
      className="bg-[#143F6B] text-white sticky top-0 z-50 shadow-md"
      // Sticky navbar with shadow
    >
      {/* Toast Notification */}
      <ToastContainer />

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold">
          <Link href="/">ScholarHub</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-[#143F6B] z-50 md:static md:w-auto md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0 p-4 md:p-0">
            <Link
              href="/"
              className={`px-3 py-1 ${
                pathname === "/"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/scholars"
              className={`px-3 py-1 ${
                pathname === "/scholars"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Scholars
            </Link>
            <Link
              href="/status"
              className={`px-3 py-1 ${
                pathname === "/status"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Status
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1 ${
                pathname === "/about"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              About
            </Link>

            {/* User Section */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 hover:text-gray-300"
                  >
                    <FiUser size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 border border-white text-white rounded-full hover:bg-red-600 transition"
                  >
                    <FiLogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="px-4 py-2 border border-white text-white rounded-full hover:bg-gray-100 hover:text-blue-900 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
