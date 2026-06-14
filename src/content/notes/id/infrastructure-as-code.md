---
title: "Penguncian State Terraform & Dry-run CI/CD yang Tangguh"
excerpt: "Catatan pemecahan masalah praktis tentang menghindari kerusakan state selama alur kerja GitHub Actions berjalan bersamaan."
category: "Catatan Infrastruktur"
tags: ["Terraform", "AWS", "GitHub Actions"]
publishedAt: "2026-01-15"
---

# Penguncian State Terraform & Dry-run CI/CD yang Tangguh

Mengelola status (state) infrastruktur dalam pipeline otomatis (seperti GitHub Actions) menimbulkan risiko serius: kolisi state. Jika dua pengembang melakukan merge cabang secara bersamaan, dua alur kerja deployment mungkin berjalan sekaligus, mengakibatkan kerusakan pada file state.

## Masalah: Kolisi Run

Dalam deployment infrastruktur awal kami, dua runner GitHub Actions menjalankan `terraform apply` secara bersamaan. Hal ini menyebabkan penimpaan sumber daya dan merusak sebagian file state S3 jarak jauh, yang memerlukan pemulihan state secara manual.

## Solusi: Penguncian State & Rencana Dinamis

Kami menyusun ulang alur kerja IaC untuk memasukkan fitur penguncian dan dry-run terisolasi:

1. **Penguncian State**: Mengonfigurasi penguncian state DynamoDB di dalam blok backend S3 Terraform. Ini segera menolak proses apply sekunder dengan pengecualian `ResourceInUse`, melindungi integritas file state.
2. **Dry-run Dinamis (`terraform plan`)**: Mengintegrasikan pemeriksaan pull request yang mengeluarkan file plan secara lokal. Runner menggunakan file plan tersebut secara langsung selama langkah apply:
   ```bash
   terraform plan -out=tfplan
   terraform apply tfplan
   ```
3. **Keamanan Eksekusi**: Menerapkan blokir konkurensi alur kerja menggunakan grup `concurrency` GitHub berdasarkan per-lingkungan (environment).
