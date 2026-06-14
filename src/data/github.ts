export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
  language: string;
  role: string;
}

export const githubRepos = {
  en: [
    {
      name: "portofolio",
      description: "A content-first professional developer portfolio built with Astro, Cloudflare, and custom design systems.",
      stars: 12,
      forks: 3,
      url: "https://github.com/SaenaAsColeAllStar/portofolio",
      language: "Astro / TS",
      role: "Creator"
    },
    {
      name: "smk-teknovo-ecosystem",
      description: "Integrated school digital portal featuring LMS modules, high-concurrency CBT engines, and Hyperdrive DB edge connection pooling.",
      stars: 8,
      forks: 1,
      url: "https://github.com/SaenaAsColeAllStar/smk-teknovo-ecosystem",
      language: "TypeScript",
      role: "Architect"
    }
  ],
  id: [
    {
      name: "portofolio",
      description: "Portofolio developer profesional berbasis konten yang dibangun dengan Astro, Cloudflare, dan sistem desain kustom.",
      stars: 12,
      forks: 3,
      url: "https://github.com/SaenaAsColeAllStar/portofolio",
      language: "Astro / TS",
      role: "Pembuat"
    },
    {
      name: "smk-teknovo-ecosystem",
      description: "Portal digital sekolah terintegrasi dengan modul LMS, mesin CBT konkurensi tinggi, dan pooling koneksi edge Hyperdrive.",
      stars: 8,
      forks: 1,
      url: "https://github.com/SaenaAsColeAllStar/smk-teknovo-ecosystem",
      language: "TypeScript",
      role: "Arsitek"
    }
  ]
} as const;
