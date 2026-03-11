# 🏙️ JanSamadhan AI
### AI-Powered Public Service CRM for Municipal Corporations

> Submitted for **India Innovates 2026** | Domain: Digital Democracy  
> Team: **Flowmatic** | Problem Statement: Smart Public Service CRM (PS-CRM)

---

## 🔴 The Problem

Delhi's 20 million citizens file lakhs of complaints daily — potholes, broken streetlights, garbage overflow, water leakage. MCD already has the MCD311 app, helpline 155305, and an online portal. Yet complaints die silently.

| Metric | Reality |
|--------|---------|
| MCD Zones | 12 |
| Wards | 272 |
| Employees | 1.5 Lakh+ |
| Complaint resolution transparency | ❌ None |
| Auto-assignment to officers | ❌ None |
| SLA enforcement | ❌ None |
| Ward-level accountability data | ❌ None |

**This isn't a technology gap. It's a governance accountability gap that technology can fix.**

---

## ✅ The Solution

**JanSamadhan AI** — India's first ward-level civic complaint intelligence system.

A centralized AI-powered command center where:

- 🗣️ Citizens file complaints via **WhatsApp, Web, or SMS** in Hindi or English
- 🤖 **AI auto-classifies** complaint type (road, water, sanitation, electricity) and assigns it to the correct ward officer instantly
- 🔖 Every complaint gets a **unique tracking ID** — citizen tracks status anytime
- ⏱️ **SLA timer auto-starts** — 24hrs for urgent, 72hrs for standard
- 🚨 Missed deadline → **auto-escalates** to senior officer
- 📊 **Ward-level performance dashboard** for MCD leadership — see which zones are resolving fastest, which are failing
- 📸 Resolution confirmed with **photo proof** sent to citizen via WhatsApp

---

## 🔁 System Architecture

```
Citizen Input Layer
[WhatsApp / Web Portal / Mobile App / SMS]
          ↓
AI Classification Engine
[NLP → auto-tags complaint type, priority, ward]
          ↓
Task Assignment Module
[Maps complaint → correct ward officer by location + category]
          ↓
SLA & Escalation Engine
[Timer starts → missed deadline → auto-escalates up hierarchy]
          ↓
Field Worker App
[Officer receives task, updates status, uploads photo proof]
          ↓
Central Dashboard (MCD Admin)
[Real-time ward-wise complaint heatmap, resolution rates, officer performance]
          ↓
Citizen Notification
[WhatsApp/SMS updates at every status change + final resolution proof]
```

---

## 🛠️ Tech Stack

| Technology | Role |
|------------|------|
| React.js | Web portal + Admin dashboard frontend |
| Node.js + Express | Backend API and workflow engine |
| PostgreSQL | Complaint records, SLA tracking, officer assignments |
| OpenAI / Gemini API | NLP complaint classification in Hindi + English |
| Twilio WhatsApp API | Citizen complaint intake and status notifications |
| Google Maps API | Ward-level geo-tagging and complaint heatmap |
| Firebase | Real-time status sync to citizen-facing interfaces |
| Clerk | Role-based auth for ward officers and admin hierarchy |

---

## ⚡ Features & USP

| Feature | MCD311 (Existing) | JanSamadhan AI |
|---------|-------------------|----------------|
| Complaint Routing | Manual, slow | ✅ AI auto-assigns in seconds |
| SLA Enforcement | None | ✅ Hard deadlines + auto-escalation |
| Field Worker App | Not available | ✅ Mobile app for on-ground officers |
| Resolution Proof | No verification | ✅ Photo upload confirmation |
| Language Support | English only | ✅ Hindi + regional language NLP |
| Performance Data | No dashboard | ✅ Real-time ward accountability map |

**Core USP:** First complaint system where MCD leadership can see in real-time which ward officer is performing and which is not — creating accountability at every level, not just at the top.

---

## 🗂️ Project Structure

```
JanSamadhan-AI/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Citizen complaint submission
│   │   │   ├── Track.jsx        # Complaint tracking by ID
│   │   │   └── Dashboard.jsx    # Admin ward-level dashboard
│   │   └── components/
├── server/                  # Node.js + Express backend
│   ├── routes/
│   │   ├── complaints.js    # Complaint CRUD + assignment
│   │   ├── officers.js      # Ward officer management
│   │   └── dashboard.js     # Analytics endpoints
│   ├── services/
│   │   ├── classifier.js    # AI classification engine
│   │   ├── sla.js           # SLA timer + escalation logic
│   │   └── notify.js        # WhatsApp/SMS notifications
│   └── db/
│       └── schema.sql       # PostgreSQL schema
└── README.md
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Swastik-4752/JanSamadhan-AI.git
cd JanSamadhan-AI

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables
cp .env.example .env
# Add your API keys: OpenAI, Twilio, Google Maps, Clerk

# Run development server
cd server && npm run dev
cd ../client && npm start
```

---

## 📊 Impact

- **20 Million** Delhi citizens directly impacted
- **272 wards** covered under one unified system
- **1.5 Lakh+** MCD employees brought into accountable workflow
- Scalable to **any municipal corporation** in India — Pune, Mumbai, Chennai, Bengaluru

---

## 👥 Team Flowmatic

| Name | Role | Institution |
|------|------|-------------|
| Swastik Bankar | Project Lead + Full Stack Development + AI Integration | CSMSS College of Engineering, Chh. Sambhajinagar |
| Krushna Dodke | Frontend Development + UI/UX Design + PPT Design | CSMSS College of Engineering, Chh. Sambhajinagar |
| Chetan Pise | Research + Documentation + Testing | CSMSS College of Engineering, Chh. Sambhajinagar |
| Pralhad Tathe | Research + Documentation + Testing | CSMSS College of Engineering, Chh. Sambhajinagar |

---

## 📎 References

- [MCD Official Portal](https://mcdonline.nic.in)
- [Twilio WhatsApp API](https://twilio.com/whatsapp)
- [Google Maps Platform](https://developers.google.com/maps)
- [OpenAI API](https://platform.openai.com)
- [Clerk Auth](https://clerk.com)
- [Firebase](https://firebase.google.com)

---

*Built for India Innovates 2026 | Municipal Corporation of Delhi | Bharat Mandapam, New Delhi*
