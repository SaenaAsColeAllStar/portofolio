---
title: "Ekosistem SMK Teknovo"
excerpt: "Studi kasus unggulan untuk membangun ekosistem digital berorientasi pendidikan dengan penceritaan yang mengutamakan arsitektur."
projectSlug: "smk-teknovo-ecosystem"
role: "Arsitek sistem dan insinyur produk"
year: 2026
summary: "Studi kasus ini mendokumentasikan struktur yang direncanakan untuk ekosistem digital sekolah yang menggabungkan kehadiran web, operasional, otomatisasi, dan pemberdayaan teknis."
problem: "Institusi pendidikan seringkali membutuhkan kehadiran digital dan alur kerja operasional yang andal, tetapi sistem tersebut sering kali terfragmentasi di berbagai proses manual, alat yang terputus, dan kepemilikan yang tidak jelas."
requirements:
  - "Membuat kehadiran digital yang jelas bagi pemangku kepentingan sekolah."
  - "Menyajikan informasi akademik, operasional, dan komunitas secara terstruktur."
  - "Mempersiapkan peluang otomatisasi untuk tugas administratif atau komunikasi yang berulang."
  - "Menjaga platform tetap terpelihara untuk pertumbuhan konten dan fitur di masa mendatang."
constraints:
  - "MVP harus tetap cukup sederhana agar dapat dikirim dengan cepat."
  - "Arsitektur harus mendukung integrasi masa depan tanpa menjadi dasbor SaaS yang berat."
  - "Kinerja dan aksesibilitas tidak boleh dikorbankan demi efek visual."
architecture: "Halaman publik berbasis statis, content collections untuk informasi terstruktur, dan pulau interaktif selektif untuk alur kerja yang mendapat manfaat dari perilaku sisi klien."
decisions:
  - "Menggunakan pemodelan berbasis konten sebelum membangun UI yang kompleks."
  - "Memprioritaskan penceritaan studi kasus daripada daftar teknologi mentah."
  - "Menangguhkan fitur interaktif yang berat hingga narasi pembuktian menjadi jelas."
results:
  - "Kisah portofolio unggulan ditetapkan untuk Fase 1."
  - "Studi kasus dapat memperkuat kredibilitas beranda dan evaluasi perekrut/CTO."
lessons:
  - "Proyek portofolio yang kuat membutuhkan konteks, batasan, dan hasil, bukan hanya nama teknologi."
  - "Diagram arsitektur dan penjelasan trade-off harus dipersiapkan sejak dini."
---

## Gambaran Umum

Ekosistem SMK Teknovo adalah platform pendidikan komprehensif tingkat produksi yang menyatukan beberapa portal operasional digital ke dalam satu sistem edge-native yang kohesif. Sistem ini menangani informasi publik, alur kerja manajemen pembelajaran, dan ujian berbasis komputer dengan konkurensi tinggi di bawah batasan kinerja yang ketat.

## Masalah

Infrastruktur digital warisan (legacy) sekolah sangat terfragmentasi. Halaman informasi publik, sistem manajemen pembelajaran (LMS), mesin ujian berbasis komputer (CBT), dan katalog perpustakaan beroperasi sebagai paket aplikasi independen di berbagai paket shared hosting. Selama ujian tengah semester dengan lalu lintas tinggi, server CBT sering kali crash di bawah beban bersamaan. Selain itu, staf administratif harus mengekstrak nilai secara manual dan menyinkronkannya melalui spreadsheet Excel, yang menimbulkan celah keamanan dan penundaan operasional.

## Persyaratan

1. **Penyatuan Sistem**: Mengonsolidasikan 8 modul fungsional terpisah di bawah domain terpadu dengan kemampuan single-sign-on (SSO).
2. **Konkurensi Tinggi**: Mendukung hingga 1.000+ siswa aktif secara bersamaan selama ujian berlangsung tanpa kehabisan sumber daya server.
3. **Latensi Rendah**: Mengurangi waktu kueri dari server edge ke basis data utama hingga di bawah 50ms.
4. **Keamanan Granular**: Menerapkan sistem Kontrol Akses Berbasis Peran (RBAC) di batas jaringan untuk siswa, guru, orang tua, dan admin sistem.

