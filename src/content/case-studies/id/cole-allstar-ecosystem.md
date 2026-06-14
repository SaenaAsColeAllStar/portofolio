---
title: "Ekosistem ColeAllStar"
excerpt: "Studi kasus terstruktur tentang membangun sistem hypervisor home-lab dan cloud yang tangguh dengan terowongan keluar, pencadangan otomatis, dan telemetri terintegrasi."
projectSlug: "cole-allstar-ecosystem"
role: "Pimpinan Arsitek Sistem & Administrator"
year: 2026
summary: "Studi kasus ini merinci penerapan lingkungan virtual aman menggunakan Proxmox VE, Docker Compose, dan Cloudflare Tunnels untuk menghosting operasi pengembangan privat."
problem: "Menghosting layanan pengembangan internal (seperti database, mesin autentikasi, pengelola skrip, dan pool cadangan) tanpa port router masuk yang terbuka, sambil menjaga penggunaan sumber daya tetap rendah, peringatan tetap aktif, dan penyimpangan konfigurasi diminimalkan."
requirements:
  - "Mengatur 12+ lingkungan aplikasi yang terisolasi."
  - "Terapkan kebijakan MFA dan zero-trust untuk semua administrasi layanan masuk."
  - "Terapkan pencadangan otomatis mandiri ke penyimpanan cloud luar lokasi."
  - "Pantau kinerja host dan kontainer dengan dasbor Prometheus dan Grafana."
constraints:
  - "Harus berjalan pada perangkat keras bare-metal tingkat konsumen berdaya rendah."
  - "Harus mencapai ketersediaan tinggi tanpa langganan hypervisor perusahaan berbayar."
  - "Interval pencadangan tidak boleh mengganggu lalu lintas jaringan rumah tangga."
architecture: "Hypervisor Proxmox VE bare-metal yang menjalankan mesin virtual Debian Linux terpisah untuk komputasi dan runtime kontainer. Aplikasi di-deploy melalui Docker Compose dengan jaringan yang dikunci ke jembatan lokal pribadi. Lalu lintas masuk ditangani oleh Cloudflare Tunnels khusus keluar yang aman dan diautentikasi melalui kebijakan SSO Google Workspace."
decisions:
  - "Memilih Proxmox VE daripada ESXi karena fleksibilitas sumber terbuka dan operasi KVM yang ringan."
  - "Menggunakan Cloudflare Tunnels untuk melewati CGNAT dan menghindari pembukaan port apa pun di router."
  - "Memisahkan database ke dalam VM khusus untuk mengisolasi hambatan IO penyimpanan dari kontainer lain."
results:
  - "Berhasil mengonsolidasikan 12 layanan terpisah menjadi satu node terkelola."
  - "Mengurangi area serangan keamanan menjadi nol port masuk IPv4/IPv6 yang terbuka."
  - "Pencadangan inkremental harian otomatis dengan peringatan Telegram/Discord tentang statusnya."
metrics:
  "Ketersediaan Layanan Privat": "99.98%"
  "Port Terbuka Masuk": 0
  "Waktu Pemulihan VM": "15 Menit"
  "Tingkat Kegagalan Cadangan": "0%"
lessons:
  - "Terowongan keluar sangat tangguh untuk melewati CGNAT dan memastikan DNS dinamis tidak relevan."
  - "Infrastruktur sebagai Kode (file Docker dan spesifikasi compose di git) sangat penting untuk membuat ulang node dari awal."
---

## Ikhtisar

Ekosistem ColeAllStar adalah platform infrastruktur home-lab dan cloud terpadu yang dirancang untuk menghosting aplikasi penting, mengotomatiskan proses pengembangan, menjalankan skrip berulang, dan mengelola telemetri server. Ini bertindak sebagai hub backend inti untuk proyek pribadi dan operasi pengujian SaenaAsColeAllStar.

## Masalah

Mengelola beberapa server perangkat lunak yang berbeda di berbagai perangkat fisik dan server privat virtual menciptakan gesekan pemeliharaan yang signifikan. Utilitas inti (like brankas data aman, API pengujian, mesin pencari, dan tugas cron) tersebar di mesin yang terpisah. Membuka port pada router rumah untuk mengekspos utilitas ini menghadirkan kerentanan keamanan yang serius, dan pencadangan dipicu secara manual dan rentan terhadap korupsi data secara diam-diam.

