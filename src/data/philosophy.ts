export const architecturePhilosophy = {
  en: [
    {
      title: "Decoupled Resilience",
      tagline: "Isolation over tight coupling",
      description: "Systems should be modular, stateless at the edge, and pooled at the data layer to isolate failures and maintain zero-downtime reliability."
    },
    {
      title: "Continuous Declarative Automation",
      tagline: "Code over configuration",
      description: "Infrastructure must be declared as versioned code. Manual environments are a liability; automated pipelines enforce consistency."
    },
    {
      title: "Telemetry-Driven Decisions",
      tagline: "Metrics over assumptions",
      description: "Performance and scalability are measured through error rates, query latencies, and edge telemetry (like our Visitor Globe map)."
    }
  ],
  id: [
    {
      title: "Ketangguhan Terdekopel",
      tagline: "Isolasi di atas koneksi ketat",
      description: "Sistem harus modular, tanpa status (stateless) di edge, dan memiliki connection pooling pada layer data untuk mengisolasi kegagalan."
    },
    {
      title: "Otomatisasi Deklaratif Berkelanjutan",
      tagline: "Kode di atas konfigurasi manual",
      description: "Infrastruktur harus dideklarasikan sebagai kode terversikan. Lingkungan manual adalah kerentanan; pipa otomatis menegakkan konsistensi."
    },
    {
      title: "Keputusan Berbasis Telemetri",
      tagline: "Metrik di atas asumsi",
      description: "Kinerja dan skalabilitas diukur secara empiris melalui tingkat kesalahan, latensi kueri, dan telemetri edge (seperti peta Visitor Globe)."
    }
  ]
} as const;