## Arsitektur

Kami merancang arsitektur edge-first yang longgar (decoupled):
- **Lapisan Konten Statis**: Antarmuka web publik dirender secara statis menggunakan Astro dan di-cache secara global di jaringan CDN edge Cloudflare.
- **Lapisan Komputasi Serverless**: Modul operasional dengan interaksi tinggi (LMS dan CBT) berjalan pada runtime edge Cloudflare Workers.
- **Lapisan Data & Pooling**: Data disimpan dalam basis data PostgreSQL pusat. Untuk mencegah kehabisan koneksi dari runtime serverless yang stateless, semua transaksi basis data diarahkan melalui terowongan Cloudflare Hyperdrive yang melakukan pooling koneksi secara real-time di node edge.

## Implementasi

Sistem ini mengintegrasikan modul-modul berikut:
1. **Portal Web Publik**: Halaman informasi statis yang dioptimalkan untuk SEO.
2. **Modul LMS**: Pengiriman tugas dinamis, jadwal kurikulum, dan pelacak nilai.
3. **Mesin CBT**: Pemutar ujian dengan status yang disinkronkan, penyimpanan otomatis, dan ketahanan offline local-first.
4. **E-Library**: Katalog perpustakaan digital dengan fitur kueri autocomplete.
5. **Panel Admin RBAC**: Portal aman untuk pembuatan pengguna, manajemen kursus, dan pemetaan izin.
6. **Pemantau Telemetri**: Dasbor aktif yang menampilkan latensi node dan operasi basis data.

Kontrol akses diatur oleh token sesi JWT berumur pendek yang ditandatangani menggunakan HMAC-SHA256, diverifikasi di edge sebelum mengakses rute basis data inti.

## Tantangan

- **Kehabisan Koneksi Basis Data**: Menjalankan fungsi serverless pada Cloudflare Workers berarti setiap permintaan HTTP berisiko membuka koneksi Postgres baru, yang dengan cepat melampaui batas 100 koneksi basis data selama ujian siswa berlangsung. Masalah ini diselesaikan dengan mengonfigurasi Cloudflare Hyperdrive, yang menjaga pool koneksi basis data tetap hangat dan mengurangi latensi kueri DB keseluruhan dari 250ms menjadi di bawah 40ms.
- **Persistensi Status Ujian**: Siswa yang mengalami gangguan jaringan sementara selama ujian berisiko kehilangan progres jawaban mereka. Kami menerapkan sinkronisasi save-state LocalStorage di sisi klien yang secara berkala mendorong jawaban ke antrean edge saat koneksi pulih.

## Hasil

- **Skala**: Berhasil melayani **1.000+ siswa secara bersamaan** selama ujian tengah semester dengan nol downtime.
- **Kinerja**: Pemrosesan permintaan API edge diselesaikan dalam waktu kurang dari 15ms, dengan operasi basis data diselesaikan di bawah 40ms.
- **Integrasi**: Mengonsolidasikan **8 modul terpisah** ke dalam satu domain aman, menghilangkan semua sinkronisasi manual Excel.

## Pelajaran yang Dipetik

- **Pemisahan Aset Informasi dan Operasional**: Menjaga halaman informasi publik tetap statis-pertama memastikan situs web publik tetap online dan tidak terpengaruh bahkan jika mesin operasional CBT mengalami lonjakan penggunaan.
- **Pooling Serverless Sangat Penting**: Layanan mikro edge yang stateless tidak dapat berkomunikasi langsung dengan database SQL tradisional tanpa lapisan pooling koneksi yang kuat seperti Hyperdrive atau PgBouncer.

## Peningkatan di Masa Mendatang

- **Pelaksanaan Ujian Offline**: Mengompilasi mesin CBT menjadi Progressive Web App (PWA) dengan replikasi lokal SQLite untuk mendukung ujian offline penuh di cabang sekolah terpencil, menyinkronkan hasil kembali setelah koneksi internet tersedia.
- **Asisten Penilaian Berbasis AI**: Mengintegrasikan Cloudflare Workers AI dengan model Llama untuk menganalisis esai siswa dan memberikan saran penilaian draf untuk guru.
