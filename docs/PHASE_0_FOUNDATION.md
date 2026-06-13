# Phase 0 Foundation — CTOS Portfolio Platform

Dokumen ini mengunci hasil eksekusi **Phase 0 — Product Alignment dan Foundation** dari roadmap. Tujuannya adalah memastikan arah produk, scope MVP, struktur konten, dan fondasi teknis sudah jelas sebelum masuk ke pembangunan UI dan fitur premium.

---

## 1. Product Alignment

### 1.1 Product Promise

CTOS Portfolio Platform adalah platform personal branding untuk menunjukkan kemampuan membangun sistem digital yang reliable melalui kombinasi infrastructure, automation, AI workflows, dan product engineering.

### 1.2 Final Positioning

**Digital Systems Architect**

### 1.3 Supporting Statement

**Bridging Infrastructure, AI, and Product Engineering.**

Designing reliable digital systems through architecture, automation, and AI-powered workflows.

### 1.4 Recruiter-Friendly Explanation

A systems-focused engineer building reliable infrastructure, automation, AI workflows, and product experiences.

### 1.5 Primary Audience Priority

1. Recruiters dan technical hiring managers.
2. CTOs dan engineering leads.
3. Startup founders atau potential clients.
4. Developers dan technical community.

### 1.6 Primary Conversion Goals

1. Pengunjung membuka case study unggulan.
2. Pengunjung membuka atau mengunduh resume.
3. Pengunjung menghubungi melalui email atau LinkedIn.
4. Pengunjung mengeksplorasi project teknis lebih dalam.

---

## 2. MVP Scope

### 2.1 P0 — Wajib Ada untuk Launch Pertama

- Homepage dengan positioning, proof snapshot, featured case study, selected projects, resume CTA, dan contact CTA.
- Projects page dengan listing project dan category tag.
- Case Studies page dengan minimal satu flagship case study.
- Resume page atau resume download CTA.
- Contact page dengan email, LinkedIn, dan GitHub.
- Basic SEO metadata.
- Responsive navigation.
- Reduced motion baseline.
- Production build berhasil.

### 2.2 P1 — Setelah MVP Stabil

- Certificate listing.
- Technical notes.
- Project filtering/search.
- Open Graph polish.
- Structured data.
- Additional case studies.

### 2.3 Deferred dari MVP

- Command palette.
- Visitor globe.
- Advanced certificate vault animation.
- Morphing SVG system.
- Full bilingual routing.
- Advanced analytics dashboard.

---

## 3. Homepage Narrative

### 3.1 Section Order

1. **Hero** — identity, positioning, CTA.
2. **Proof Snapshot** — capabilities dan credibility signals.
3. **Featured Case Study** — flagship system story.
4. **Capability Matrix** — infrastructure, automation, AI workflows, product engineering.
5. **Selected Projects** — project terbaik dengan impact statement.
6. **Resume Preview** — summary dan download CTA.
7. **Contact CTA** — email, LinkedIn, GitHub.

### 3.2 Hero Copy Baseline

- Eyebrow: `Digital Systems Architect`
- Headline: `Bridging Infrastructure, AI, and Product Engineering.`
- Subheadline: `I design and build reliable digital systems through architecture, automation, and AI-powered workflows.`
- Primary CTA: `View Case Studies`
- Secondary CTA: `Download Resume`

### 3.3 UX Guardrails

- Pengunjung harus memahami positioning dalam 10-15 detik.
- CTA utama harus terlihat di viewport awal desktop.
- Animasi tidak boleh menjadi syarat untuk memahami konten.
- Mobile harus tetap sederhana dan cepat.

---

## 4. Content Inventory Awal

### 4.1 Flagship Case Study

**SMK Teknovo Ecosystem**

Status: perlu dilengkapi.

Konten yang harus dikumpulkan:

- Problem utama.
- Role dan kontribusi pribadi.
- Requirements.
- Architecture diagram atau penjelasan sistem.
- Technology decisions.
- Implementation highlights.
- Challenges.
- Results/impact.
- Lessons learned.
- Future improvements.

### 4.2 Project Content Minimal

Setiap project harus memiliki:

- Title.
- Excerpt.
- Category.
- Domains.
- Role.
- Stack.
- Year.
- Status.
- Impact statement.
- Repo/demo link bila tersedia.
- Optional case study link.

### 4.3 Resume Content Minimal

Resume harus mencakup:

- Profile summary.
- Core capabilities.
- Project highlights.
- Education.
- Certificates.
- Contact links.

### 4.4 Certificate Content Minimal

Setiap certificate harus memiliki:

- Title.
- Issuer.
- Issued date.
- Credential URL atau credential ID bila tersedia.
- Related skills.
- Category.

---

## 5. Technical Foundation Decisions

### 5.1 Stack Baseline

- Astro 5+ sebagai static-first framework.
- Vue 3 untuk island interaktif yang bernilai tinggi.
- TypeScript untuk type safety.
- Tailwind CSS 4 untuk styling system pada fase implementasi berikutnya.
- MDX dan Astro Content Collections untuk content-first workflow.
- Cloudflare Pages/Workers sebagai target deployment.

### 5.2 Content Collections

Content collections disiapkan untuk:

- `blog` — koleksi starter yang sudah ada.
- `projects` — portfolio project.
- `caseStudies` — long-form system story.
- `notes` — knowledge-base style technical notes.
- `certificates` — certificate vault data.

### 5.3 Data Modules

Data foundation disiapkan pada `src/data/`:

- `positioning.ts` — positioning, audience, CTA, dan homepage narrative.
- `navigation.ts` — item navigasi utama.
- `socials.ts` — contact/social links.
- `skills.ts` — capability matrix.
- `metrics.ts` — proof snapshot baseline.
- `settings.ts` — site/domain/language/theme baseline.

---

## 6. Phase 0 Acceptance Criteria Status

| Criteria | Status | Notes |
| --- | --- | --- |
| Final positioning statement tersedia | Done | `Digital Systems Architect` dikunci sebagai baseline. |
| Homepage narrative tersedia | Done | Section order dan hero copy baseline sudah didefinisikan. |
| MVP scope tersedia | Done | P0, P1, dan deferred scope sudah dipisahkan. |
| Content inventory awal tersedia | Done | Flagship case study dan field minimum konten sudah didefinisikan. |
| Content collections schema tersedia | Done | Schema ditambahkan pada `src/content.config.ts`. |
| Data foundation tersedia | Done | Modul data awal ditambahkan pada `src/data/`. |
| Build dieksekusi | Blocked by environment | Dependencies tidak tersedia dan install dari registry terkena 403. |

---

## 7. Next Step Setelah Phase 0

1. Isi konten nyata untuk flagship case study SMK Teknovo Ecosystem.
2. Isi 3-6 project awal menggunakan schema `projects`.
3. Bangun homepage MVP berdasarkan narrative di dokumen ini.
4. Buat Projects dan Case Studies page berbasis content collections.
5. Jalankan build di environment yang memiliki akses dependency registry.
