# 🏢 HostelSync — Smart Campus Living & Unified Hostel Management Platform

![HostelSync](https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80)

"HostelSync is a full-stack web application built to solve daily hostel management problems. It replaces manual paper-based out-passes and messy complaint registers with a clean digital system for students, wardens, and admins."

---

   Key Architecture & Portals

```
                         HOSTELSYNC
                             │
                           LOGIN
                             │
       ┌─────────────┬───────┴───────┬──────────────┐
       ↓             ↓               ↓              ↓
    STUDENT        WARDEN          ADMIN       STAFF/SECURITY
       │             │               │              │
       ├ Dashboard   ├ Student List  ├ Users        ├─ QR Gate Scanner
       ├ Gate Pass   ├ Gate Pass     ├ Hostels      ├─ In/Out Logs
       ├ Leave       ├ Complaints    ├ Rooms        ├─ Work Orders
       ├ Complaints  ├ Attendance    ├ Mess         └─ WhatsApp Alerts
       ├ Mess        ├ Notices       ├ Complaints
       ├ Room        ├ Reports       ├ Analytics
       ├ Notices     └ WhatsApp      └ Settings
       └ Profile
```

### 1. 🎓 Student Portal
- **Dashboard**: Shows today's mess menu, active gate passes, and a curfew timer so students know exactly when they need to be back.
- **QR Gate Pass**: Students can apply for an outing pass. If approved by the warden, the app generates a secure QR code to show at the main gate.
- **Leave Requests**: A simple form to apply for multi-day leaves (going home for holidays).
- **Smart Complaints**: Students can log maintenance issues (like a broken fan or plumbing issue). I integrated the Gemini API here to automatically read the complaint and label it as 'Urgent' or 'Normal'.
- **Mess Menu & Feedback**: Check what's for breakfast/lunch/dinner and leave a quick star rating for the food quality.
- **Room Info & Digital ID**: Shows roommate details, bed allocation, and acts as a digital hostel ID card.
- **Notice Board**: A digital pinboard for hostel announcements.

### 2. 👨‍🏫 Warden Portal
- **Dashboard**: Quick stats showing how many students are currently outside the campus and a list of pending pass requests.
- **Student Directory**: A searchable list of all students with their branch, room number, and parents' emergency contact numbers.
- **Pass Approvals**: Wardens can accept or reject student outings with one click. (Includes a feature to trigger WhatsApp alerts to parents).
- **Issue Tracking**: Wardens see all student complaints sorted by the AI's urgency score and can assign them to the campus electrician or plumber.
- **Night Attendance**: A simple room-by-room digital checklist for the night roll call.
- **Broadcast Notices**: Wardens can type an announcement here, and it instantly shows up on the student notice board.

### 3. ⚙️ Admin Portal
- **Admin Overview**: High-level view of hostel occupancy, overall mess ratings, and total unresolved complaints.
- **Manage Users**: Create and manage accounts for students, wardens, and guards. This handles all the Role-Based Access Control (RBAC).
- **Hostel Blocks & Rooms**: Define total rooms, block names, and use a visual grid to assign students to specific beds.
- **Mess Manager**: A simple interface to update the weekly food menu.
- **Settings**: Change global application variables like the default hostel curfew time and the Gemini AI prompt instructions.

### 4. 🛡️ Security & Staff Portal
- **Camera QR Scanner**: A built-in HTML5 web camera scanner. Security guards just scan the student's phone at the gate to verify if their pass is valid.
- **In/Out Logging**: Automatically logs the exact timestamp when a student leaves or enters the campus.
- **Movement History**: A searchable feed for guards to quickly check who is currently outside.
- **Staff Tasks**: Maintenance staff (plumbers, electricians) get a simple screen showing their assigned tasks with a "Mark as Fixed" button.

---

## 🛠️ Built With (Tech Stack)

- **Frontend**: React.js (Vite), Tailwind CSS for styling, Recharts for dashboard graphs, and Lucide React for icons. Used `html5-qrcode` for the web camera scanner.
- **Backend**: Node.js and Express.js. Implemented secure login and Role-Based Access Control (RBAC) using JWT. Database handled via MongoDB (Mongoose).
- **External Integrations**:
  - **Gemini API**: Used to automatically read student maintenance complaints, figure out the urgency, and power a simple helper chatbot for students.
  - **WhatsApp API**: Connected to send automated text messages to parents when a student leaves or enters the campus gate.
  - **QR Code Handling**: Used `qrcode.react` to generate the passes on the student app, which are then scanned by the security guard's tablet/phone camera.

---

## 🏁 Quick Start & Running Locally

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend Concurrently
```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`

---

## 🔑 Demo Login Credentials (1-Click Login Available on UI)

| Persona | Email | Password | Role |
|---|---|---|---|
| **Student (Aarav Sharma)** | `student@hostelsync.com` | `password123` | Student |
| **Warden (Dr. Ramesh Patel)** | `warden@hostelsync.com` | `password123` | Warden |
| **Admin (Dean Student Affairs)** | `admin@hostelsync.com` | `password123` | Admin |
| **Security (Vikram Singh)** | `security@hostelsync.com` | `password123` | Staff / Security |
