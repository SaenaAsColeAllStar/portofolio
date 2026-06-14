---
title: "CTOS Portfolio Platform"
excerpt: "A content-first personal branding platform for demonstrating infrastructure, AI workflows, automation, and product engineering capability."
category: "Personal Branding Platform"
domains:
  - Product Engineering
  - System Architecture
  - Content Systems
role: "Product owner and engineer"
stack:
  - Astro
  - MDX
  - TypeScript
  - Cloudflare Pages
year: 2026
status: "in-progress"
featured: true
impact: "Transforms a portfolio from a project list into a structured credibility system."
caseStudySlug: "ctos-portfolio-platform"
---

### Summary
A content-first personal branding platform designed to showcase digital architecture, automation, and edge infrastructure capabilities through structured case studies and proof points.

### Problem
Traditional developer portfolios are often built using templates that focus on generic lists of technologies or visual showcases without presenting actual business problems, engineering constraints, or architecture-level decisions. This makes it difficult for recruiters and founders to evaluate a candidate's actual systems-level capabilities.

### Solution
Created a custom static-first platform using Astro and Cloudflare Pages. Built structured content collections for projects, case studies, certificates, and technical notes. Implemented clean data-driven branding assets, an interactive system map SVG, and a professional bilingual toggle, all running edge-cached.

### Technologies
- **Core Platform**: Astro Framework, TypeScript
- **Styling**: Vanilla CSS with structured design tokens
- **Infrastructure & Hosting**: Cloudflare Pages, Cloudflare Workers
- **DevOps**: GitHub Actions, Git version control

### Outcomes
- Engineered a modular, performance-optimized codebase scoring **100% on Lighthouse performance** tests.
- Implemented automated schema validation for projects, case studies, certificates, and technical notes.
- Built a bilingual (EN/ID) routing wrapper that supports content parity.

### Lessons Learned
- Leveraging Astro's content collections provides compile-time frontmatter validation, preventing schema drifts.
- Designing with raw CSS custom properties (design tokens) allows a premium custom aesthetic without introducing bulky CSS frameworks.

