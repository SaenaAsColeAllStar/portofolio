# Roadmap Implementasi CTOS Portfolio Platform

Dokumen ini menerjemahkan PRD CTOS Portfolio Platform menjadi roadmap eksekusi yang lebih operasional. Fokus utamanya adalah membangun portfolio yang tidak hanya menampilkan project, tetapi membuktikan kemampuan sebagai **Digital Systems Architect** melalui narasi, case study, arsitektur sistem, performa, aksesibilitas, dan pengalaman visual yang premium.

Roadmap ini disusun untuk stack **Astro + Vue + TypeScript + Tailwind CSS + MDX/Astro Content Collections**, dengan prinsip utama: content first, performance first, island architecture, progressive enhancement, accessibility first, dan motion without performance debt.

---

## 1. Tujuan Strategis

### 1.1 Sasaran Produk

CTOS Portfolio Platform harus menjadi pusat identitas profesional yang mampu menjawab lima pertanyaan utama dalam 10-15 detik pertama:

1. Siapa pemilik portfolio ini?
2. Apa keahlian utamanya?
3. Apa pembeda dibanding portfolio developer biasa?
4. Bukti konkret apa yang mendukung klaim tersebut?
5. Bagaimana cara menghubungi atau mengevaluasi lebih lanjut?

### 1.2 Positioning Utama

**Digital Systems Architect**

Narasi pendukung:

> Bridging Infrastructure, AI, and Product Engineering.
>
> Designing reliable digital systems through architecture, automation, and AI-powered workflows.

### 1.3 Prioritas Bisnis / Personal Branding

Urutan prioritas yang disarankan:

1. Menghasilkan peluang profesional: kerja, kontrak, kolaborasi, atau konsultasi.
2. Membangun kredibilitas teknis melalui case study dan arsitektur sistem.
3. Membedakan diri dari portfolio developer template.
4. Menjadi knowledge hub teknis jangka panjang.
5. Membangun aset personal brand yang mudah dikembangkan.

---

## 2. Prinsip Roadmap

### 2.1 Recruiter-First, Technical-Depth Second

Homepage harus cepat dipahami oleh recruiter dan hiring manager, tetapi tetap menyediakan jalur eksplorasi lebih dalam untuk CTO, engineering lead, founder, dan engineer teknis.

### 2.2 Proof Before Decoration

Setiap efek visual, animasi, diagram, dan micro-interaction harus mendukung pemahaman. Jika tidak membantu menjelaskan kemampuan, fitur tersebut harus ditunda.

### 2.3 Static First, Interactive Where It Matters

Sebagian besar halaman harus statis dan cepat. Interaktivitas hanya diberikan pada area bernilai tinggi seperti hero system visualization, project filtering, command palette, certificate viewer, dan contact flow.

### 2.4 Content Is the Product

Kekuatan portfolio ini bukan hanya layout, tetapi isi: project, case study, technical notes, certificates, dan resume. Roadmap implementasi harus selalu berjalan paralel dengan roadmap konten.

### 2.5 Progressive Premium

Pengalaman premium dibangun bertahap. MVP harus sudah rapi dan credible, tetapi fitur seperti visitor globe, command palette, dan certificate vault dapat masuk pada fase lanjutan.

---

## 3. Persona dan User Journey

### 3.1 Recruiter / Hiring Manager

**Kebutuhan utama:**

- Memahami role dan positioning dengan cepat.
- Melihat ringkasan skill dan pengalaman.
- Mengakses resume dalam 1 klik.
- Melihat bukti project tanpa harus membaca terlalu panjang.
- Menghubungi dengan mudah.

**Journey ideal:**

1. Masuk homepage.
2. Membaca hero dan positioning.
3. Melihat proof snapshot.
4. Membuka featured case study atau resume.
5. Mengecek selected projects.
6. Contact melalui email, LinkedIn, atau form.

**Acceptance criteria:**

