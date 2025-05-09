"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "@/lib/firebaseConfig"; // Firebase config
import { doc, getDoc } from "firebase/firestore";
import {
  getScholarshipStatus,
  formatCustomDate,
} from "@/utility/scholarshipdatautility"; // Utility functions
import ScholarshipDetailLoader from "@/components/Loader/scholarDetailLoader";

export default function ScholarDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fungsi untuk mengatasi Promise pada params
    const fetchScholarshipData = async () => {
      try {
        const { id } = await params; // Tunggu `params` selesai diproses
        const docRef = doc(db, "scholarship", id); // Referensi ke dokumen Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setScholarship({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Scholarship not found.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching scholarship:", error);
        toast.error("Failed to load scholarship data.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarshipData();
  }, [params]);

  if (isLoading) {
    return <ScholarshipDetailLoader />;
  }

  if (!scholarship) {
    return (
      <div className="text-center text-red-600 py-16">
        <h1 className="text-3xl font-bold">Scholarship not found.</h1>
      </div>
    );
  }

  const isScholarshipActive =
    getScholarshipStatus(
      scholarship.tanggal_mulai,
      scholarship.tanggal_akhir
    ) === "Open";

  const handleButtonClick = () => {
    if (!isScholarshipActive) {
      toast.error("The scholarship application is already closed.", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      router.push(`/scholars/${scholarship.id}/register`);
    }
  };

  return (
    <div className="bg-white py-8 px-8 max-w-7xl mx-auto shadow-lg rounded-lg border border-gray-200 mt-16">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {scholarship.nama_beasiswa}
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        <strong>Date:</strong> {formatCustomDate(scholarship.tanggal_mulai)} -{" "}
        {formatCustomDate(scholarship.tanggal_akhir)}.
      </p>
      <div className="flex items-center space-x-2 mb-8">
        <span
          className={`px-4 py-2 rounded-full text-lg ${
            isScholarshipActive
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {getScholarshipStatus(
            scholarship.tanggal_mulai,
            scholarship.tanggal_akhir
          )}
        </span>
        <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-lg">
          {scholarship.kategori}
        </span>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Description
        </h2>
        <p className="text-gray-700">{scholarship.deskripsi}</p>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Requirements
        </h2>
        <ul className="list-none pl-6 text-gray-700">
          {Array.isArray(scholarship.persyaratan_beasiswa) ? (
            scholarship.persyaratan_beasiswa.map(
              (req: string, index: number) => (
                <li key={index}>
                  <span className="font-semibold">{index + 1}. </span>
                  {req}
                </li>
              )
            )
          ) : (
            <p>
              {scholarship.persyaratan_beasiswa || "No requirements available."}
            </p>
          )}
        </ul>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
        <p className="text-gray-700">{scholarship.kontak}</p>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <button
        className={`w-full py-3 rounded-lg text-lg font-semibold transition duration-200 ${
          isScholarshipActive
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={handleButtonClick}
        disabled={!isScholarshipActive}
      >
        {isScholarshipActive ? "Register Now" : "Closed"}
      </button>
    </div>
  );
}
