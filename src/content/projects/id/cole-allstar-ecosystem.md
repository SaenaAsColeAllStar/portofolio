---
title: "Ekosistem ColeAllStar"
excerpt: "Platform infrastruktur home-lab dan cloud terintegrasi yang mengatur alat mandiri, otomatisasi CI/CD, dan terowongan edge-native yang aman."
category: "Infrastruktur & Otomatisasi"
domains:
  - Infrastruktur
  - Otomatisasi
  - Arsitektur Sistem
role: "Arsitek Sistem & Administrator"
stack:
  - Proxmox VE
  - Docker
  - Linux (Debian)
  - GitHub Actions
  - Cloudflare Tunnel
  - Prometheus
  - Grafana
year: 2026
status: "live"
featured: true
impact: "Mengonsolidasikan 12 microservices privat di bawah kerangka kerja terowongan Edge yang aman dengan ketersediaan layanan 99,98%."
repoUrl: "https://github.com/SaenaAsColeAllStar/portofolio"
demoUrl: "https://ctos.web.id"
caseStudySlug: "cole-allstar-ecosystem"
---

### Ringkasan
Ekosistem ColeAllStar adalah lingkungan home-lab privat dan orkestrasi cloud yang dirancang untuk menghosting aplikasi penting, mengotomatiskan tugas pengembang yang berulang, menjalankan tugas pencarian latar belakang, dan mengelola telemetri layanan terdistribusi.

### Masalah
Mengatur aplikasi pribadi (seperti brankas kata sandi, pool cadangan, penyelesai DNS lokal, dan server pengembangan) di beberapa komputer rumah dan instans VPS cloud menyebabkan beban administratif yang tinggi. Menjaga port tetap terbuka ke internet publik mengundang pemindaian kerentanan berbahaya, sementara pencadangan ditangani secara manual dan gagal secara diam-diam.

### Solusi
Virtualitas didirikan dengan menerapkan hypervisor Proxmox VE yang menjalankan instans Debian VM dan runtime Docker. Alih-alih membuka port masuk publik, koneksi keluar pribadi dirutekan melalui Cloudflare Tunnels yang diamankan oleh aturan Cloudflare Access MFA. Pipeline pencadangan shell otomatis dibuat untuk mengambil snapshot data setiap hari ke penyimpanan objek terdesentralisasi. Tumpukan telemetri pusat mengumpulkan metrik sistem dan memperingatkan anomali pemanfaatan server.

### Teknologi
- **Hypervisor & Kontainer**: Proxmox VE, KVM, Docker Compose
- **Perutean Jaringan**: Cloudflare Tunnels, Pi-hole (DNS Lokal)
- **CI/CD & Penyediaan**: GitHub Actions, Scripting Bash
- **Telemetri**: Prometheus, Grafana, Node Exporter

### Dampak & Hasil
- Mengamankan **12 aplikasi privat** di balik single-sign-on MFA, menghilangkan semua port masuk terbuka pada router.
- Mengotomatiskan pencadangan inkremental harian dengan **peringatan Discord instan** setelah selesai atau terjadi kesalahan.
- Mencapai **99,98% uptime layanan** pada layanan hypervisor inti selama jendela evaluasi 12 bulan.

### Pelajaran yang Dipetik
- Memisahkan host virtualisasi dari instans runtime kontainer mencegah kegagalan konfigurasi pada satu titik.
- Penerowongan khusus keluar (outbound-only) menghilangkan seluruh kelas kerentanan intrusi jaringan tepi, menjadikannya standar pilihan untuk pengaturan infrastruktur privat.
