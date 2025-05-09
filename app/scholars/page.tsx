"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/layout/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getScholarshipStatus } from "@/utility/scholarshipdatautility";
import "@/styles/scholarpage.css";
import ScholarshipLoader from "@/components/Loader/scholarLoeader";
import FilterSection from "@/components/scholars/FilterSection";
import ScholarshipCard from "@/components/scholars/ScholarshipCard";

export default function Home() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [selectedMasaAktif, setSelectedMasaAktif] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsLoggedIn(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const scholarshipRef = collection(db, "scholarship");
        const querySnapshot = await getDocs(scholarshipRef);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const handleCardClick = (id: string) => {
    if (isLoggedIn) {
      window.location.href = `/scholars/${id}`;
    } else {
      toast.error("Please sign in to view the scholarship details.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const isMasaAktifValid =
      selectedMasaAktif === "" ||
      (selectedMasaAktif === "Sedang Berlangsung" &&
        getScholarshipStatus(scholarship.tanggal_mulai, scholarship.tanggal_akhir) ===
          "Active") ||
      (selectedMasaAktif === "Akan Berakhir" &&
        scholarship.tanggal_akhir <= new Date().toISOString());
    const isJenisValid =
      selectedJenis === "" || scholarship.kategori === selectedJenis;

    return isMasaAktifValid && isJenisValid;
  });

  return (
    <div className="scholar-page">
      <div className="bg-white py-6 px-6 sm:px-8 md:px-16 mt-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-12 pl-12">
          Found Scholar
        </h1>

        <div className="container">
          {/* Filter Section */}
          <FilterSection
            selectedMasaAktif={selectedMasaAktif}
            setSelectedMasaAktif={setSelectedMasaAktif}
            selectedJenis={selectedJenis}
            setSelectedJenis={setSelectedJenis}
          />

          {/* Cards Section */}
          {isLoading ? (
            <ScholarshipLoader itemCount={6} />
          ) : (
            <div className="cards-container">
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  id={scholarship.id}
                  nama_beasiswa={scholarship.nama_beasiswa}
                  tanggal_mulai={scholarship.tanggal_mulai}
                  tanggal_akhir={scholarship.tanggal_akhir}
                  deskripsi={scholarship.deskripsi}
                  kategori={scholarship.kategori}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
