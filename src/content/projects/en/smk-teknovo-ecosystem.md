---
title: "SMK Teknovo Ecosystem"
excerpt: "Designed and integrated a complete educational ecosystem connecting learning operations, CBT exams, and edge infrastructure."
category: "Education Technology"
domains:
  - Infrastructure
  - Automation
  - Product Engineering
  - System Architecture
role: "Lead Systems Architect & Product Engineer"
stack:
  - Astro
  - Cloudflare Workers
  - PostgreSQL
  - GitHub Actions
year: 2026
status: "live"
featured: true
impact: "Connected 8 discrete modules under a unified RBAC portal serving 1,000+ active students."
caseStudySlug: "smk-teknovo-ecosystem"
---

### Summary
The SMK Teknovo Ecosystem is a comprehensive educational platform that integrates public web presence, custom learning management systems (LMS), computer-based testing (CBT), an e-library catalog, and administrative tooling into a unified system.

### Problem
The school's digital tools were severely fragmented. The public website, LMS, CBT, and library catalogs operated as independent software packages on separate shared hosting plans. During mid-term exam periods, the CBT system frequently crashed under load, and teachers had to manually sync grades via Excel spreadsheets, introducing administrative delays and data security risks.

### Solution
Designed a loosely-coupled, edge-first architecture. The public content is static-first, powered by Astro and cached on Cloudflare CDNs. Operational interfaces (CBT and LMS) run on Cloudflare Workers edge runtimes, communicating with a central PostgreSQL database through connection-pooled Hyperdrive tunnels. Implemented a custom JWT/HMAC token session manager to enforce Role-Based Access Control (RBAC) securely at the network boundary.

### Technologies
- **Core Platform**: Astro Framework, HTML5, Vanilla CSS
- **Edge Layer**: Cloudflare Workers, Cloudflare Pages
- **Database & Pooling**: PostgreSQL, Drizzle ORM, Cloudflare Hyperdrive
- **CI/CD & Shell**: GitHub Actions, Bash scripting, SSH integrations

### Outcomes
- Successfully unified **8 discrete modules** (Website, LMS, CBT, E-Learning, E-Library, RBAC Admin Portal, Content Management, Infrastructure Telemetry) into a single domain.
- Served **1,000+ concurrent student exam requests** with zero downtime during mid-term exam stress blocks.
- Reduced database connection latency from **250ms to less than 40ms** using edge pooling via Hyperdrive.

### Lessons Learned
- Decoupling static informational pages from high-throughput operational services (like CBT) prevents server load propagation and guarantees uptime.
- Connection pooling is a critical bottleneck when combining serverless edge runtimes with relational databases, making Hyperdrive an essential element of the design.
