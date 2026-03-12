# JanSamadhan AI — SWASTIK's Prompts
### Firebase Setup + Admin Side + Deploy
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
JanSamadhan AI allows Delhi citizens to file complaints (potholes, garbage, water leakage, streetlights, sanitation) and track them in real-time. Each complaint is auto-assigned a unique tracking ID, a ward, and a priority level. An admin dashboard shows ward-level complaint data, resolution rates, and officer performance.

TWO SIDES:
1. CITIZEN SIDE — File complaint, get tracking ID, track status (Krushna building this)
2. ADMIN SIDE — View all complaints, update status, see ward-level analytics (Swastik building this)

FIRESTORE COLLECTIONS:
- complaints: { id, trackingId, name, phone, ward, category, description, priority, status, createdAt, resolvedAt }
- wards: { id, name, zone, officerName, totalComplaints, resolved, pending }

STATUS VALUES: "Pending" → "Assigned" → "In Progress" → "Resolved"
PRIORITY VALUES: "Urgent" (24hr SLA) | "Standard" (72hr SLA)
CATEGORIES: Road & Potholes | Garbage & Sanitation | Water Leakage | Streetlight | Drainage | Other
WARDS: Connaught Place, Karol Bagh, Dwarka, Rohini, Saket, Lajpat Nagar, Janakpuri, Pitampura, Mayur Vihar, Vasant Kunj

DESIGN THEME:
- Dark theme: background #0A0A0A, primary accent #1A73E8 (blue), gold #C9A84C
- Clean, modern, government-credible UI
- Mobile responsive

Always write complete, working, copy-paste ready code. Never write partial code. Always include all imports.
```

---

## PROMPT S1 — Full Project Setup
> Run this first. Sets up entire project that Krushna will also use.

```
Using the master context above, set up a brand new Vite React project called "jansamadhan-ai".

Do ALL of the following completely:

1. Create Vite React project and install ALL these dependencies:
   - firebase
   - react-router-dom
   - tailwindcss @tailwindcss/forms autoprefixer postcss
   - react-hot-toast
   - lucide-react
   - recharts
   - date-fns

2. Set up Tailwind CSS completely — create tailwind.config.js and postcss.config.js with correct content paths.

3. Create src/firebase.js:
   - Initialize Firebase app
   - Export db (Firestore)
   - Export auth (Firebase Authentication)
   - Config placeholders I will replace:
     apiKey: "YOUR_API_KEY"
     authDomain: "YOUR_AUTH_DOMAIN"
     projectId: "YOUR_PROJECT_ID"
     storageBucket: "YOUR_STORAGE_BUCKET"
     messagingSenderId: "YOUR_SENDER_ID"
     appId: "YOUR_APP_ID"

4. Create src/utils/constants.js with:
   - CATEGORIES = ["Road & Potholes", "Garbage & Sanitation", "Water Leakage", "Streetlight", "Drainage", "Other"]
   - STATUSES = ["Pending", "Assigned", "In Progress", "Resolved"]
   - PRIORITIES = ["Urgent", "Standard"]
   - WARDS = ["Connaught Place", "Karol Bagh", "Dwarka", "Rohini", "Saket", "Lajpat Nagar", "Janakpuri", "Pitampura", "Mayur Vihar", "Vasant Kunj"]

5. Create src/utils/generateId.js:
   - Generate tracking IDs in format: JS-YYYYMMDD-XXXX where XXXX is random 4 digit number
   - Example output: JS-20260312-4752

6. Create src/App.jsx with React Router setup:
   / → Home (placeholder for now)
   /file-complaint → FileComplaint (placeholder)
   /track → TrackComplaint (placeholder)
   /admin → AdminLogin
   /admin/dashboard → AdminDashboard (wrapped in ProtectedRoute)

