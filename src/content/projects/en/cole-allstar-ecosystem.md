---
title: "ColeAllStar Ecosystem"
excerpt: "A unified home-lab and cloud infrastructure platform orchestrating self-hosted tools, CI/CD automation, and secure edge-native tunnels."
category: "Infrastructure & Automation"
domains:
  - Infrastructure
  - Automation
  - System Architecture
role: "System Architect & Administrator"
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
impact: "Consolidated 12 private microservices under a secure Edge tunnel framework with 99.98% service availability."
repoUrl: "https://github.com/SaenaAsColeAllStar/portofolio"
demoUrl: "https://ctos.web.id"
caseStudySlug: "cole-allstar-ecosystem"
---

### Summary
The ColeAllStar Ecosystem is a private home-lab and cloud orchestration environment designed to host critical applications, automate repetitive developer tasks, run background search tasks, and manage distributed service telemetry.

### Problem
Orchestrating personal applications (such as password vaults, backup pools, local DNS resolvers, and development servers) across multiple home computers and cloud VPS instances led to high administrative overhead. Keeping ports open to the public internet invited malicious vulnerability scans, while backups were handled manually and failed silently.

### Solution
Virtualitas was established by deploying a Proxmox VE hypervisor running Debian VM instances and Docker runtimes. Instead of opening public incoming ports, private outbound connections are routed via Cloudflare Tunnels secured by Cloudflare Access MFA rules. An automated shell backup pipeline was created to snapshot data daily to decentralized object storage. A central telemetry stack gathers system metrics and alerts on server utilization anomalies.

### Technologies
- **Hypervisor & Containers**: Proxmox VE, KVM, Docker Compose
- **Network Routing**: Cloudflare Tunnels, Pi-hole (Local DNS)
- **CI/CD & Provisioning**: GitHub Actions, Bash scripts
- **Telemetry**: Prometheus, Grafana, Node Exporter

### Outcomes
- Secured **12 private applications** behind single-sign-on MFA, eliminating all open inbound ports on the router.
- Automated daily incremental backups with **instant Discord alerts** upon completion or error.
- Achieved **99.98% service uptime** on core hypervisor services over a 12-month evaluation window.

### Lessons Learned
- Decoupling virtualization hosts from containerized runtime instances prevents single points of configuration failure.
- Outbound-only tunneling removes entire classes of edge-network intrusion vulnerabilities, making it the preferred standard for private infrastructure setups.