- CTA resume terlihat di atas fold atau di navigation.
- Contact dapat dicapai maksimal 1 klik dari homepage.
- Project unggulan dapat ditemukan maksimal 2 klik.
- Copywriting hero tidak terlalu teknis.

### 3.2 CTO / Engineering Lead

**Kebutuhan utama:**

- Memahami cara berpikir arsitektur.
- Melihat trade-off dan keputusan teknis.
- Mengevaluasi kualitas engineering.
- Melihat system design, reliability, automation, dan AI workflow.

**Journey ideal:**

1. Masuk homepage.
2. Membuka architecture/system overview.
3. Membaca case study unggulan.
4. Melihat technical notes.
5. Membuka GitHub atau contact.

**Acceptance criteria:**

- Minimal 1 case study memiliki diagram arsitektur.
- Case study menjelaskan problem, constraints, decisions, implementation, result, dan lessons learned.
- Project tidak hanya berisi stack, tetapi juga role dan impact.

### 3.3 Startup Founder / Client

**Kebutuhan utama:**

- Mengetahui apakah pemilik portfolio dapat menyelesaikan masalah nyata.
- Melihat hasil, bukan hanya teknologi.
- Menghubungi dengan mudah untuk diskusi.

**Journey ideal:**

1. Masuk homepage.
2. Melihat problem yang dapat diselesaikan.
3. Membuka featured projects.
4. Membaca hasil dan impact.
5. Contact.

**Acceptance criteria:**

- Copywriting menekankan reliability, automation, delivery, dan problem solving.
- Contact section memiliki CTA yang jelas.
- Project cards memiliki impact statement singkat.

### 3.4 Developer / Technical Community

**Kebutuhan utama:**

- Belajar dari notes dan case study.
- Melihat pendekatan teknis.
- Menemukan GitHub atau referensi implementasi.

**Journey ideal:**

1. Masuk homepage atau notes.
2. Membuka technical notes.
3. Membaca case study.
4. Membuka GitHub.

**Acceptance criteria:**

- Notes memiliki tag dan kategori.
- Case study memiliki struktur yang konsisten.
- Link GitHub tersedia bila relevan.

---

## 4. Fase Roadmap

## Phase 0 — Product Alignment dan Foundation

**Tujuan:** menyepakati arah produk, scope MVP, struktur konten, dan fondasi teknis sebelum membangun fitur visual kompleks.

### 4.1 Deliverables

- Final positioning statement.
- Final homepage narrative.
- Sitemap final.
- MVP scope.
- Content inventory awal.
- Design token awal.
- Technical architecture baseline.

### 4.2 Task Detail

#### Product Strategy

- Finalisasi positioning: `Digital Systems Architect` atau variasi lain yang lebih recruiter-friendly.
- Tentukan CTA utama: `View Case Studies`, `Download Resume`, atau `Contact Me`.
- Tentukan bahasa utama: English-first, Indonesian-first, atau bilingual bertahap.
- Tentukan audience priority: recruiter, CTO, founder, developer.

#### Content Planning

- Daftar semua project yang akan ditampilkan.
- Pilih 1 flagship case study.
- Pilih 3-6 selected projects untuk homepage.
- Kumpulkan data resume.
- Kumpulkan certificate.
- Tentukan 3-5 notes awal bila technical notes masuk MVP.

#### Technical Baseline

- Audit struktur Astro saat ini.
- Tentukan target struktur folder sesuai PRD.
- Setup TypeScript strictness bila belum.
- Setup linting/formatting bila diperlukan.
- Siapkan content collections schema.
- Tentukan strategi asset image dan SVG.

### 4.3 Acceptance Criteria

- Ada daftar fitur MVP dan non-MVP.
- Ada daftar konten yang harus disiapkan sebelum launch.
- Ada skema awal untuk projects, case studies, notes, dan certificates.
- Ada definisi CTA utama dan sekunder.

