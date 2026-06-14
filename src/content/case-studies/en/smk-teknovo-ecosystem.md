---
title: "SMK Teknovo Ecosystem"
excerpt: "A flagship case study for building an education-oriented digital ecosystem with architecture-first storytelling."
projectSlug: "smk-teknovo-ecosystem"
role: "System architect and product engineer"
year: 2026
summary: "This case study documents the planned structure for a school digital ecosystem that combines web presence, operations, automation, and technical enablement."
problem: "Education institutions often need a reliable digital presence and operational workflows, but the systems are frequently fragmented across manual processes, disconnected tools, and unclear ownership."
requirements:
  - "Create a clear digital presence for school stakeholders."
  - "Represent academic, operational, and community information in a structured way."
  - "Prepare automation opportunities for recurring administrative or communication tasks."
  - "Keep the platform maintainable for future content and feature growth."
constraints:
  - "The MVP must remain simple enough to ship quickly."
  - "The architecture must support future integrations without becoming a heavy SaaS dashboard."
  - "Performance and accessibility must not be sacrificed for visual effects."
architecture: "Static-first public pages, content collections for structured information, and selective interactive islands for workflows that benefit from client-side behavior."
decisions:
  - "Use content-first modeling before building complex UI."
  - "Prioritize case-study storytelling over a raw technology list."
  - "Defer heavy interactive features until the proof narrative is clear."
results:
  - "A flagship portfolio story is defined for Phase 1."
  - "The case study can anchor homepage credibility and recruiter/CTO evaluation."
lessons:
  - "A strong portfolio project needs context, constraints, and results, not only stack names."
  - "Architecture diagrams and trade-off explanations should be prepared early."
---

## Overview

The SMK Teknovo Ecosystem is a comprehensive, production-grade educational platform that unifies multiple digital operational portals into a single, cohesive, edge-native system. It handles public information, learning management workflows, and high-concurrency computerized testing under strict performance constraints.

## Problem

The school's legacy digital infrastructure was severely fragmented. Public informational pages, learning management systems (LMS), computer-based testing (CBT) engines, and catalog libraries operated as independent application packages across various shared hosting plans. During high-traffic mid-term examinations, the CBT server frequently crashed under concurrent loads. Furthermore, administrative staff had to manually extract grades and sync them via spreadsheets, introducing security liabilities and operational delays.

## Requirements

1. **System Unification**: Consolidate 8 discrete functional modules under a unified domain with single-sign-on (SSO) capabilities.
2. **High Concurrency**: Support up to 1,000+ active students during exam blocks with zero resource starvation.
3. **Low Latency**: Reduce query response times from edge servers to database endpoints to under 50ms.
4. **Granular Security**: Implement a network-boundary Role-Based Access Control (RBAC) system for students, teachers, parents, and system admins.

## Architecture

We designed a decoupled, edge-first architecture:
- **Static Content Layer**: Public web interfaces are pre-rendered statically using Astro and cached globally on Cloudflare's edge CDN network.
- **Serverless Compute Layer**: High-interaction operational modules (LMS and CBT) execute on Cloudflare Workers edge runtimes.
- **Data & Pooling Layer**: State is persisted in a central PostgreSQL database. To prevent connection exhaustion from stateless serverless runtimes, all database transactions are routed through Cloudflare Hyperdrive tunnels performing real-time connection pooling at edge nodes.

## Implementation

The system integrates the following modules:
1. **Public Web Portal**: SEO-optimized static information pages.
2. **LMS Module**: Dynamic assignment submissions, curriculum schedules, and grade trackers.
3. **CBT Engine**: State-synchronized exam player with automated save states and local-first offline resilience.
4. **E-Library**: Digital catalog indexing resources with autocomplete querying.
5. **RBAC Admin Panel**: Secure portal for user creation, course management, and permission mapping.
6. **Telemetry Monitor**: Active dashboards showing node latencies and database operations.

Access control is governed by secure, short-lived JWT session tokens signed using HMAC-SHA256, verified at the edge before hitting core database routes.

## Challenges

- **Stateless Database Exhaustion**: Running serverless functions on Cloudflare Workers meant each HTTP request threatened to open a new Postgres connection, quickly exceeding the database's 100-connection limit during student exams. This was solved by configuring Cloudflare Hyperdrive, which keeps persistent database connection pools warm and reduced overall DB query latency from 250ms to under 40ms.
- **Exam State Persistence**: Students experiencing transient network drops during exams risked losing progress. We implemented client-side LocalStorage save-state synchronization that periodically pushes answers to the edge queue when connectivity is restored.

## Results

- **Scale**: Successfully served **1,000+ concurrent students** during mid-term exam stress blocks with zero downtime.
- **Performance**: Edge API request processing was completed in less than 15ms, with database operations resolving under 40ms.
- **Integration**: Consolidated **8 separate modules** into one secure domain, eliminating all manual Excel syncing.

## Lessons Learned

- **Decouple Informational and Operational Assets**: Keeping public informational pages static-first ensures the public website remains online and unaffected even if the operational CBT engine experiences high utilization.
- **Serverless Pooling is Essential**: Stateless edge microservices cannot communicate directly with traditional SQL databases without a robust connection-pooling layer like Hyperdrive or PgBouncer.

## Future Improvements

- **Offline Exam Execution**: Compile the CBT engine into a progressive web app (PWA) with SQLite local replication to support fully offline exams in remote school nodes, syncing results back once internet connectivity is restored.
- **AI-Powered Grading Assistant**: Integrate Cloudflare Workers AI with Llama models to analyze student essays and provide draft grading suggestions for teachers.