7. Create this exact folder structure with empty placeholder files:
   src/
   ├── firebase.js
   ├── App.jsx
   ├── main.jsx
   ├── index.css
   ├── pages/
   │   ├── Home.jsx
   │   ├── FileComplaint.jsx
   │   ├── TrackComplaint.jsx
   │   ├── AdminLogin.jsx
   │   └── AdminDashboard.jsx
   ├── components/
   │   ├── Navbar.jsx
   │   ├── Footer.jsx
   │   ├── ComplaintCard.jsx
   │   ├── StatusBadge.jsx
   │   └── ProtectedRoute.jsx
   └── utils/
       ├── generateId.js
       └── constants.js

8. Create src/components/StatusBadge.jsx:
   - Takes status prop
   - Returns color coded badge:
     Pending = yellow, Assigned = blue, In Progress = orange, Resolved = green
   - Also handle Priority badges: Urgent = red, Standard = gray

Write every single file completely. Project must run with npm run dev after this.
```

---

## PROMPT S2 — Admin Login + Protected Route
> Run after S1 is complete and project runs.

```
Using the master context, build Admin Login and Protected Route completely.

PROTECTED ROUTE (src/components/ProtectedRoute.jsx):
- Import onAuthStateChanged from firebase/auth
- Import auth from firebase.js
- Use useEffect + useState to track auth state
- If loading: show full screen dark loading spinner with "JanSamadhan AI" text
- If user logged in: render children components
- If user not logged in: redirect to /admin using React Router Navigate
- Export as default

ADMIN LOGIN PAGE (src/pages/AdminLogin.jsx):
- Full dark screen with centered card
- Card has gold top border accent
- Header: "🔐 Admin Portal" in white bold
- Subheader: "JanSamadhan AI — MCD Command Center" in gray
- MCD badge below subheader
- Email input with label (dark themed)
- Password input with label + show/hide toggle button (eye icon from lucide-react)
- "Sign In" button — blue background, full width
- Loading spinner inside button while authenticating
- Error message shown in red box below button if login fails
- Use Firebase signInWithEmailAndPassword
- On success: navigate to /admin/dashboard using useNavigate
- If already logged in: auto redirect to /admin/dashboard

SEED ADMIN USER:
- At bottom of AdminLogin.jsx add this comment with instructions:
  "To create admin user: Go to Firebase Console → Authentication → Add User → email: admin@jansamadhan.com password: Admin@1234"

Write complete working code with all imports.
```

---

## PROMPT S3 — Admin Dashboard
> Run after S2 is complete. Most important prompt.

```
Using the master context, build the complete Admin Dashboard.

ADMIN DASHBOARD (src/pages/AdminDashboard.jsx):

HEADER BAR:
- Dark background with gold bottom border
- Left: "📊 MCD Command Center" title
- Right: logged in user email + "Logout" button (red, uses Firebase signOut, redirects to /admin)
- Below header: live date and time updating every second

