export const proofSignals = {
  en: [
    {
      label: "System Latency",
      value: "< 50ms",
      description: "Average API response window at edge network nodes.",
    },
    {
      label: "Build Delivery",
      value: "99.99%",
      description: "Static content replication and availability score.",
    },
    {
      label: "Service Uptime",
      value: "99.9%",
      description: "Edge API processing runtime reliability quotient.",
    },
  ],
  id: [
    {
      label: "Latensi Sistem",
      value: "< 50ms",
      description: "Rata-rata jendela respons API di titik jaringan edge.",
    },
    {
      label: "Pengiriman Build",
      value: "99.99%",
      description: "Skor replikasi konten statis dan ketersediaan.",
    },
    {
      label: "Uptime Layanan",
      value: "99.9%",
      description: "Koefisien keandalan runtime pemrosesan API edge.",
    },
  ]
} as const;
