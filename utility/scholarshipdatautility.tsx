const monthsIndo = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Parsing dari format DD-MM-YYYY ke objek Date
export function parseCustomDate(dateString: string) {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Bulan dikurangi 1 karena indeks bulan mulai dari 0
}

// Format objek Date menjadi "20 November 2024"
export function formatCustomDate(dateString: string) {
  const date = parseCustomDate(dateString);
  const day = date.getDate();
  const month = monthsIndo[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Cek status beasiswa apakah Active atau Inactive
export function getScholarshipStatus(
  tanggal_mulai: string,
  tanggal_akhir: string
): string {
  const today = new Date();
  const start = parseCustomDate(tanggal_mulai);
  const end = parseCustomDate(tanggal_akhir);

  return today >= start && today <= end ? "Open" : "Closed";
}

// Filter beasiswa berdasarkan status (Active atau Inactive)
export function filterScholarshipsByStatus(
  scholarships: Array<{
    tanggal_mulai: string;
    tanggal_akhir: string;
  }>,
  status: "Open" | "Closed"
) {
  return scholarships.filter((scholarship) => {
    const currentStatus = getScholarshipStatus(
      scholarship.tanggal_mulai,
      scholarship.tanggal_akhir
    );
    return currentStatus === status;
  });
}

// Urutkan beasiswa berdasarkan tanggal (asc atau desc)
export function sortScholarshipsByDate(
  scholarships: Array<{
    tanggal_mulai: string;
    tanggal_akhir: string;
  }>,
  sortBy: "tanggal_mulai" | "tanggal_akhir",
  order: "asc" | "desc" = "asc"
) {
  return scholarships.sort((a, b) => {
    const dateA = parseCustomDate(a[sortBy]);
    const dateB = parseCustomDate(b[sortBy]);

    if (order === "asc") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
}