STATS ROW (4 cards in a grid):
Fetch from Firestore complaints collection and show:
- Total Complaints (count all documents)
- Pending (count where status == "Pending")  
- In Progress (count where status == "Assigned" OR "In Progress")
- Resolved Today (count where status == "Resolved" AND resolvedAt is today's date)
Each card: dark background, colored icon, big number, label below

FILTER BAR:
- Three dropdowns side by side: Filter by Status | Filter by Category | Filter by Ward
- Search input: search by tracking ID (partial match)
- "Clear Filters" button
- All filters work together to filter the complaints table below

COMPLAINTS TABLE:
- Use Firestore onSnapshot for real-time updates
- Columns: Tracking ID | Name | Category | Ward | Priority | Status | Filed | SLA | Action
- SLA column logic:
  - Urgent complaints: SLA = 24 hours from createdAt
  - Standard complaints: SLA = 72 hours from createdAt
  - If current time > SLA deadline AND status != Resolved: show "⚠️ Breached" in red
  - If status == Resolved: show "✅ Met" in green
  - Otherwise: show time remaining (e.g. "14hr left") in yellow
- Action column: dropdown select to change status
  - Options: Pending, Assigned, In Progress, Resolved
  - On change: update Firestore document status field
  - If changed to Resolved: also set resolvedAt = current timestamp
  - Show loading state on that row while updating
- Priority badges: Urgent=red pill, Standard=gray pill
- Status badges: use StatusBadge component
- Horizontal scroll on mobile
- Empty state: "No complaints found" message

ANALYTICS SECTION (below table):
Title: "Ward & Category Analytics"
Two charts side by side using recharts:

Chart 1 — Bar chart "Complaints by Category":
- X axis: category names
- Y axis: complaint count
- Blue bars
- Calculate counts from complaints data

Chart 2 — Bar chart "Top Wards by Complaints":
- X axis: ward names
- Y axis: complaint count  
- Gold bars
- Show top 5 wards only

Both charts: dark background, white axis labels, tooltips enabled, responsive container

SEED DATA BUTTON:
- Small button "Load Sample Data" in corner
- On click: run seedData function that adds 15 sample complaints to Firestore:
  - Mix of all categories, wards, statuses, priorities
  - Some with createdAt set to 5 days ago (to show SLA breached)
  - Realistic Hindi-English descriptions like "Badi pothole hai Rohini sector 5 mein, 2 hafte se fix nahi hua"
  - Show toast notification when done

Write the complete file with all imports, all Firestore logic, all recharts code. No truncation.
```

---

## PROMPT S4 — Firebase Config + Deploy
> Run this last after everything is working.

```
Using the master context, do these final steps:

1. FIRESTORE SECURITY RULES:
Write complete Firestore security rules (firestore.rules file):
- Anyone can read complaints (for tracking)
- Anyone can create complaints (for filing)  
- Only authenticated users can update complaints (for admin)
- Only authenticated users can read/write wards collection
- Deny all other access

2. FIREBASE.JSON:
Create firebase.json for hosting with:
- public directory: dist
- Single page app rewrites (all routes → index.html)
- Ignore node_modules and .git

3. .FIREBASERC:
Create .firebaserc with project ID placeholder:
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}

4. ENVIRONMENT CHECK:
Check all files for any remaining placeholder text like "YOUR_" and list them so I can replace with real values.

5. EXACT DEPLOY COMMANDS:
Write the exact terminal commands in order to:
- npm run build
- firebase login
- firebase init (with exact options to select)
- firebase deploy
- Get the live hosted URL

6. POST DEPLOY CHECKLIST:
Write a checklist of things to verify after deploy:
- Can file a complaint
- Tracking ID works
- Admin login works (admin@jansamadhan.com / Admin@1234)
- Dashboard shows real-time data
- Charts render
- Mobile responsive

Write everything completely.
```

---

## SWASTIK'S MERGE CHECKLIST
> After Krushna finishes his part, merge using this:

```
Krushna has built these files separately:
- src/pages/Home.jsx
- src/pages/FileComplaint.jsx  
- src/pages/TrackComplaint.jsx
- src/components/Navbar.jsx
- src/components/Footer.jsx

Merge his files into our project:
1. Copy his files into correct folders
2. Make sure all imports are consistent (same firebase.js path, same constants.js)
3. Make sure Navbar and Footer are used on ALL pages
4. Test all routes work together
5. Fix any import conflicts or duplicate component names
6. Make sure dark theme is consistent across all pages
7. Run npm run dev and fix any errors shown in console

List all errors found and fix them one by one.
```

---

## QUICK REFERENCE
**Firebase Console:** console.firebase.google.com
**Admin Login:** admin@jansamadhan.com / Admin@1234
**Tracking ID Format:** JS-YYYYMMDD-XXXX
**Your prompts order:** S1 → S2 → S3 → S4 → Merge

**If Cursor truncates code:** Say "Continue from where you stopped, write the rest completely"
**If something breaks:** Say "Fix this error: [paste console error]"
**If UI looks off:** Say "Fix the styling, keep dark theme #0A0A0A background, blue #1A73E8 accent"

---
*Swastik — Project Lead | Team Flowmatic | India Innovates 2026*