### 4.4 Risiko

- Scope terlalu besar sebelum positioning matang.
- Konten belum siap sehingga UI menjadi kosong.
- Terlalu cepat fokus pada animasi sebelum narasi jelas.

---

## Phase 1 — MVP Portfolio Core

**Tujuan:** merilis versi awal yang sudah credible, cepat, responsive, dan mampu menghasilkan peluang profesional.

### 5.1 Halaman MVP

1. Home
2. Projects
3. Case Studies
4. Resume
5. Contact
6. 404
7. Privacy sederhana bila menggunakan analytics/form

### 5.2 Homepage Structure

#### Section 01 — Hero

**Konten:**

- Eyebrow: `Digital Systems Architect`
- Headline: `Bridging Infrastructure, AI, and Product Engineering.`
- Subheadline yang lebih operasional.
- Primary CTA: `View Case Studies`
- Secondary CTA: `Download Resume` atau `Contact`
- Visual: simplified system map / SVG network

**Acceptance criteria:**

- Positioning dipahami dalam 10-15 detik.
- CTA utama terlihat tanpa scroll pada desktop.
- Hero tetap ringan di mobile.
- Hero tidak bergantung pada animasi untuk dipahami.

#### Section 02 — Proof Snapshot

**Konten:**

- 3-4 highlight metrik atau bukti.
- Contoh: `Infrastructure`, `Automation`, `AI Workflows`, `Product Engineering`.
- Bisa berupa cards singkat.

**Acceptance criteria:**

- Setiap proof memiliki label dan deskripsi pendek.
- Tidak memakai angka palsu; gunakan angka hanya jika valid.

#### Section 03 — Featured Case Study

**Konten:**

- SMK Teknovo Ecosystem atau project paling kuat.
- Problem summary.
- Architecture summary.
- Result/impact.
- CTA ke full case study.

**Acceptance criteria:**

- Case study bukan hanya deskripsi project.
- Ada problem dan outcome.
- CTA jelas.

#### Section 04 — Capability Matrix

**Kategori:**

- Infrastructure
- Automation
- AI Workflows
- Product Engineering
- System Architecture
- Cloud/Self-hosting

**Acceptance criteria:**

- Tidak menjadi daftar skill mentah.
- Setiap capability terhubung ke project atau case study.

#### Section 05 — Selected Projects

**Konten:**

- 3-6 project terbaik.
- Category, role, stack, impact.
- Link ke detail.

**Acceptance criteria:**

- Project card dapat dipahami dalam 5 detik.
- Card menampilkan value, bukan hanya teknologi.

#### Section 06 — Resume Preview

**Konten:**

- Summary profile.
- Key skills.
- Download resume.
- Link ke full resume page.

**Acceptance criteria:**

- Resume download mudah ditemukan.
- Informasi tidak terlalu panjang.

#### Section 07 — Contact CTA

**Konten:**

- Email.
- LinkedIn.
- GitHub.
- Optional contact form.

**Acceptance criteria:**

- Contact method dapat digunakan tanpa hambatan.
- Email/link valid.

### 5.3 Projects Page

**Fitur MVP:**

- Grid project.
- Category tags.
- Basic filtering bila cepat diimplementasikan.
- Search dapat ditunda jika konten masih sedikit.

**Project card fields:**

- Title
- Excerpt
- Category
- Role
- Stack
- Impact
- Links

**Acceptance criteria:**

- Semua project dapat dibuka dari card.
- Project penting bisa ditemukan maksimal 2 klik.
- Layout mobile nyaman dibaca.

### 5.4 Case Studies Page

**Fitur MVP:**

- Listing case studies.
- Detail case study berbasis MDX.
- Template konsisten.

**Template case study:**

1. Overview
2. Problem statement
3. Role and context
4. Requirements
5. Architecture
6. Technology decisions
7. Implementation
8. Challenges
9. Results
10. Lessons learned
11. Future improvements

