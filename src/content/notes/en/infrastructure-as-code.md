---
title: "Terraform State Locking & Resilient CI/CD Dry-runs"
excerpt: "Practical troubleshooting notes on avoiding state corruption during concurrent GitHub Actions workflow runs."
category: "Infrastructure Notes"
tags: ["Terraform", "AWS", "GitHub Actions"]
publishedAt: "2026-01-15"
---

# Terraform State Locking & Resilient CI/CD Dry-runs

Managing infrastructure state within automated CI/CD pipelines (e.g., GitHub Actions) poses a serious risk: state collisions. If two separate developers merge branches concurrently, two deployment workflows might execute simultaneously, leading to state file corruption.

## The Problem: Collisions

In our early infrastructure deployments, two concurrent GitHub Actions runners ran `terraform apply` at the same time. This caused resource provisioning overrides and partially corrupted the remote S3 state file, requiring manual state recovery.

## The Solution: State Locking & Dynamic Plans

We restructured the IaC workflows to incorporate locking and isolated plan dry-runs:

1. **State Locking**: Configured DynamoDB state locking within the Terraform S3 backend blocks. This instantly rejects secondary applies with a `ResourceInUse` exception, protecting state integrity.
2. **Dynamic Dry-runs (`terraform plan`)**: Integrated pull request checks that output plan files locally. Runners utilize these plan files directly during apply steps:
   ```bash
   terraform plan -out=tfplan
   terraform apply tfplan
   ```
3. **Execution Safety**: Enforce workflow concurrency blocks using GitHub's `concurrency` groups on a per-environment basis.
