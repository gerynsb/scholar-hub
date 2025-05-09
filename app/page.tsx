"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/layout/heroSection";
import Footer from "@/components/layout/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import FilterSection from "@/components/home/FilterSection";
import ScholarshipCard from "@/components/home/ScholarshipCard";
import HomeSkeletonLoader from "@/components/Loader/homeLoader";
import { getScholarshipStatus } from "@/utility/scholarshipdatautility";
import Image from "next/image";

export default function Home() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [isActiveDropdownOpen, setIsActiveDropdownOpen] = useState(true);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(true);
  const [selectedActiveFilters, setSelectedActiveFilters] = useState<string[]>([]);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  interface Scholarship {
    id: string;
    nama_beasiswa: string;
    tanggal_mulai: string; // Gunakan Date jika ini berupa objek tanggal
    tanggal_akhir: string; // Gunakan Date jika ini berupa objek tanggal
    deskripsi: string;
    kategori: string;
  }

  // Ambil data beasiswa dari Firestore
  useEffect(() => {
    const fetchScholarships = async () => {
      setIsLoading(true);
      try {
        const scholarshipRef = collection(db, "scholarship");
        const snapshot = await getDocs(scholarshipRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast.error("Failed to fetch scholarships. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Simulasikan status login pengguna
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsLoggedIn(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi untuk menangani perubahan filter
  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "active") {
      setSelectedActiveFilters((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (filterType === "category") {
      setSelectedCategoryFilters((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSelectedActiveFilters([]);
    setSelectedCategoryFilters([]);
  };

  // Fungsi untuk memfilter daftar beasiswa
  const filteredScholarships = scholarships.filter((scholarship) => {
    const status = getScholarshipStatus(
      scholarship.tanggal_mulai,
      scholarship.tanggal_akhir
    );

    const isActiveMatch =
      selectedActiveFilters.length === 0 ||
      (selectedActiveFilters.includes("Masih Berlangsung") && status === "Open") ||
      (selectedActiveFilters.includes("Akan Berakhir") && status === "Closed");

    const isCategoryMatch =
      selectedCategoryFilters.length === 0 ||
      selectedCategoryFilters.includes(scholarship.kategori);

    return isActiveMatch && isCategoryMatch;
  });

  // Fungsi untuk handle klik pada card
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

  return (
    <div>
      <HeroSection />
      {isLoading ? (
        <HomeSkeletonLoader />
      ) : (
        <>
          <div className="bg-white py-16 px-16 mt-10">
            <h1 className="text-4xl font-bold text-blue-900 mb-12">
              Found Scholar
            </h1>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filter Section */}
              <FilterSection
                isActiveDropdownOpen={isActiveDropdownOpen}
                setIsActiveDropdownOpen={setIsActiveDropdownOpen}
                isCategoryDropdownOpen={isCategoryDropdownOpen}
                setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
                selectedActiveFilters={selectedActiveFilters}
                selectedCategoryFilters={selectedCategoryFilters}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
              />

              {/* Cards Section */}
              <div className="flex-1">
                <div
                  className={`grid ${
                    filteredScholarships.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  } gap-8`}
                >
                  {filteredScholarships.slice(0, 6).map((scholarship) => (
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

                {/* View More Button */}
                {!isLoading && (
                  <div className="flex justify-end mt-8">
                    <button
                      className="text-blue-600 font-semibold hover:underline"
                      onClick={() => (window.location.href = "/scholars")}
                    >
                      View More &gt;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tahapan Pendaftaran Beasiswa */}
          <div className="bg-gray-100 py-16 pb-40">
            <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">
              Tahapan Pendaftaran Beasiswa
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12">
              {/* Card 1 */}
              <div className="text-center max-w-xs">
                <Image
                  src="/assets/pendaftaran.jpg"
                  alt="Langkah 1"
                  width={192}
                  height={192}
                  className="w-48 h-48 mx-auto object-cover rounded-lg"
                />
                <p className="text-xl font-bold mt-6">Langkah 1: Pendaftaran</p>
                <p className="text-md text-gray-700 mt-2">
                  Buat akun atau login ke platform kami untuk memulai proses
                  pendaftaran.
                </p>
              </div>

              {/* Card 2 */}
              <div className="text-center max-w-xs">
                <Image
                  src="/assets/pilihbeasiswa.png"
                  alt="Langkah 2"
                  width={192}
                  height={192}
                  className="w-48 h-48 mx-auto object-cover rounded-lg"
                />
                <p className="text-xl font-bold mt-6">
                  Langkah 2: Pilih Beasiswa
                </p>
                <p className="text-md text-gray-700 mt-2">
                  Jelajahi dan pilih program beasiswa yang sesuai dengan
                  kebutuhan Anda.
                </p>
              </div>

              {/* Card 3 */}
              <div className="text-center max-w-xs">
                <Image
                  src="/assets/isiformulir.jpg"
                  alt="Langkah 3"
                  width={192}
                  height={192}
                  className="w-48 h-48 mx-auto object-cover rounded-lg"
                />
                <p className="text-xl font-bold mt-6">
                  Langkah 3: Isi Formulir
                </p>
                <p className="text-md text-gray-700 mt-2">
                  Lengkapi formulir pendaftaran dengan data diri dan unggah
                  dokumen yang diperlukan.
                </p>
              </div>

              {/* Card 4 */}
              <div className="text-center max-w-xs">
                <Image
                  src="/assets/seleksi.jpg"
                  alt="Langkah 4"
                  width={192}
                  height={192}
                  className="w-48 h-48 mx-auto object-cover rounded-lg"
                />
                <p className="text-xl font-bold mt-6">Langkah 4: Seleksi</p>
                <p className="text-md text-gray-700 mt-2">
                  Tim kami akan meninjau pendaftaran Anda untuk proses seleksi
                  lebih lanjut.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
