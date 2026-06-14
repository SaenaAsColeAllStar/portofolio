---
title: "Edge Caching & Koordinasi Status Basis Data"
excerpt: "Wawasan praktis tentang mengoordinasikan runtime serverless stateless dengan basis data relasional terpusat."
category: "Catatan Cloudflare"
tags: ["Edge Computing", "PostgreSQL", "Cloudflare Hyperdrive"]
publishedAt: "2026-02-10"
---

# Edge Caching & Koordinasi Status Basis Data

Saat membangun sistem dengan konkurensi tinggi menggunakan runtime edge serverless (seperti Cloudflare Workers), pengembang sering kali menghadapi "hambatan koneksi DB stateless." Karena runtime edge berskala secara horizontal dengan memunculkan ratusan sandbox terisolasi, basis data relasional tradisional (seperti PostgreSQL) dengan cepat kehabisan slot koneksi yang tersedia.

## Skenario Dunia Nyata

Selama blok ujian tengah semester untuk **Ekosistem SMK Teknovo**, lebih dari 1.000 siswa mengakses mesin ujian berbasis komputer (CBT) pada detik yang sama. Pool koneksi PostgreSQL bawaan sebesar 100 habis dalam waktu kurang dari 3 detik, memunculkan galat `500 Internal Server Error` karena batas waktu koneksi basis data habis.

## Solusi: Pooling Edge-native

Untuk menyelesaikan masalah ini tanpa menyediakan server basis data yang sangat besar, kami mengarahkan semua operasi basis data melalui **Cloudflare Hyperdrive**. 

Hyperdrive bertindak sebagai pooler koneksi yang mengenali edge. Ini menjaga pool koneksi tetap hangat di dekat worker edge, menggunakan kembali koneksi di berbagai worker.

### Dampak Arsitektur

1. **Pengurangan Latensi**: Waktu penyiapan koneksi turun dari **250ms menjadi di bawah 40ms**.
2. **Kestabilan Sumber Daya**: Jumlah koneksi basis data stabil di bawah **35 koneksi aktif bersamaan**, bahkan di bawah beban 1.000+ siswa.
3. **Catatan Penting**: Jabat tangan (handshake) koneksi adalah penurunan kinerja utama dalam serverless. Jaga agar koneksi tetap hangat di tingkat edge.
