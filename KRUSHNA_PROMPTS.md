# JanSamadhan AI — KRUSHNA's Prompts
### Citizen Side — Home + File Complaint + Track Complaint
> Team Flowmatic | India Innovates 2026
> Run these prompts in Cursor in order. Each generates complete working code.

---

## MASTER CONTEXT
> Paste this at the start of EVERY new Cursor session.

```
You are building JanSamadhan AI — an AI-powered civic complaint management system for Municipal Corporation of Delhi (MCD). Built for India Innovates 2026 hackathon by Team Flowmatic.

TECH STACK:
- Frontend: React.js (Vite)
- Database: Firebase Firestore
- Auth: Firebase Authentication (Email/Password)
- Hosting: Firebase Hosting
- Styling: Tailwind CSS

SYSTEM OVERVIEW:
JanSamadhan AI allows Delhi citizens to file complaints (potholes, garbage, water leakage, streetlights, sanitation) and track them in real-time. Each complaint is auto-assigned a unique tracking ID, a ward, and a priority level.

FIRESTORE COLLECTIONS:
- complaints: { id, trackingId, name, phone, ward, category, description, priority, status, createdAt, resolvedAt }

STATUS VALUES: "Pending" → "Assigned" → "In Progress" → "Resolved"
PRIORITY VALUES: "Urgent" (24hr SLA) | "Standard" (72hr SLA)
CATEGORIES: Road & Potholes | Garbage & Sanitation | Water Leakage | Streetlight | Drainage | Other
WARDS: Connaught Place, Karol Bagh, Dwarka, Rohini, Saket, Lajpat Nagar, Janakpuri, Pitampura, Mayur Vihar, Vasant Kunj

DESIGN THEME:
- Dark theme: background #0A0A0A, primary accent #1A73E8 (blue), gold #C9A84C
- Clean, modern, government-credible UI
- Mobile responsive

IMPORTANT: Swastik is setting up the project (firebase.js, constants.js, generateId.js, folder structure). 
You will receive these files from him. Build your components assuming these imports exist:
- import { db } from '../firebase'
- import { CATEGORIES, WARDS, PRIORITIES } from '../utils/constants'
- import { generateTrackingId } from '../utils/generateId'
- import StatusBadge from '../components/StatusBadge'

Always write complete, working, copy-paste ready code. Never write partial code. Always include all imports.
```

---

## PROMPT K1 — Navbar Component
> Run this first.

```
Using the master context, build the Navbar component completely.

NAVBAR (src/components/Navbar.jsx):

DESIGN:
- Background: #0A0A0A (near black)
- Bottom border: 2px solid #C9A84C (gold)
- Fixed to top of page (sticky)
- Full width

LEFT SIDE:
- "🏙️ JanSamadhan AI" text
- "JanSamadhan" in white bold 20px
- "AI" in #1A73E8 (blue) bold 20px
- Clicking logo navigates to /

RIGHT SIDE (desktop):
- Nav links: Home | File Complaint | Track Complaint | Admin
- Each link: white text, hover turns blue #1A73E8
- Active link: blue color with blue underline
- Use React Router NavLink for active state detection
- "File Complaint" link: blue background button style (stands out)

MOBILE (hamburger menu):
- Show hamburger icon (lucide-react Menu icon) on screens smaller than md
- Hide desktop nav links on mobile
- Clicking hamburger: slide down mobile menu with all links
- Mobile menu: dark background, links stacked vertically
- Clicking any mobile link closes the menu

Write complete working component with all imports including useLocation for active states.
```

---

## PROMPT K2 — Footer Component
> Run after K1.

```
Using the master context, build the Footer component completely.

FOOTER (src/components/Footer.jsx):

DESIGN:
- Background: #111111
- Gold top border: 2px solid #C9A84C
- Padding: generous top and bottom

THREE COLUMN LAYOUT (desktop), stacked on mobile:

LEFT COLUMN:
- "🏙️ JanSamadhan AI" logo (same style as navbar)
- Tagline: "Empowering 20 Million Delhi Citizens"
- Small description: "AI-powered civic complaint management for Municipal Corporation of Delhi"

MIDDLE COLUMN:
- Heading: "Quick Links" in gold
- Links: Home, File Complaint, Track Complaint, Admin Portal
- Each link in gray, hover turns white
- Use React Router Link

RIGHT COLUMN:
- Heading: "About" in gold  
- "Built for India Innovates 2026"
- "Municipal Corporation of Delhi"
- "Bharat Mandapam, New Delhi"
- "28 March 2026"

BOTTOM BAR:
- Thin gold line divider
- "© 2026 JanSamadhan AI — Team Flowmatic | CSMSS College of Engineering"
- Centered, small gray text

Write complete working component with all imports.
```

