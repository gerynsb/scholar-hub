"use client"; // <-- Add this line to mark this file as a client component

import { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FiEdit, FiSave, FiX, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.warn("No user logged in!", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/auth/sign-in");
        return;
      }

      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFullName(data.fullName);
        setEmail(data.email);
      } else {
        toast.error("No such document found!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error fetching profile: ${error.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("An unknown error occurred while fetching the profile.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.warn("No user logged in!", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { fullName: newFullName }); // only update fullName
      setFullName(newFullName);
      setIsEditing(false);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error updating profile: ${error.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("An unknown error occurred while updating the profile.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete your account permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = auth.currentUser;
          if (!user) {
            toast.warn("No user logged in!", {
              position: "top-center",
              autoClose: 3000,
            });
            return;
          }

          const userDoc = doc(db, "users", user.uid);
          await deleteDoc(userDoc); // Delete user data from Firestore
          await user.delete(); // Delete user from Firebase Authentication

          // Logout user after account deletion
          await auth.signOut();

          toast.success("Profile deleted successfully!", {
            position: "top-center",
            autoClose: 3000,
          });

          // Redirect to login page after logout
          router.push("/auth/sign-in");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(`Error deleting profile: ${error.message}`, {
              position: "top-center",
              autoClose: 3000,
            });
          } else {
            toast.error("An unknown error occurred while deleting the profile.", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        }
      }
    });
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <ToastContainer />
      <div className="w-full max-w-3xl p-12 bg-white rounded-2xl shadow-2xl border border-gray-300">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-700">
          Profile Settings
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : isEditing ? (
          <>
            {/* Input hanya untuk Fullname saja */}
            <div className="mb-6">
              <label
                htmlFor="newFullName"
                className="block text-sm font-medium text-gray-600"
              >
                Full Name
              </label>
              <input
                type="text"
                id="newFullName"
                className="w-full px-4 py-3 mt-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 mt-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email || ""}
                disabled
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition"
              >
                <FiSave />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-5 py-2 bg-gray-300 text-gray-700 rounded-xl shadow-md hover:bg-gray-400 transition"
              >
                <FiX />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Menampilkan Full Name dan Email jadi Text */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Full Name:</p>
              <p className="text-lg font-semibold text-gray-800">
                {fullName || "Loading..."}
              </p>
            </div>
            <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-lg font-semibold text-gray-800">
                {email || "Loading..."}
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
              >
                <FiEdit />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
