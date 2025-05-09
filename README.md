### **Sistem Informasi Pengelolaan Beasiswa**

**Deskripsi Singkat**: Sistem ini bertujuan untuk mempermudah mahasiswa dalam mendaftar dan memantau status pendaftaran beasiswa, sekaligus membantu admin dalam mengelola data beasiswa, pendaftar, dan proses seleksi. Mahasiswa dapat melihat daftar beasiswa yang tersedia, mengajukan pendaftaran, dan memantau statusnya, sedangkan admin dapat mengelola data beasiswa dan memproses pendaftaran.

---

### **Tugas untuk Kelompok 15 (Front-end / Tampilan untuk Mahasiswa)**

#### **1. Halaman Utama**
- Menampilkan daftar beasiswa yang tersedia dengan informasi:
  - Nama beasiswa.
  - Deskripsi singkat beasiswa.
  - Tanggal pendaftaran dibuka dan ditutup.
  - Kategori beasiswa (akademik, non-akademik, dll.).
- Tambahkan fitur filter:
  - Berdasarkan kategori.
  - Berdasarkan status pendaftaran (dibuka/dicabut).
- Tampilkan daftar beasiswa dalam bentuk kartu dengan tombol "Lihat Detail."

---

#### **2. Halaman Detail Beasiswa**
- Menampilkan informasi lengkap tentang beasiswa, termasuk:
  - Nama beasiswa.
  - Deskripsi lengkap.
  - Persyaratan beasiswa.
  - Batas waktu pendaftaran.
  - Kontak pengelola.
- Tambahkan tombol "Daftar" yang mengarahkan ke halaman form pendaftaran.

---

#### **3. Halaman Form Pendaftaran Beasiswa**
- Form untuk mendaftar beasiswa dengan field berikut:
  - Nama lengkap (auto-fill jika login).
  - NIM.
  - Email.
  - Program studi.
  - Semester.
  - Alasan mendaftar (textarea opsional).
  - Upload dokumen pendukung (misalnya: KHS, surat rekomendasi).
- Validasi form:
  - Semua field wajib diisi kecuali alasan mendaftar.
  - Batas ukuran dokumen yang diunggah tidak lebih dari 2 MB.
- Simpan data pendaftaran ke Firebase Firestore di koleksi **pendaftaran_beasiswa**.
- Tambahkan notifikasi "Pendaftaran berhasil dikirim, harap menunggu konfirmasi."

---

#### **4. Halaman Status Pendaftaran**
- Menampilkan daftar pendaftaran beasiswa mahasiswa:
  - Nama beasiswa.
  - Tanggal pendaftaran.
  - Status pendaftaran (menunggu persetujuan/disetujui/ditolak).
- Jika status disetujui atau ditolak, tampilkan catatan dari admin (jika ada).

---

#### **5. Firebase Integration**
- Ambil data beasiswa dari koleksi **data_beasiswa**.
- Simpan data pendaftaran ke koleksi **pendaftaran_beasiswa**.

---

#### **6. Fitur Tambahan (Opsional)**
- Tambahkan fitur untuk mengunduh bukti pendaftaran dalam format PDF.
- Tambahkan fitur pengingat melalui email untuk batas waktu pendaftaran.

---

#### **Fitur Utama yang Harus Selesai**
1. Menampilkan daftar beasiswa dan detailnya.
2. Form pendaftaran beasiswa yang tersimpan ke Firebase.
3. Menampilkan status pendaftaran beasiswa.

---

### **Struktur Firebase Firestore untuk Data Beasiswa**
**Koleksi**: `data_beasiswa`  
**Dokumen (contoh)**:
```json
{
  "id": "001",
  "nama_beasiswa": "Beasiswa Unggulan",
  "deskripsi": "Beasiswa ini ditujukan untuk mahasiswa berprestasi.",
  "kategori": "Akademik",
  "tanggal_mulai": "2024-11-01",
  "tanggal_akhir": "2024-11-30",
  "kontak": "beasiswa@example.com"
}
```

**Koleksi**: `pendaftaran_beasiswa`  
**Dokumen (contoh)**:
```json
{
  "id": "001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "email": "aryandi@example.com",
  "program_studi": "Teknik Informatika",
  "semester": 5,
  "nama_beasiswa": "Beasiswa Unggulan",
  "tanggal_pendaftaran": "2024-11-05",
  "status": "menunggu persetujuan",
  "catatan_admin": "",
  "dokumen": "url_to_file"
}
```

---

### **Integrasi Antar Kelompok**
1. **Standar Data**:
   - Kelompok admin bertugas memastikan data beasiswa dan pendaftaran disimpan dengan format yang sesuai di Firestore.
   - Kelompok front-end bertugas menampilkan data ini kepada mahasiswa.
2. **API Firebase**:
   - Gunakan koleksi **data_beasiswa** untuk data beasiswa.
   - Gunakan koleksi **pendaftaran_beasiswa** untuk data pendaftaran.
3. **Koordinasi**:
   - Pastikan kedua kelompok sepakat pada struktur data dan alur kerja.

---

### **Estimasi Timeline (6 Minggu)**

#### **Kelompok 15: Front-end**
- **Minggu 1**: Setup repositori, install dependency, setup Firebase.
- **Minggu 2**: Membuat halaman daftar beasiswa dan detail beasiswa.
- **Minggu 3**: Membuat form pendaftaran beasiswa dan menyimpan data ke Firestore.
- **Minggu 4**: Menambahkan halaman status pendaftaran beasiswa.
- **Minggu 5**: Testing fitur utama dan debugging.
- **Minggu 6**: Dokumentasi proyek front-end.