---

## PROMPT K3 — Home Page
> Run after K2.

```
Using the master context, build the complete Home page.

HOME PAGE (src/pages/Home.jsx):
Import and use Navbar at top and Footer at bottom of page.

SECTION 1 — HERO:
- Full viewport height dark section
- Background: #0A0A0A with subtle grid pattern (use CSS)
- Centered content:
  - Small badge above headline: "🏆 India Innovates 2026 | Digital Democracy"
  - Big headline (48px bold white): "Delhi's Civic Complaint System — Reimagined"
  - Subheadline (18px gray): "File complaints, track resolution, hold officers accountable. Powered by AI."
  - Two CTA buttons side by side:
    1. "📝 File a Complaint" — blue background #1A73E8, white text, rounded
    2. "🔍 Track Your Complaint" — transparent with white border, white text, rounded
  - Both use React Router Link to /file-complaint and /track

SECTION 2 — STATS BAR:
- Dark card background #111111
- 4 stats in a row (2x2 grid on mobile):
  1. "20M+" — "Delhi Citizens" 
  2. "272" — "Wards Covered"
  3. "24hr" — "Urgent SLA"
  4. "Real-Time" — "Live Tracking"
- Numbers in large blue text, labels in gray

SECTION 3 — HOW IT WORKS:
- Section heading: "How It Works" centered
- 4 steps in a row (2x2 on mobile):
  Step 1: 📝 "File Complaint" — "Submit via web in Hindi or English"
  Step 2: 🤖 "AI Classification" — "Auto-assigned to correct ward officer instantly"  
  Step 3: 📍 "Track Progress" — "Real-time status updates with tracking ID"
  Step 4: ✅ "Resolution Proof" — "Photo confirmation sent on completion"
- Each step: number badge, icon, title, description
- Connected with arrows between steps on desktop

SECTION 4 — COMPLAINT CATEGORIES:
- Section heading: "What Can You Report?" centered
- 6 category cards in 3x2 grid:
  🛣️ Road & Potholes | 🗑️ Garbage & Sanitation | 💧 Water Leakage
  💡 Streetlight | 🌊 Drainage | 📋 Other Issues
- Each card: dark background, hover lifts with blue border glow
- Clicking any card navigates to /file-complaint

SECTION 5 — CTA BANNER:
- Blue gradient background
- "Ready to Report an Issue?"
- "Join thousands of Delhi citizens making their city better"
- Big "File Your Complaint Now →" button (white background, blue text)

Write complete working page. All sections must be visually distinct and professional.
```

---

## PROMPT K4 — File Complaint Page
> Run after K3.

```
Using the master context, build the File Complaint page completely.

FILE COMPLAINT PAGE (src/pages/FileComplaint.jsx):
Import and use Navbar at top and Footer at bottom.

PAGE HEADER:
- "📝 File a Complaint" heading
- Breadcrumb: Home > File Complaint
- Subtext: "Your complaint will be assigned a unique tracking ID and forwarded to the concerned ward officer"

TWO COLUMN LAYOUT (desktop), single column (mobile):
LEFT COLUMN (form — 60% width):

FORM FIELDS in order:
1. Full Name — text input, required, placeholder "Enter your full name"
2. Phone Number — tel input, required, 10 digit validation, placeholder "10-digit mobile number"
3. Select Ward — dropdown using WARDS from constants, required, placeholder "Select your ward"
4. Complaint Category — dropdown using CATEGORIES from constants, required, placeholder "Select category"
5. Priority — two radio button cards side by side:
   - "🚨 Urgent" card — red border when selected, shows "Resolution within 24 hours"
   - "📋 Standard" card — gray border when selected, shows "Resolution within 72 hours"
6. Complaint Description — textarea, required, min 20 characters
   - Show live character count "X / 500 characters"
   - Red if under 20, green if 20+
7. Location Details — text input, optional, placeholder "Street name, landmark, sector number"

SUBMIT BUTTON:
- Full width blue button "Submit Complaint →"
- Show spinner + "Submitting..." while saving
- Disabled while submitting

ON SUBMIT:
1. Validate all required fields, show inline errors below each field
2. Generate tracking ID using generateTrackingId()
3. Save to Firestore "complaints" collection:
   { trackingId, name, phone, ward, category, description, priority, status: "Pending", createdAt: serverTimestamp(), resolvedAt: null }
4. On success: show SUCCESS SCREEN (replace form, don't navigate):
   - Big green checkmark animation
   - "Complaint Filed Successfully! 🎉"
   - Tracking ID in large highlighted box with copy button
   - "Save this ID — you'll need it to track your complaint"
   - SLA info: "Expected resolution: X hours based on priority"
   - Two buttons: "Track This Complaint" (goes to /track with ID pre-filled) and "File Another"

RIGHT COLUMN (info panel — 40% width):
- "Why File Online?" section with 3 benefits
- "What Happens Next?" timeline showing 4 steps
- "Need Help?" section with MCD helpline 155305

Write complete working component with all Firestore imports and validation logic.
```

