---
title: ClinicOS
tagline: Multi-tenant Clinic Management SaaS — Live in Pakistan
category: saas
status: live
featured: true
cover: /assets/images/projects/clinicos-cover.png
gallery:
description: A full multi-tenant SaaS platform built solo from scratch for the Pakistani healthcare market. Features real-time patient queuing, billing lifecycle (Draft→Unpaid→Partial→Paid), lab orders with file uploads, WhatsApp Cloud API integration, role-based access control, and a Super Admin portal with financial analytics across all tenants.
stack:
  - React.js
  - Node.js
  - Express
  - MongoDB Atlas
  - Socket.io
  - JWT Auth
  - GridFS
  - WhatsApp Cloud API
  - Cloudflare
  - Railway
  - Vercel
live_url: https://clinicos.com.pk
github_url: https://github.com/iswzr
files:
  - label: View Live Platform
    path: https://clinicos.com.pk
date: 2025-03-01T00:00:00.000Z
order: 1
---

ClinicOS is a production-grade, multi-tenant clinic management system built entirely solo using the MERN stack. Every tenant (clinic) gets fully isolated data, their own Gmail SMTP config, real-time socket room, and branded patient portal.

Key modules built and deployed:

- Patient registration and visit management with Visit ID system (V-YYYYMMDD-XXXX)
- Real-time queue display via Socket.io room-per-tenant
- Billing lifecycle: Draft → Unpaid → Partial → Paid with overpayment rejection and soft deletes
- Lab module with internal/external tracks, GridFS file uploads, and real-time result updates
- WhatsApp Cloud API for appointment reminders and notifications
- Super Admin portal: tenant management, financial firehose, audit logs, global user management
- Patient portal: appointments, invoices, lab results, prescriptions, profile
- Per-tenant email verification via Cloudflare email routing + Gmail Send As