export const technologyCategories = {
  en: {
    languages: "Languages",
    backend: "Backend & Databases",
    devops: "Infrastructure & DevOps",
    frontend: "Frontend & UI",
    ai: "AI & ML Integration",
  },
  id: {
    languages: "Bahasa Pemrograman",
    backend: "Backend & Basis Data",
    devops: "Infrastruktur & DevOps",
    frontend: "Frontend & UI",
    ai: "Integrasi AI & ML",
  }
} as const;

export const technologies = {
  en: [
    { name: "TypeScript / JavaScript", category: "languages", description: "Primary runtime language for both serverless Worker logic and UI interactions." },
    { name: "Go", category: "languages", description: "Used for high-performance backend microservices and CLI tools." },
    { name: "Rust", category: "languages", description: "Compiled languages target systems requiring strict memory safety and performance." },
    { name: "HTML5 / CSS3", category: "languages", description: "Building responsive, semantic, and modern layout interfaces." },
    { name: "PostgreSQL", category: "backend", description: "Relational database used for structured storage with transaction safety." },
    { name: "SQLite", category: "backend", description: "Used for edge replication (D1) and local developments." },
    { name: "Drizzle ORM", category: "backend", description: "Type-safe SQL query generation matching relational schemas." },
    { name: "Node.js", category: "backend", description: "Server-side JavaScript environment for build steps and tooling." },
    { name: "Docker", category: "devops", description: "Containerization tool for predictable and reproducible environment setups." },
    { name: "GitHub Actions", category: "devops", description: "Workflow automation for CI/CD test runs and deployment releases." },
    { name: "Terraform", category: "devops", description: "Declaring infrastructure configuration state across cloud providers." },
    { name: "Cloudflare Workers", category: "devops", description: "Serverless execution runtime deployed directly at edge points." },
    { name: "Astro", category: "frontend", description: "High-performance framework optimizing static delivery with hybrid SSR options." },
    { name: "React", category: "frontend", description: "Component-driven structure for highly interactive application layers." },
    { name: "TailwindCSS", category: "frontend", description: "Utility-first design tokens workflow for styling composition." },
    { name: "Vite", category: "frontend", description: "Rapid compilation bundle pipelines matching modern web tools." },
    { name: "Workers AI", category: "ai", description: "Edge LLM model execution interface matching Llama & Mistral model groups." },
    { name: "Vectorize", category: "ai", description: "Vector database indexing embeddings for semantic context search." },
  ],
  id: [
    { name: "TypeScript / JavaScript", category: "languages", description: "Bahasa runtime utama untuk logika Worker serverless dan interaksi UI." },
    { name: "Go", category: "languages", description: "Digunakan untuk mikrolayanan backend berkinerja tinggi dan alat CLI." },
    { name: "Rust", category: "languages", description: "Bahasa terkompilasi yang menargetkan sistem yang membutuhkan keamanan memori dan performa ketat." },
    { name: "HTML5 / CSS3", category: "languages", description: "Membangun antarmuka tata letak yang responsif, semantik, dan modern." },
    { name: "PostgreSQL", category: "backend", description: "Basis data relasional yang digunakan untuk penyimpanan terstruktur dengan keamanan transaksi." },
    { name: "SQLite", category: "backend", description: "Digunakan untuk replikasi edge (D1) dan pengembangan lokal." },
    { name: "Drizzle ORM", category: "backend", description: "Pembuatan kueri SQL yang aman untuk tipe data yang cocok dengan skema relasional." },
    { name: "Node.js", category: "backend", description: "Lingkungan JavaScript sisi server untuk langkah pembuatan build dan perkakas." },
    { name: "Docker", category: "devops", description: "Alat kontainerisasi untuk penyiapan lingkungan yang dapat diprediksi dan direproduksi." },
    { name: "GitHub Actions", category: "devops", description: "Otomatisasi alur kerja untuk pengujian CI/CD dan rilis deployment." },
    { name: "Terraform", category: "devops", description: "Mendeklarasikan status konfigurasi infrastruktur di seluruh penyedia cloud." },
    { name: "Cloudflare Workers", category: "devops", description: "Runtime eksekusi serverless yang di-deploy langsung di titik edge." },
    { name: "Astro", category: "frontend", description: "Framework berkinerja tinggi yang mengoptimalkan pengiriman statis dengan opsi SSR hybrid." },
    { name: "React", category: "frontend", description: "Struktur berbasis komponen untuk lapisan aplikasi yang sangat interaktif." },
    { name: "TailwindCSS", category: "frontend", description: "Alur kerja token desain utilitas pertama untuk komposisi gaya." },
    { name: "Vite", category: "frontend", description: "Saluran bundel kompilasi cepat yang cocok dengan alat web modern." },
    { name: "Workers AI", category: "ai", description: "Antarmuka eksekusi model LLM edge yang cocok dengan grup model Llama & Mistral." },
    { name: "Vectorize", category: "ai", description: "Basis data vektor untuk mengindeks embedding untuk pencarian konteks semantik." },
  ]
} as const;
