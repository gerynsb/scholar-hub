"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import Head from "next/head";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import StatusSkeletonLoader from "@/components/Loader/statusLoader";

type RegistrationData = {
  id: string; // Registration ID (subcollection)
  scholarshipId: string; // Parent collection ID
  nama: string;
  nim: string;
  email: string;
  program_studi: string;
  semester: number;
  nama_beasiswa: string;
  tanggal_pendaftaran: string;
  status: string;
  catatan_admin: string;
};

export default function StatusPage() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const db = getFirestore();
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch registrations from Firestore
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!userEmail) return;

      setIsLoading(true);
      const registrationsList: RegistrationData[] = [];
      try {
        const scholarshipsRef = collection(db, "scholarship");
        const snapshot = await getDocs(scholarshipsRef);

        for (const doc of snapshot.docs) {
          const scholarshipId = doc.id; // ID of scholarship
          const subcollectionRef = collection(
            db,
            "scholarship",
            scholarshipId,
            "pendaftaran_beasiswa"
          );

          const registrationsQuery = query(
            subcollectionRef,
            where("email", "==", userEmail)
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);

          registrationsSnapshot.forEach((regDoc) => {
            const data = regDoc.data() as RegistrationData;
            registrationsList.push({
              ...data,
              id: regDoc.id, // ID of pendaftaran_beasiswa
              scholarshipId, // Parent scholarship ID
            });
          });
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setRegistrations(registrationsList);
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [userEmail, db]);

  // Fungsi untuk mendapatkan ikon berdasarkan status
  const getBadgeIcon = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "disetujui" || lowerStatus === "approved")
      return {
        icon: <CheckCircleIcon className="h-10 w-10 text-green-500" />,
        tooltip: "Approved",
      };
    if (lowerStatus === "ditolak" || lowerStatus === "rejected")
      return {
        icon: <XCircleIcon className="h-10 w-10 text-red-500" />,
        tooltip: "Rejected",
      };
    if (lowerStatus.includes("menunggu"))
      return {
        icon: <ClockIcon className="h-10 w-10 text-yellow-500" />,
        tooltip: "Pending",
      };
    return {
      icon: <QuestionMarkCircleIcon className="h-10 w-10 text-gray-500" />,
        tooltip: "Unknown",
      };
  };

  // Fungsi navigasi ke halaman detail
  const handleViewDetails = (scholarshipId: string, registrationId: string) => {
    if (scholarshipId && registrationId) {
      router.push(`/status/${scholarshipId}/${registrationId}`); // Navigasi dengan dua parameter
    } else {
      console.error("Invalid IDs for navigation");
    }
  };

  if (isLoading) {
    return <StatusSkeletonLoader itemCount={6} layout="grid" />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-3xl mt-10">
      <Head>
        <title>My Submitted Scholarships</title>
      </Head>

      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        My Submitted Scholarships
      </h1>

      {registrations.length === 0 ? (
        <p className="text-lg text-center text-gray-500">
          You have not registered for any scholarships yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrations.map((registration) => {
            const badge = getBadgeIcon(registration.status);
            return (
              <div
                key={`${registration.scholarshipId}-${registration.id}`}
                className="relative border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white"
              >
                <div className="absolute top-4 right-4">{badge.icon}</div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {registration.nama_beasiswa}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Registered on:</span>{" "}
                  {registration.tanggal_pendaftaran}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="font-semibold text-gray-700">
                    {registration.status}
                  </span>
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      handleViewDetails(
                        registration.scholarshipId,
                        registration.id
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-[#143F6B] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}