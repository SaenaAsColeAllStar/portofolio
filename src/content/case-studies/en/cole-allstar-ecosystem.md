---
title: "ColeAllStar Ecosystem"
excerpt: "A structured case study on building a resilient home-lab and cloud hypervisor system with outbound tunnels, automated backups, and integrated telemetries."
projectSlug: "cole-allstar-ecosystem"
role: "Lead Systems Architect & Administrator"
year: 2026
summary: "This case study details the implementation of a secure virtualized environment utilizing Proxmox VE, Docker Compose, and Cloudflare Tunnels to host private development operations."
problem: "Hosting internal development services (such as databases, auth engines, script managers, and backup pools) without open inbound router ports, while keeping resource usage low, alerts active, and configuration drifts minimized."
requirements:
  - "Orchestrate 12+ isolated application environments."
  - "Enforce MFA and zero-trust policies for all inbound service administration."
  - "Implement automated, self-healing backups to off-site cloud storage."
  - "Monitor host and container performance with Prometheus and Grafana dashboards."
constraints:
  - "Must run on low-power, consumer-grade bare-metal hardware nodes."
  - "Must achieve high availability without paid enterprise hypervisor subscriptions."
  - "Backup intervals must not congest household network traffic."
architecture: "A bare-metal Proxmox VE hypervisor running separate Debian Linux virtual machines for compute and container runtimes. Applications are deployed via Docker Compose with networking locked to a private local bridge. Inbound traffic is handled by secure outbound-only Cloudflare Tunnels authenticated through Google Workspace SSO."
decisions:
  - "Chose Proxmox VE over ESXi for open-source flexibility and lightweight KVM operations."
  - "Utilized Cloudflare Tunnels to bypass CGNAT and avoid opening any ports on the router."
  - "Decoupled databases into dedicated VMs to isolate storage IO bottlenecks from other container runs."
results:
  - "Successfully consolidated 12 separate services into a single managed node."
  - "Reduced security attack surface to zero open incoming IPv4/IPv6 ports."
  - "Automated daily incremental backups with Telegram/Discord alerts on status."
metrics:
  "Private Service Availability": "99.98%"
  "Inbound Open Ports": 0
  "VM Recovery Time": "15 Minutes"
  "Backup Failure Rate": "0%"
lessons:
  - "Outbound tunnels are extremely robust for bypassing CGNAT and ensuring dynamic DNS is irrelevant."
  - "Infrastructure as Code (Docker files and compose specs in git) is vital for recreating nodes from scratch."
---

## Overview

The ColeAllStar Ecosystem is a unified home-lab and cloud infrastructure platform designed to host critical applications, automate development processes, run recurring scripts, and manage server telemetry. It acts as the core backend hub for SaenaAsColeAllStar's personal projects and testing operations.

## Problem

Managing several distinct software servers across physical devices and virtual private servers created significant maintenance friction. Core utilities (like secure data vaults, testing APIs, search engines, and cron jobs) were scattered across separate machines. Opening ports on home routers to expose these utilities presented severe security liabilities, and backups were manually triggered and prone to silent corruption.

## Requirements

1. **Service Consolidation**: Integrate all private applications onto a central virtualization host.
2. **Zero Inbound Ports**: Allow remote access without exposing home IP addresses or configuring dynamic DNS.
3. **Automated Disaster Recovery**: Run automated nightly backups with state verification and remote cloud retention.
4. **Active Alerting**: Collect node and container performance statistics and trigger real-time alerts upon high memory or disk load anomalies.

## Architecture

We built a multi-layered virtualization architecture:
- **Hypervisor Layer**: Bare-metal installation of Proxmox VE (Virtual Environment) manages hardware resources.
- **Compute Layer**: Isolated Debian VM instances run container engines (Docker and Docker Compose) to encapsulate microservice code.
- **Secure Networking Layer**: Cloudflare Tunnels run local daemons that establish outbound TCP connections to the closest Cloudflare edge node. Visitors access services via public hostnames authenticated through Zero Trust access policies.
- **Observability Layer**: A Prometheus instance polls resource exporters (Node Exporter, Cadvisor) and surfaces metrics in Grafana dashboards.

## Implementation

The system is defined using declarative configuration:
1. **Host Orchestration**: Virtual machines are created with specific CPU/RAM allocations and disk limits in Proxmox.
2. **Container Composition**: Services are configured via `docker-compose.yml` structures, utilizing environment files and named volume mounts.
3. **Pipelined Backups**: Cron scripts trigger `restic` backup operations daily, encrypting data blocks before pushing them to S3-compatible cloud vaults.
4. **Access Control**: Cloudflare Access policies restrict domain access to verified email addresses, prompting for one-time pins (OTP) or OAuth validation.

## Challenges

- **Network Address Translation (CGNAT)**: The ISP network uses Carrier-Grade NAT, making traditional port forwarding impossible. Implementing outbound-only Cloudflare Tunnels completely resolved this, allowing clean sub-domain mapping without routing changes.
- **Silent Disk Failures**: Consumer-grade SSDs in home-labs can fail silently due to write wear. We configured S.M.A.R.T. monitoring daemons that trigger instant warning alerts when drive block allocations start degradation, prompting proactive hardware swaps.

## Results

- **Scale**: Consolidated **12 active applications** under one centralized hypervisor dashboard.
- **Uptime**: Achieved **99.98% private service availability** over a 12-month evaluation window.
- **Security**: Closed all **inbound router ports**, shifting the entire perimeter protection to Cloudflare's edge CDN.

## Lessons Learned

- **Decouple Storage and Compute**: Separating databases from other stateless application runtimes prevents container thrashing and disk IO starvation.
- **Always Encrypt Backups**: Backups stored on third-party cloud providers must be client-side encrypted before transfer, preserving data privacy in the event of provider security breaches.

## Future Improvements

- **Infrastructure as Code**: Migrate VMs and container setups to Terraform or Ansible playbooks for complete repository-driven automation.
- **Local Kubernetes Migration**: Transition Docker Compose files into a lightweight K3s cluster to test high-availability failovers.