---

## PROMPT K5 — Track Complaint Page
> Run after K4. This is the most impactful citizen-facing page.

```
Using the master context, build the Track Complaint page completely.

TRACK COMPLAINT PAGE (src/pages/TrackComplaint.jsx):
Import and use Navbar at top and Footer at bottom.

PAGE HEADER:
- "🔍 Track Your Complaint" heading
- Subtext: "Enter your tracking ID to see real-time status"

SEARCH SECTION:
- Large centered search box
- Input: placeholder "Enter tracking ID (e.g. JS-20260312-4752)"
- Blue search button with search icon
- Also check URL params — if /track?id=JS-20260312-4752 then auto-search on page load
- Query Firestore: complaints where trackingId == input value

LOADING STATE:
- Spinner with "Searching for your complaint..."

NOT FOUND STATE:
- Red icon + "No complaint found with this ID"
- "Please check your tracking ID and try again"
- "File a new complaint" link

COMPLAINT FOUND — show complaint card:

TOP SECTION of card:
- Tracking ID prominent (JS-XXXXXX-XXXX in large monospace font)
- Status badge (large, color coded)
- Priority badge
- Filed date formatted as "12 March 2026, 3:45 PM"

PROGRESS STEPPER (horizontal):
4 steps: Pending → Assigned → In Progress → Resolved
- Completed steps: filled blue circle with checkmark
- Current step: pulsing blue circle
- Future steps: empty gray circle
- Lines between steps: blue if completed, gray if not

SLA SECTION:
- Show SLA deadline based on priority and createdAt
- If NOT resolved AND past deadline: red warning box "⚠️ SLA Breached — This complaint is overdue. It has been escalated to senior officer."
- If NOT resolved AND within deadline: green box showing "⏱️ Time Remaining: Xhrs Ymins"
- If resolved: green box "✅ Resolved in X hours Y minutes"

COMPLAINT DETAILS section:
- Category with icon
- Ward name
- Description (full text)
- Location details if provided
- Name (first name only for privacy, e.g. "Swastik B.")

RESOLVED STATE (if status == Resolved):
- Big green banner "✅ Your complaint has been resolved!"
- Resolution time shown
- "Rate your experience" — 5 star buttons (just UI, no backend needed)

Write complete working component. Handle all edge cases.
```

---

## KRUSHNA'S MERGE CHECKLIST
> Share your files with Swastik using this checklist:

```
Files to share with Swastik:
1. src/components/Navbar.jsx ✓
2. src/components/Footer.jsx ✓
3. src/pages/Home.jsx ✓
4. src/pages/FileComplaint.jsx ✓
5. src/pages/TrackComplaint.jsx ✓

Before sharing, verify:
- All files use: import { db } from '../firebase' (not a local firebase file)
- All files use: import { CATEGORIES, WARDS } from '../utils/constants'
- No hardcoded firebase config in your files
- npm run dev works without errors on your machine
- All 3 pages show Navbar and Footer
- Dark theme consistent (#0A0A0A background)
- Mobile responsive on all pages

Share via: Copy files into shared folder OR push to same GitHub branch
```

---

## QUICK REFERENCE
**Your pages:** Home, FileComplaint, TrackComplaint, Navbar, Footer
**Swastik's pages:** AdminLogin, AdminDashboard, Firebase setup, Deploy
**Tracking ID Format:** JS-YYYYMMDD-XXXX
**Your prompts order:** K1 → K2 → K3 → K4 → K5 → Share with Swastik

**If Cursor truncates:** Say "Continue writing the rest of the component, don't repeat what you wrote"
**If styling looks wrong:** Say "Fix the styling to match dark theme: background #0A0A0A, accent #1A73E8 blue, gold #C9A84C"
**If Firebase errors:** Say "Fix firebase import — use: import { db } from '../firebase' and import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'"

---
*Krushna — Frontend Lead | Team Flowmatic | India Innovates 2026*