**Acceptance criteria:**

- Minimal 1 case study lengkap sebelum launch.
- Case study readable di mobile.
- Heading hierarchy rapi.

### 5.5 Resume Page

**Fitur MVP:**

- Profile summary.
- Skills grouped by domain.
- Projects/experience highlight.
- Education/certificates summary.
- Download PDF.

**Acceptance criteria:**

- Bisa dicetak/download.
- Recruiter dapat menemukan skill utama dengan cepat.

### 5.6 Contact Page

**Fitur MVP:**

- Email direct link.
- LinkedIn.
- GitHub.
- Contact form optional.

**Acceptance criteria:**

- Jika form aktif, harus ada spam protection minimal.
- Jika form belum siap, email dan LinkedIn harus cukup prominent.

### 5.7 Technical Tasks Phase 1

- Refactor struktur folder menuju `components`, `layouts`, `content`, `data`, `styles`, dan `utils`.
- Buat global layout.
- Buat navigation responsive.
- Buat design tokens awal.
- Buat content collections untuk project dan case study.
- Buat komponen card reusable.
- Buat SEO component.
- Buat sitemap dan metadata dasar.
- Implement reduced motion support.

### 5.8 Phase 1 Definition of Done

- Semua halaman MVP tersedia.
- Lighthouse Performance minimal 90 pada homepage dalam kondisi production build.
- Tidak ada broken internal link utama.
- Mobile layout valid untuk viewport umum.
- CTA resume dan contact jelas.
- Minimal satu case study lengkap.

---

## Phase 2 — Credibility Layer dan Content System

**Tujuan:** memperkuat portfolio dengan konten teknis, certificates, filtering, dan struktur data yang matang.

### 6.1 Fitur Utama

1. Certificate Vault basic
2. Technical Notes
3. Advanced project filtering
4. Case study improvements
5. Structured data/SEO enhancement
6. Open Graph image strategy

### 6.2 Certificate Vault

**MVP Phase 2:**

- Listing certificate.
- Filter by issuer/skill/category.
- Detail/preview certificate.
- Credential URL bila tersedia.

**Advanced later:**

- Animated folder system.
- Fullscreen viewer.
- Search.
- Tagging interaktif.

**Acceptance criteria:**

- Certificate mudah diverifikasi.
- Certificate tidak mendominasi homepage.
- Viewer accessible dengan keyboard.

### 6.3 Technical Notes

**Tujuan:** menjadi knowledge base, bukan blog tradisional.

**Kategori awal:**

- Infrastructure
- AI Workflows
- Cloudflare
- Automation
- Troubleshooting
- Lessons Learned

**Acceptance criteria:**

- Notes memakai tag dan kategori.
- Notes memiliki excerpt.
- Notes tidak mengganggu fokus portfolio utama.

### 6.4 Advanced Filtering

**Untuk Projects:**

- Filter by category.
- Filter by stack.
- Filter by domain: infrastructure, AI, automation, product.
- Search by title/excerpt.

**Untuk Notes:**

- Filter by category/tag.
- Search title/excerpt.

**Acceptance criteria:**

- Filtering bekerja tanpa reload penuh bila menggunakan island Vue.
- Tetap usable tanpa JavaScript untuk listing dasar.

### 6.5 SEO dan Metadata

**Tasks:**

- Tambahkan structured data untuk Person, WebSite, CreativeWork, dan Article/BlogPosting bila relevan.
- Open Graph image default.
- Per-page title dan description.
- Canonical URL.
- Sitemap.
- Robots.

**Acceptance criteria:**

- Setiap halaman utama punya title dan description unik.
- Social share preview layak tampil.

### 6.6 Phase 2 Definition of Done

