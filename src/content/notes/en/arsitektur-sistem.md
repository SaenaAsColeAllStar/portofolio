---
title: "Edge Caching & Database State Coordination"
excerpt: "Practical insights on coordinating stateless serverless runtimes with centralized relational databases."
category: "Cloudflare Notes"
tags: ["Edge Computing", "PostgreSQL", "Cloudflare Hyperdrive"]
publishedAt: "2026-02-10"
---

# Edge Caching & Database State Coordination

When building high-concurrency systems using serverless edge runtimes (like Cloudflare Workers), developers often face the "stateless DB connection bottleneck." Because edge runtimes scale horizontally by spawning hundreds of isolated sandboxes, traditional relational databases (such as PostgreSQL) quickly run out of available connection slots.

## The Real-world Scenario

During the mid-term exams block for the **SMK Teknovo Ecosystem**, over 1,000 students were hitting the computer-based testing (CBT) engine at the exact same second. The default PostgreSQL connection pool of 100 was exhausted in less than 3 seconds, throwing `500 Internal Server Error` database connection timeouts.

## The Solution: Edge-native Pooling

To resolve this without provisioning a massive database server, we routed all database operations through **Cloudflare Hyperdrive**. 

Hyperdrive acts as an edge-aware connection pooler. It keeps connection pools warm near the edge workers, reusing connections across workers.

### Architectural Impact

1. **Latency Reduction**: Connection setup time dropped from **250ms to under 40ms**.
2. **Resource Preservation**: Database connection count stabilized below **35 concurrent active connections**, even under 1,000+ client loads.
3. **Observation**: Connection handshakes are the primary performance sink in serverless databases. Keep connections warm at the edge.
