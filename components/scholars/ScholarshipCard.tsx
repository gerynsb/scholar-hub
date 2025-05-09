import React from "react";
import { formatCustomDate, getScholarshipStatus } from "@/utility/scholarshipdatautility";

interface ScholarshipCardProps {
  id: string;
  nama_beasiswa: string;
  tanggal_mulai: string;
  tanggal_akhir: string;
  deskripsi: string;
  kategori: string;
  onClick: (id: string) => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  id,
  nama_beasiswa,
  tanggal_mulai,
  tanggal_akhir,
  deskripsi,
  kategori,
  onClick,
}) => {
  return (
    <div onClick={() => onClick(id)} className="card cursor-pointer">
      <h2 className="text-xl font-bold mb-2 text-black">{nama_beasiswa}</h2>
      <p className="text-black text-sm mb-4">
        {formatCustomDate(tanggal_mulai)} - {formatCustomDate(tanggal_akhir)}
      </p>
      <p className="text-black text-sm mb-4">{deskripsi.split(".")[0]}.</p>
      <div className="flex items-center space-x-2 mb-4">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            getScholarshipStatus(tanggal_mulai, tanggal_akhir) === "Open"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {getScholarshipStatus(tanggal_mulai, tanggal_akhir)}
        </span>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {kategori}
        </span>
      </div>
      <button className="text-blue-600 font-semibold hover:underline">
        Read More
      </button>
    </div>
  );
};

export default ScholarshipCard;