- Certificates dapat ditampilkan dan difilter.
- Notes dapat dibuat melalui content collections.
- Project filtering lebih matang.
- SEO metadata konsisten.
- Minimal 3 notes atau technical entries tersedia.
- Minimal 2 case studies tersedia atau 1 flagship case study sangat lengkap.

---

## Phase 3 — Premium Interaction System

**Tujuan:** menambahkan pengalaman premium yang membedakan portfolio, tanpa mengorbankan performa dan aksesibilitas.

### 7.1 Fitur Utama

1. Command Palette
2. Advanced Hero System Visualization
3. Motion system terstandarisasi
4. SVG icon system custom
5. Certificate vault premium
6. Visitor analytics/globe lazy-loaded

### 7.2 Command Palette

**Shortcut:**

- `CMD + K`
- `CTRL + K`

**Fungsi:**

- Navigate pages.
- Search projects.
- Search notes.
- Open resume.
- Contact.
- Theme switch.
- Language switch jika bilingual sudah aktif.

**Acceptance criteria:**

- Keyboard accessible.
- Tidak menghambat page load.
- Bisa ditutup dengan Escape.
- Hasil pencarian relevan.

### 7.3 Advanced Hero System Visualization

**Konsep:**

Hero menampilkan sistem visual berupa node:

- Infrastructure
- AI
- Automation
- Product
- Architecture

**Interaction:**

- Hover/focus node menampilkan penjelasan.
- Klik node mengarah ke capability atau project relevan.
- Animasi connection line tidak wajib untuk memahami konten.

**Acceptance criteria:**

- Tidak menyebabkan layout shift.
- Tidak berat di mobile.
- Ada fallback statis.
- Respect `prefers-reduced-motion`.

### 7.4 Motion System

**Motion tiers:**

#### Tier 1 — Essential

- Hover state
- Focus state
- Section reveal ringan
- Reduced motion

#### Tier 2 — Brand Motion

- Hero network animation
- Connection line animation
- Animated counters
- Project card transition

#### Tier 3 — Experimental

- Morphing SVG
- Contextual cursor
- Visitor globe
- Depth effects

**Acceptance criteria:**

- Tidak ada animasi yang memblokir interaksi.
- Semua motion bisa dimatikan/reduced.
- Animation code tidak tersebar acak; harus melalui utility/composable.

### 7.5 SVG Icon System

**Prinsip:**

- Tidak bergantung pada icon library untuk ikon brand utama.
- Custom SVG untuk infrastructure, cloud, AI, architecture, projects, documents, certificates, navigation, dan contact.

**Acceptance criteria:**

- SVG reusable sebagai component.
- Warna mengikuti design token.
- Accessible label tersedia bila ikon informatif.

### 7.6 Visitor Analytics / Globe

**Prinsip:**

- Lazy loaded.
- Client-side only.
- Dekat footer.
- Tidak mempengaruhi initial load.

**Acceptance criteria:**

- Tidak masuk critical rendering path.
- Tidak mengganggu privasi tanpa disclosure.
- Ada fallback jika script analytics gagal.

### 7.7 Phase 3 Definition of Done

- Command palette stabil.
- Hero visualization interaktif tetapi tetap performant.
- Motion system terdokumentasi.
- SVG system konsisten.
- Certificate vault terasa premium.
- Visitor globe tidak menurunkan Lighthouse secara signifikan.

---

## Phase 4 — Internationalization, Optimization, dan Growth

**Tujuan:** memperluas jangkauan, meningkatkan conversion, dan mengoptimalkan pengalaman berdasarkan data.

### 8.1 Bilingual / Language System

**Pilihan strategi:**

1. English-first dengan beberapa konten Indonesia.
2. Full bilingual `/en` dan `/id`.
3. English UI dengan notes/case study bilingual bertahap.

**Rekomendasi:**

Mulai English-first untuk target recruiter/CTO global, lalu tambahkan Indonesia untuk notes atau audience lokal.

**Acceptance criteria:**

