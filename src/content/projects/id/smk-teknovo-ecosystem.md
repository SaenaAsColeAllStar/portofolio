---
title: "Ekosistem SMK Teknovo"
excerpt: "Merancang dan mengintegrasikan ekosistem pendidikan lengkap yang menghubungkan operasional pembelajaran, ujian CBT, dan infrastruktur edge."
category: "Pendidikan & Teknologi"
domains:
  - Infrastruktur
  - Otomatisasi
  - Rekayasa Produk
  - Arsitektur Sistem
role: "Pimpinan Arsitek Sistem & Insinyur Produk"
stack:
  - Astro
  - Cloudflare Workers
  - PostgreSQL
  - GitHub Actions
year: 2026
status: "live"
featured: true
impact: "Menghubungkan 8 modul terpisah di bawah portal RBAC terpadu yang melayani lebih dari 1.000 siswa aktif."
caseStudySlug: "smk-teknovo-ecosystem"
---

### Ringkasan
Ekosistem SMK Teknovo adalah platform pendidikan komprehensif yang mengintegrasikan kehadiran web publik, sistem manajemen pembelajaran (LMS) khusus, ujian berbasis komputer (CBT), katalog perpustakaan elektronik (E-Library), dan alat administratif ke dalam satu sistem terpadu.

### Masalah
Peralatan digital sekolah sangat terfragmentasi. Situs web publik, LMS, CBT, dan katalog perpustakaan beroperasi sebagai paket perangkat lunak mandiri pada paket shared hosting terpisah. Selama periode ujian tengah semester, sistem CBT sering kali crash di bawah beban, dan guru harus menyinkronkan nilai secara manual melalui spreadsheet Excel, yang menimbulkan penundaan administratif dan risiko keamanan data.

### Solusi
Merancang arsitektur edge-first yang longgar (loosely-coupled). Konten publik bersifat statis-pertama, didukung oleh Astro dan di-cache pada CDN Cloudflare. Antarmuka operasional (CBT dan LMS) berjalan pada runtime edge Cloudflare Workers, berkomunikasi dengan database PostgreSQL pusat melalui terowongan Hyperdrive dengan pooling koneksi. Mengimplementasikan manajer sesi token JWT/HMAC khusus untuk menerapkan Kontrol Akses Berbasis Peran (RBAC) dengan aman di batas jaringan.

### Teknologi
- **Platform Inti**: Astro Framework, HTML5, Vanilla CSS
- **Lapisan Edge**: Cloudflare Workers, Cloudflare Pages
- **Database & Pooling**: PostgreSQL, Drizzle ORM, Cloudflare Hyperdrive
- **CI/CD & Shell**: GitHub Actions, Scripting Bash, integrasi SSH

### Dampak & Hasil
- Berhasil menyatukan **8 modul terpisah** (Situs Web, LMS, CBT, E-Learning, E-Library, Portal Admin RBAC, Manajemen Konten, Telemetri Infrastruktur) ke dalam satu domain.
- Melayani **1.000+ permintaan ujian siswa secara bersamaan** dengan nol downtime selama blok stres ujian tengah semester.
- Mengurangi latensi koneksi database dari **250ms menjadi kurang dari 40ms** menggunakan pooling edge melalui Hyperdrive.

### Pelajaran yang Dipetik
- Memisahkan halaman informasi statis dari layanan operasional dengan throughput tinggi (seperti CBT) mencegah penyebaran beban server dan menjamin uptime.
- Pooling koneksi adalah hambatan kritis saat menggabungkan runtime edge serverless dengan database relasional, menjadikan Hyperdrive sebagai elemen penting dari desain.
