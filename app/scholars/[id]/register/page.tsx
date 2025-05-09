"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  setDoc,
  getFirestore,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFileToCloudinary } from "@/lib/fileupload";
import Head from "next/head";
import RegisterScholarshipLoader from "@/components/Loader/registerscholarLoader";

type FormData = {
  nama: string;
  nim: string;
  email: string;
  program_studi: string;
  semester: string;
  alasan?: string;
  dokumen: File | null;
};

export default function ScholarshipRegistrationForm({
  params: asyncParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(asyncParams); // Unwrap params
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nim: "",
    email: "",
    program_studi: "",
    semester: "",
    alasan: "",
    dokumen: null,
  });

  const [scholarshipTitle, setScholarshipTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const db = getFirestore();

  // Fetch authenticated user data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setFormData((prevData) => ({
              ...prevData,
              nama: userData.fullName || "",
              email: userData.email || "",
            }));
          } else {
            console.warn("No user document found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [db]);

  // Fetch scholarship title dynamically based on document ID
  useEffect(() => {
    (async () => {
      const { id } = await params;

      try {
        const scholarshipRef = doc(db, "scholarship", id);
        const scholarshipDoc = await getDoc(scholarshipRef);

        if (scholarshipDoc.exists()) {
          const scholarshipData = scholarshipDoc.data();
          setScholarshipTitle(scholarshipData.nama_beasiswa || "Scholarship");

          // Check if the user has already registered for this scholarship
          const registrationsRef = collection(
            db,
            "scholarship",
            id,
            "pendaftaran_beasiswa"
          );
          const registrationQuery = query(
            registrationsRef,
            where("email", "==", formData.email)
          );
          const registrationSnapshot = await getDocs(registrationQuery);

          if (!registrationSnapshot.empty) {
            setIsAlreadyRegistered(true); // User already registered
          }
        } else {
          console.warn("Scholarship not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching scholarship data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [db, params, formData.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2 MB.", { position: "top-center" });
      return;
    }

    setFormData((prevData) => ({ ...prevData, dokumen: file }));
  };

  const generateRegistrationId = async (
    scholarshipId: string
  ): Promise<string> => {
    const registrationsRef = collection(
      db,
      "scholarship",
      scholarshipId,
      "pendaftaran_beasiswa"
    );
    const snapshot = await getDocs(query(registrationsRef));
    return (snapshot.size + 1).toString(); // Generate ID based on current size + 1
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nama ||
      !formData.nim ||
      !formData.email ||
      !formData.program_studi ||
      !formData.semester ||
      !formData.alasan ||
      !formData.dokumen
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { id } = await params;

      if (!id) {
        throw new Error("Scholarship ID not found.");
      }

      let documentUrl = "";
      if (formData.dokumen) {
        documentUrl = await uploadFileToCloudinary(formData.dokumen);
      }

      const registrationId = await generateRegistrationId(id);

      const registrationRef = doc(
        collection(db, "scholarship", id, "pendaftaran_beasiswa"),
        formData.nim
      );

      await setDoc(registrationRef, {
        registrationId,
        nama: formData.nama,
        nim: formData.nim,
        email: formData.email,
        program_studi: formData.program_studi,
        semester: formData.semester,
        alasan_mendaftar: formData.alasan,
        nama_beasiswa: scholarshipTitle,
        tanggal_pendaftaran: formatDate(new Date()),
        status: "menunggu persetujuan",
        catatan_admin: "",
        dokumen: documentUrl,
      });

      toast.success("Registration submitted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        window.location.href = `/status`;
      }, 1500);
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Failed to submit registration. Please try again later.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <RegisterScholarshipLoader />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <Head>
        <title>Register for {scholarshipTitle}</title>
      </Head>
      <ToastContainer />
      <h1 className="text-4xl font-bold text-left text-black mb-8">
        Register for {scholarshipTitle}
      </h1>

      {isAlreadyRegistered ? (
        <div className="text-center py-16">
          <p className="text-2xl font-bold text-blue-800 mb-4">
            You have already registered for this scholarship.
          </p>
          <p className="text-gray-700 mb-6">
            Please check your application status for updates.
          </p>
          <button
            onClick={() => (window.location.href = `/status`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Status Page
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-lg font-semibold mb-2">
              Full Name*
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-300 focus:ring focus:outline-none"
              readOnly
            />
          </div>

          {/* NIM */}
          <div>
            <label htmlFor="nim" className="block text-lg font-semibold mb-2">
              Student ID (NIM)*
            </label>
            <input
              type="text"
              id="nim"
              name="nim"
              value={formData.nim}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-300 focus:ring focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-semibold mb-2">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-300 focus:ring focus:outline-none"
              readOnly
            />
          </div>

          {/* Program Studi */}
          <div>
            <label
              htmlFor="program_studi"
              className="block text-lg font-semibold mb-2"
            >
              Study Program*
            </label>
            <input
              type="text"
              id="program_studi"
              name="program_studi"
              value={formData.program_studi}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-300 focus:ring focus:outline-none"
              placeholder="Enter your program of study"
              required
            />
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="semester"
              className="block text-lg font-semibold mb-2"
            >
              Semester*
            </label>
            <input
              type="number"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-300 focus:ring focus:outline-none"
              min={1}
              max={14}
              required
            />
          </div>

          {/* Alasan */}
          <div>
            <label
              htmlFor="alasan"
              className="block text-lg font-semibold mb-2"
            >
              Reason for Applying
            </label>
            <textarea
              id="alasan"
              name="alasan"
              value={formData.alasan}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-300 focus:ring focus:outline-none"
              rows={4}
            ></textarea>
          </div>

          {/* Dokumen */}
          <div>
            <label
              htmlFor="dokumen"
              className="block text-lg font-semibold mb-2"
            >
              Upload Supporting Documents*
            </label>
            <input
              type="file"
              id="dokumen"
              name="dokumen"
              onChange={handleFileChange}
              className="w-full px-4 py-2"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Max file size: 2 MB.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold ${
              isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