- Language switch tidak muncul jika konten belum tersedia.
- Tidak ada halaman bilingual setengah matang.
- Metadata sesuai bahasa.

### 8.2 Analytics dan Conversion Optimization

**Event yang perlu dilacak:**

- Click resume download.
- Click contact email.
- Click LinkedIn.
- Click GitHub.
- Case study read depth.
- Project filter usage.
- Command palette usage.

**Acceptance criteria:**

- Tracking tidak melanggar privasi.
- Privacy page menjelaskan analytics.
- Data digunakan untuk memperbaiki homepage/CTA.

### 8.3 Performance Hardening

**Tasks:**

- Image optimization.
- Font loading optimization.
- Component lazy loading.
- Route-based splitting.
- Defer animation scripts.
- Audit unused CSS/JS.

**Targets:**

- Lighthouse Performance >= 90.
- Accessibility >= 95.
- Best Practices >= 95.
- SEO >= 95.
- LCP < 2.5s.
- CLS < 0.1.
- INP baik untuk halaman interaktif.

### 8.4 Content Growth

**Target konten jangka menengah:**

- 3-5 case studies.
- 8-12 projects.
- 6-10 technical notes.
- Certificate vault lengkap.
- Resume selalu up to date.

### 8.5 Phase 4 Definition of Done

- Analytics event utama tersedia.
- Performance budget stabil.
- Bilingual strategy jelas atau aktif.
- Konten bertambah tanpa perlu refactor besar.
- Conversion path dioptimalkan berdasarkan data.

---

## 5. Backlog Prioritas

### P0 — Harus Ada Sebelum Launch

- Final positioning dan hero copy.
- Homepage core sections.
- Projects page.
- Minimal 1 full case study.
- Resume page/download.
- Contact page.
- Responsive navigation.
- Basic SEO metadata.
- Basic accessibility.
- Production build sukses.

### P1 — Sangat Penting Setelah MVP

- Content collections schema matang.
- Project filtering.
- Certificate listing.
- Technical notes.
- Open Graph metadata.
- Sitemap/robots/canonical.
- Reduced motion polish.
- More complete case study content.

### P2 — Premium Differentiators

- Command palette.
- Advanced hero visualization.
- Custom SVG morphing.
- Certificate vault premium.
- Visitor globe.
- Advanced analytics events.
- Bilingual support.

### P3 — Nice to Have

- Dynamic OG image generation.
- Search across all content.
- Case study reading progress.
- Related content engine.
- Changelog or now page.
- Public metrics dashboard.

---

## 6. Rekomendasi Struktur Konten

### 6.1 Project Schema

```ts
{
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  domains: string[];
  role: string;
  stack: string[];
  year: number;
  status: 'live' | 'archived' | 'experiment' | 'in-progress';
  featured: boolean;
  impact?: string;
  repoUrl?: string;
  demoUrl?: string;
  caseStudySlug?: string;
  cover?: string;
}
```

### 6.2 Case Study Schema

```ts
{
  title: string;
  slug: string;
  excerpt: string;
  projectSlug?: string;
  role: string;
  year: number;
  summary: string;
  problem: string;
  requirements: string[];
  constraints: string[];
  architecture: string;
  decisions: string[];
  implementation: string;
  results: string[];
  metrics?: Record<string, string | number>;
  lessons: string[];
  cover?: string;
}
```

### 6.3 Notes Schema

```ts
{
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  draft?: boolean;
}
```

### 6.4 Certificate Schema

```ts
{
  title: string;
  slug: string;
  issuer: string;
  issuedAt: Date;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  category: string;
  priority?: number;
  cover?: string;
}
```

---

## 7. Rekomendasi Struktur Folder

```txt
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── project/
│   ├── case-study/
│   ├── certificate/
│   ├── notes/
│   ├── contact/
│   ├── animation/
│   ├── svg/
│   └── shared/
├── content/
│   ├── projects/
│   ├── case-studies/
│   ├── notes/
│   └── certificates/
├── data/
├── layouts/
├── lib/
├── pages/
├── services/
├── styles/
├── types/
└── utils/
```