## Persyaratan

1. **Konsolidasi Layanan**: Mengintegrasikan semua aplikasi privat ke host virtualisasi pusat.
2. **Nol Port Masuk**: Mengizinkan akses jarak jauh tanpa mengekspos alamat IP rumah atau mengonfigurasi DNS dinamis.
3. **Pemulihan Bencana Otomatis**: Menjalankan pencadangan harian otomatis dengan verifikasi status dan retensi cloud jarak jauh.
4. **Pemberitahuan Aktif**: Mengumpulkan statistik kinerja node dan kontainer dan memicu peringatan real-time saat terjadi anomali memori tinggi atau beban disk.

## Arsitektur

Kami membangun arsitektur virtualisasi multi-layer:
- **Lapisan Hypervisor**: Instalasi bare-metal Proxmox VE (Virtual Environment) mengelola sumber daya perangkat keras.
- **Lapisan Komputasi**: Instans Debian VM yang terisolasi menjalankan mesin kontainer (Docker dan Docker Compose) untuk merangkum kode layanan mikro.
- **Lapisan Jaringan Aman**: Cloudflare Tunnels menjalankan daemon lokal yang membuat koneksi keluar TCP ke node edge Cloudflare terdekat. Pengunjung mengakses layanan via nama host publik yang diautentikasi melalui kebijakan akses Zero Trust.
- **Lapisan Observabilitas**: Instans Prometheus mengambil data metrik dari eksportir sumber daya (Node Exporter, Cadvisor) dan menampilkan metrik di dasbor Grafana.

## Implementasi

Sistem ini didefinisikan menggunakan konfigurasi deklaratif:
1. **Orkestrasi Host**: Mesin virtual dibuat dengan alokasi CPU/RAM khusus dan batas disk di Proxmox.
2. **Komposisi Kontainer**: Layanan dikonfigurasi melalui file `docker-compose.yml`, menggunakan file lingkungan dan volume bernama.
3. **Pencadangan Otomatis**: Skrip cron memicu operasi pencadangan `restic` setiap hari, mengenkripsi blok data sebelum mengirimkannya ke vault cloud yang kompatibel dengan S3.
4. **Kontrol Akses**: Kebijakan Cloudflare Access membatasi akses domain ke alamat email yang diverifikasi, meminta PIN satu kali (OTP) atau validasi OAuth.

## Tantangan

- **Carrier-Grade NAT (CGNAT)**: Jaringan ISP menggunakan CGNAT, membuat penerusan port tradisional tidak mungkin dilakukan. Menerapkan Cloudflare Tunnels khusus keluar sepenuhnya menyelesaikan masalah ini, memungkinkan pemetaan sub-domain yang bersih tanpa perubahan perutean.
- **Kegagalan Disk Diam-diam**: SSD kelas konsumen di home-lab dapat gagal secara diam-diam karena keausan tulis. Kami mengonfigurasi daemon pemantauan S.M.A.R.T. yang memicu peringatan instan saat alokasi blok drive mulai menurun, mendorong penggantian perangkat keras secara proaktif.

## Dampak & Hasil

- **Skala**: Mengonsolidasikan **12 aplikasi aktif** di bawah satu dasbor hypervisor terpusat.
- **Uptime**: Mencapai **99,98% ketersediaan layanan privat** selama jendela evaluasi 12 bulan.
- **Keamanan**: Menutup semua **port router masuk**, memindahkan seluruh perlindungan perimeter ke CDN edge Cloudflare.

## Pelajaran yang Dipetik

- **Memisahkan Penyimpanan dan Komputasi**: Memisahkan database dari runtime aplikasi stateless lainnya mencegah pelambatan kontainer dan kelaparan IO disk.
- **Selalu Enkripsi Pencadangan**: Cadangan yang disimpan di penyedia cloud pihak ketiga harus dienkripsi di sisi klien sebelum ditransfer, menjaga privasi data jika terjadi pelanggaran keamanan penyedia.

## Peningkatan Masa Depan

- **Infrastruktur sebagai Kode**: Memigrasikan VM dan penyiapan kontainer ke Terraform atau playbook Ansible untuk otomatisasi berbasis repositori yang lengkap.
- **Migrasi Kubernetes Lokal**: Mentransisikan file Docker Compose ke kluster K3s ringan untuk menguji failover ketersediaan tinggi.
