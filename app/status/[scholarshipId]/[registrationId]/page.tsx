"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import DetailSkeleton from "@/components/Loader/statusDetailLoader";

type RegistrationData = {
  alasan_mendaftar: string;
  catatan_admin: string;
  dokumen: string;
  email: string;
  nama: string;
  nama_beasiswa: string;
  nim: string;
  program_studi: string;
  registrationId: string;
  semester: string;
  status: string;
  tanggal_pendaftaran: string;
};

export default function StatusDetailPage() {
  const { scholarshipId, registrationId } = useParams(); // Tangkap parameter dynamic routing
  const [registration, setRegistration] = useState<RegistrationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore();

  useEffect(() => {
    const fetchRegistrationDetail = async () => {
      if (!scholarshipId || !registrationId) {
        setError("ID beasiswa atau pendaftaran tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(
          db,
          `scholarship/${scholarshipId}/pendaftaran_beasiswa/${registrationId}`
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRegistration(docSnap.data() as RegistrationData);
        } else {
          setError("Data pendaftaran tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal mengambil detail pendaftaran:", err);
        setError("Gagal mengambil data pendaftaran. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationDetail();
  }, [scholarshipId, registrationId, db]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-red-50 text-red-600 rounded-xl mt-10">
        <p className="text-center font-semibold">{error}</p>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-gray-100 rounded-xl mt-10">
        <p className="text-center text-gray-600">
          Data pendaftaran tidak tersedia
        </p>
      </div>
    );
  }

  

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Detail Pendaftaran Beasiswa
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Nama Beasiswa" value={registration.nama_beasiswa} />
        <DetailItem label="Nama Lengkap" value={registration.nama} />
        <DetailItem label="NIM" value={registration.nim} />
        <DetailItem label="Email" value={registration.email} />
        <DetailItem label="Program Studi" value={registration.program_studi} />
        <DetailItem label="Semester" value={registration.semester} />
        <DetailItem label="Status" value={registration.status} />
        <DetailItem
          label="Tanggal Pendaftaran"
          value={registration.tanggal_pendaftaran}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Informasi Tambahan
        </h2>
        <DetailItem
          label="Alasan Mendaftar"
          value={registration.alasan_mendaftar}
          fullWidth
        />
        <DetailItem
          label="Catatan Admin"
          value={registration.catatan_admin || "Tidak ada catatan tambahan"}
          fullWidth
        />
      </div>

      <div className="mt-6 text-center">
        <a
          href={registration.dokumen}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#143F6B] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Lihat Dokumen
        </a>
      </div>
    </div>
  );
}

// Komponen untuk menampilkan detail item
function DetailItem({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${fullWidth ? "col-span-full" : ""}`}>
      <p className="text-gray-600 font-medium">{label}</p>
      <p className="text-gray-800 font-semibold">{value}</p>
    </div>
  );
}
