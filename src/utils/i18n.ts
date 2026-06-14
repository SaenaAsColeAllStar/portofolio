export const uiStrings = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.caseStudies": "Case Studies",
    "nav.systems": "Systems",
    "nav.notes": "Notes",
    "nav.certificates": "Certificates",
    "nav.contact": "Contact",
    "nav.guestbook": "Guestbook",
    "nav.resume": "Resume",
    
    // Global Elements
    "btn.viewAll": "View all",
    "btn.contact": "Contact",
    "btn.resume": "View Resume",
    "btn.readCaseStudy": "Read Case Study",
    
    // Home Page
    "home.proofHeadline": "Systems thinking before stack lists.",
    "home.featuredCaseStudy": "Featured Case Study",
    "home.capabilityHeadline": "Core domains connected into one architecture-first portfolio.",
    "home.projectsHeadline": "Project evidence with role, architecture, and impact.",
    "home.notesHeadline": "Lessons, patterns, and technical insights.",
    "home.certsHeadline": "Verified credentials and certifications.",
    "home.ctaHeadline": "Need a systems-focused engineer?",
    "home.ctaBody": "Review the resume summary or reach out directly through email, LinkedIn, or GitHub.",
    
    // About Page
    "about.summaryHeadline": "Building systems that hold up under real conditions.",
    "about.expertiseHeadline": "Core domains connected into one architecture-first practice.",
    "about.philosophyHeadline": "How I approach engineering work.",
    "about.techHeadline": "Tools and platforms I work with regularly.",
    "about.ctaHeadline": "Interested in working together?",
    "about.ctaBody": "I'm open to discussing infrastructure, automation, AI integration, and product engineering opportunities.",
    
    // Contact Page
    "contact.headline": "Let's discuss reliable digital systems.",
    "contact.subheadline": "Use email, LinkedIn, or GitHub to reach out about professional opportunities, product engineering, automation, or infrastructure work.",
    "contact.formName": "Name",
    "contact.formEmail": "Email",
    "contact.formSubject": "Subject",
    "contact.formMessage": "Message",
    "contact.formSubmit": "Send Message",
    "contact.formSending": "Sending...",
    "contact.securityCheck": "Please complete the security check.",
    
    // Guestbook Page
    "guestbook.title": "Guestbook",
    "guestbook.headline": "System Sign-Offs",
    "guestbook.subheadline": "Sign the guestbook, leave a message, or say hello. Backed by Turnstile anti-spam protection.",
    "guestbook.formName": "Name",
    "guestbook.formMessage": "Message",
    "guestbook.formSubmit": "Sign Guestbook",
    "guestbook.formSigning": "Signing...",
    "guestbook.recentSignatures": "Recent Signatures",
    "guestbook.emptyState": "No guestbook signatures recorded.",
    "guestbook.errorRequired": "Name and message are required.",
    
    // Footer
    "footer.latency": "Database Latency",
    "footer.views": "Page Hits",
    "footer.chatAgent": "Ask AI System Assistant"
  },
  id: {
    // Navigation
    "nav.home": "Beranda",
    "nav.about": "Tentang",
    "nav.projects": "Proyek",
    "nav.caseStudies": "Studi Kasus",
    "nav.systems": "Sistem",
    "nav.notes": "Catatan",
    "nav.certificates": "Sertifikat",
    "nav.contact": "Kontak",
    "nav.guestbook": "Buku Tamu",
    "nav.resume": "Resume",
    
    // Global Elements
    "btn.viewAll": "Lihat semua",
    "btn.contact": "Kontak",
    "btn.resume": "Lihat Resume",
    "btn.readCaseStudy": "Baca Studi Kasus",
    
    // Home Page
    "home.proofHeadline": "Pemikiran sistem sebelum daftar teknologi.",
    "home.featuredCaseStudy": "Studi Kasus Pilihan",
    "home.capabilityHeadline": "Domain inti terhubung ke dalam satu portofolio berbasis arsitektur.",
    "home.projectsHeadline": "Bukti proyek dengan peran, arsitektur, dan dampak.",
    "home.notesHeadline": "Pelajaran, pola, dan wawasan teknis.",
    "home.certsHeadline": "Kredensial dan sertifikasi terverifikasi.",
    "home.ctaHeadline": "Butuh insinyur yang berfokus pada sistem?",
    "home.ctaBody": "Tinjau ringkasan resume atau hubungi langsung melalui email, LinkedIn, atau GitHub.",
    
    // About Page
    "about.summaryHeadline": "Membangun sistem yang bertahan di bawah kondisi nyata.",
    "about.expertiseHeadline": "Domain inti terhubung ke dalam satu praktik berbasis arsitektur.",
    "about.philosophyHeadline": "Bagaimana saya mendekati pekerjaan teknik.",
    "about.techHeadline": "Alat dan platform yang saya gunakan secara teratur.",
    "about.ctaHeadline": "Tertarik untuk bekerja sama?",
    "about.ctaBody": "Saya terbuka untuk mendiskusikan peluang infrastruktur, otomatisasi, integrasi AI, dan rekayasa produk.",
    
    // Contact Page
    "contact.headline": "Mari diskusikan sistem digital yang andal.",
    "contact.subheadline": "Gunakan email, LinkedIn, atau GitHub untuk menghubungi saya tentang peluang profesional, rekayasa produk, otomatisasi, atau pekerjaan infrastruktur.",
    "contact.formName": "Nama",
    "contact.formEmail": "Email",
    "contact.formSubject": "Subjek",
    "contact.formMessage": "Pesan",
    "contact.formSubmit": "Kirim Pesan",
    "contact.formSending": "Mengirim...",
    "contact.securityCheck": "Harap selesaikan pemeriksaan keamanan.",
    
    // Guestbook Page
    "guestbook.title": "Buku Tamu",
    "guestbook.headline": "Tanda Tangan Sistem",
    "guestbook.subheadline": "Tanda tangani buku tamu, tinggalkan pesan, atau sekadar menyapa. Dilindungi oleh proteksi anti-spam Turnstile.",
    "guestbook.formName": "Nama",
    "guestbook.formMessage": "Pesan",
    "guestbook.formSubmit": "Tanda Tangani Buku Tamu",
    "guestbook.formSigning": "Menandatangani...",
    "guestbook.recentSignatures": "Tanda Tangan Terbaru",
    "guestbook.emptyState": "Belum ada tanda tangan buku tamu yang tercatat.",
    "guestbook.errorRequired": "Nama dan pesan wajib diisi.",
    
    // Footer
    "footer.latency": "Latensi Database",
    "footer.views": "Hit Halaman",
    "footer.chatAgent": "Tanya AI Asisten Sistem"
  }
} as const;

export type Locale = "en" | "id";

/**
 * Returns a helper function that resolves translation keys for a given locale.
 */
export function useTranslations(locale: Locale) {
  return function t(key: keyof typeof uiStrings["en"]): string {
    return uiStrings[locale][key] || uiStrings["en"][key];
  };
}

/**
 * Prepends the locale prefix to a URL if the locale is not default ('en').
 */
export function getLocalizedUrl(url: string, locale: string): string {
  if (locale === "en") return url;
  
  // Prevent double prefixing
  if (url.startsWith("/id")) return url;
  
  // Format leading slash correctly
  const path = url.startsWith("/") ? url : `/${url}`;
  return `/id${path === "/" ? "" : path}`;
}
