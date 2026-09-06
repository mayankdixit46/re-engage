# Re-Engage — Smart Email List Cleanup & Deliverability Tool

> **A smart list-cleanup tool that protects email marketers from silently poisoning their own deliverability.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Flash-8E75B2?style=flat-square)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 1. The Problem

Email marketers obsess over growing their subscriber list, but a bigger list quietly works against them. When a sender keeps emailing people who never open anything, inbox providers (Gmail, Outlook) read the low engagement as a bad-sender signal and start routing **all** of that sender's emails toward spam — including the ones people actually want.

The fix is counterintuitive: deliberately identify and remove dead-weight subscribers. **Re-Engage makes that decision easy, visual, and safe.**

---

## 2. Key Features

- 📁 **In-Browser CSV Parsing & Auto-Detection**: Instant PapaParse ingestion of CSV exports from Mailchimp, Klaviyo, ConvertKit, or ActiveCampaign with auto-column matching.
- ⚡ **1-Click Pre-Loaded Demos**: Test immediately with E-Commerce (1,200 contacts), SaaS Newsletter (850 contacts), or Creator Community (500 contacts) preset datasets.
- 🎯 **Recency & Frequency Scoring Engine**: Categorizes contacts into **Active** (<= 90d), **At-Risk** (90–180d), and **Inactive** (> 180d) with 0–100 engagement scores.
- 🎛️ **Dynamic Threshold Sliders**: Adjust cutoff thresholds live to re-cluster subscribers and metrics on the fly.
- 📈 **Before/After Deliverability Impact**: Recharts visual analytics showing clean list size, open rate boost, spam risk reduction, and monthly ESP bill savings.
- 🪄 **AI Win-Back Campaign Studio**: Uses Google Gemini API to draft 3-part re-engagement email sequences tailored to brand name, tone, and offer.
- 📥 **Cleaned CSV & Suppress Exports**: 1-click downloads for `cleaned_active_at_risk_subscribers.csv`, `sunset_inactive_suppress_list.csv`, and executive audit reports.

---

## 3. Tech Stack

| Layer | Choice |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 (Glassmorphism & Dark Mode) |
| **CSV Engine** | PapaParse |
| **Data Viz** | Recharts |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Icons** | Lucide React |

---

## 4. Quick Start

```bash
# Clone repository
git clone https://github.com/mayankdixit46/re-engage.git
cd re-engage

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Deployment on Vercel

1. Push your repository to GitHub (`mayankdixit46/re-engage`).
2. Import the project in [Vercel](https://vercel.com).
3. Set optional environment variable:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Click **Deploy**.
