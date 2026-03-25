# 🏙️ JanSamadhan AI
### AI-Powered Public Service CRM for Municipal Corporations

> Submitted for **India Innovates 2026** | Domain: Digital Democracy  
> Team: **Flowmatic** | Problem Statement: Smart Public Service CRM (PS-CRM)

---

## 🔗 Live Demo

**🌐 https://jan-samadhan-ai.vercel.app/**

**Admin Demo Credentials:**
- Email: `admin@jansamadhan.com`
- Password: `Admin@1234`

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

- 🤖 **AI auto-classifies** complaint type and priority instantly using Groq LLM
- 🔖 Every complaint gets a **unique tracking ID** — track status anytime
- ⏱️ **SLA timer auto-starts** — 24hrs for urgent, 72hrs for standard
- 🚨 Missed deadline → **auto-escalates** to Senior Ward Officer
- 📸 **Before & After photo proof** — citizen uploads issue photo, officer uploads resolution proof
- 📱 **Phone number lookup** — lost your tracking ID? Find complaints by mobile number
- 📊 **Real-time ward analytics dashboard** for MCD leadership

---

## ✅ Features Built

| Feature | Status |
|---------|--------|
| AI complaint classification (Groq LLM) | ✅ Live |
| Unique tracking ID generation | ✅ Live |
| SLA enforcement — 24hr urgent / 72hr standard | ✅ Live |
| Auto-escalation when SLA breached | ✅ Live |
| Before/After photo proof (Cloudinary) | ✅ Live |
| Phone number lookup for lost tracking ID | ✅ Live |
| Real-time ward analytics dashboard | ✅ Live |
| Admin login with demo credentials | ✅ Live |

---

## 🔮 Future Roadmap

| Feature | Description |
|---------|-------------|
| WhatsApp / SMS Intake | Citizens file complaints via WhatsApp or SMS using Twilio API |
| Field Worker Mobile App | On-ground officers receive tasks, update status, upload proof from mobile |
| Google Maps Ward Heatmap | Visual complaint density map across all 272 wards |
| Full Hindi NLP | Dedicated Hindi language model for complaint classification |
| Citizen WhatsApp Notifications | Auto-notify citizens at every status change via WhatsApp |
| Multi-city Expansion | Configurable for any municipal corporation — Mumbai, Pune, Chennai |
| Officer Hierarchy Management | Multi-level escalation chain with configurable org structure |

---

## ⚡ Features & USP

| Feature | MCD311 (Existing) | JanSamadhan AI |
|---------|-------------------|----------------|
| Complaint Routing | Manual, slow | ✅ AI auto-assigns in seconds |
| SLA Enforcement | None | ✅ Hard deadlines + auto-escalation |
| Resolution Proof | No verification | ✅ Before & After photo confirmation |
| Language Support | English only | ✅ Hindi + English supported |
| Performance Data | No dashboard | ✅ Real-time ward accountability map |
| Lost Tracking ID | No recovery | ✅ Phone number lookup |

**Core USP:** First complaint system where MCD leadership can see in real-time which ward officer is performing and which is not — creating accountability at every level, not just at the top.

---

## 🔁 System Architecture

```
Citizen Input Layer
[Web Portal]
          ↓
AI Classification Engine (Groq LLM)
[Auto-tags complaint type, priority, ward]
          ↓
Task Assignment Module
[Maps complaint → correct ward officer]
          ↓
SLA & Escalation Engine
[Timer starts → missed deadline → auto-escalates]
          ↓
Admin Dashboard (MCD Command Center)
[Real-time complaints, SLA tracking, analytics]
          ↓
Citizen Tracking
[Unique ID + Phone lookup + Before/After proof]
```

---

## 🛠️ Tech Stack

| Technology | Role |
|------------|------|
| React.js + Vite | Web portal + Admin dashboard frontend |
| Firebase Firestore | Real-time complaint database |
| Firebase Auth | Admin authentication |
| Firebase Hosting | Production deployment |
| Groq API (llama-3.1-8b-instant) | AI complaint classification |
| Cloudinary | Before/After photo storage |
| Tailwind CSS | UI styling |
| Recharts | Analytics charts |

---

## 🗂️ Project Structure

```
JanSamadhan-AI/
├── public/
├── src/
│   ├── components/
│   │   ├── ComplaintCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StatusBadge.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── FileComplaint.jsx
│   │   ├── Home.jsx
│   │   └── TrackComplaint.jsx
│   ├── services/
│   │   └── geminiClassifier.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── generateId.js
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── dist/
├── .firebaserc
├── .gitignore
├── firebase.json
├── firestore.rules
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Swastik-4752/JanSamadhan-AI.git
cd JanSamadhan-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add: VITE_GROQ_API_KEY, Firebase config keys

# Run development server
npm run dev
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
| Swastik Bankar | Project Lead + Full Stack + AI Integration | CSMSS College of Engineering, Chh. Sambhajinagar |
| Krushna Dodke | Frontend Development + UI/UX Design | CSMSS College of Engineering, Chh. Sambhajinagar |
| Chetan Pise | Research + Documentation + Testing | CSMSS College of Engineering, Chh. Sambhajinagar |
| Pralhad Tathe | Research + Documentation + Testing | CSMSS College of Engineering, Chh. Sambhajinagar |

---

## 📎 References

- [MCD Official Portal](https://mcdonline.nic.in)
- [Groq API](https://groq.com)
- [Firebase](https://firebase.google.com)
- [Cloudinary](https://cloudinary.com)
- [Twilio WhatsApp API](https://twilio.com/whatsapp)
- [Google Maps Platform](https://developers.google.com/maps)

---

*Built for India Innovates 2026 | Municipal Corporation of Delhi | Bharat Mandapam, New Delhi*