---

## 8. Testing dan Quality Gates

### 8.1 Build Checks

- `npm run build` harus sukses.
- TypeScript errors harus 0 untuk production branch.
- Broken internal links harus dicek sebelum release.

### 8.2 Accessibility Checks

- Semua interactive element dapat diakses keyboard.
- Focus state terlihat.
- Heading hierarchy valid.
- Alt text tersedia untuk gambar informatif.
- Reduced motion tersedia.
- Contrast minimal WCAG AA.

### 8.3 Performance Checks

- Lighthouse Performance >= 90.
- Image teroptimasi.
- Font tidak memblokir rendering berlebihan.
- Animasi tidak masuk critical path.
- Visitor globe dan fitur berat lazy-loaded.

### 8.4 Content Checks

- Tidak ada placeholder di halaman production.
- Semua link sosial valid.
- Resume terbaru.
- Case study memiliki problem, architecture, result, dan lessons learned.
- Project memiliki role dan impact.

---

## 9. Milestone Timeline yang Disarankan

Timeline ini bersifat relatif dan dapat disesuaikan berdasarkan waktu pengerjaan.

### Week 1 — Alignment dan Foundation

- Final positioning.
- Sitemap final.
- Content inventory.
- Setup folder dan schema.
- Homepage wireframe tekstual.

### Week 2 — Homepage dan Layout Core

- Global layout.
- Navigation.
- Hero.
- Proof snapshot.
- Featured case study block.
- Selected projects block.
- Contact CTA.

### Week 3 — Projects, Case Studies, Resume

- Projects page.
- Case study listing/detail.
- Resume page.
- Content collections.
- Minimal 1 flagship case study.

### Week 4 — Polish MVP

- Responsive polish.
- SEO metadata.
- Accessibility pass.
- Performance pass.
- Production build.
- Launch candidate.

### Week 5-6 — Credibility Layer

- Certificates.
- Notes.
- Filtering/search.
- More case studies.
- Open Graph polish.

### Week 7+ — Premium Layer

- Command palette.
- Advanced hero visualization.
- SVG system.
- Certificate vault premium.
- Visitor globe.
- Analytics events.

---

## 10. Keputusan yang Perlu Dikonfirmasi

Sebelum implementasi besar, beberapa keputusan harus dikunci:

1. Apakah positioning final tetap `Digital Systems Architect`?
2. Apakah bahasa utama website English-first?
3. Apa CTA utama homepage: case study, resume, atau contact?
4. Apakah SMK Teknovo Ecosystem menjadi flagship case study?
5. Apakah contact form masuk MVP atau cukup email/LinkedIn?
6. Apakah command palette masuk MVP atau fase premium?
7. Apakah certificate vault perlu tampil sejak launch?
8. Apakah technical notes masuk MVP atau setelah launch?
9. Seberapa kompleks hero visualization pada versi pertama?
10. Apakah desain perlu strict mengikuti Vercel/Cloudflare, atau cukup sebagai inspirasi?

---

## 11. Rekomendasi Eksekusi Terdekat

Urutan kerja paling aman:

1. Kunci positioning dan homepage copy.
2. Buat content schema untuk projects dan case studies.
3. Buat homepage MVP tanpa animasi kompleks.
4. Buat flagship case study lengkap.
5. Buat projects dan resume page.
6. Tambahkan motion ringan dan design polish.
7. Jalankan accessibility dan performance pass.
8. Launch MVP.
9. Tambahkan certificates, notes, dan filtering.
10. Baru tambahkan command palette dan premium motion.

Dengan pendekatan ini, portfolio bisa cepat menjadi usable dan credible, lalu meningkat secara bertahap menjadi platform personal brand yang premium.
