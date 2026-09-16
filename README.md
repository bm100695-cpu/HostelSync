# 🏢 HostelSync — Smart Campus Living & Unified Hostel Management Platform

![HostelSync](https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80)

HostelSync is a next-generation, full-stack hostel operations suite featuring **4 distinct role portals** (Student, Warden, Admin, Security/Staff), **Gemini AI-powered maintenance auto-triage**, **Digital QR Gate Passes with HTML5 camera scanning**, **WhatsApp Cloud API alerts**, **Night Roll Call Attendance**, and **Executive BI Analytics**.

---

## 🚀 Key Architecture & Portals

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
- **Dashboard**: Live curfew countdown, active pass status, today's 4-course mess menu, recent complaint status timeline.
- **Dynamic QR Gate Pass**: Apply for local/weekend passes with 1-click animated QR generation and curfew tracker.
- **Leave Application**: Multi-day leave requests with parent consent tracking.
- **AI-Powered Complaints**: Submit issues with Gemini AI automatic urgency scoring, technician assignment & ETA.
- **Mess Dining**: View weekly 4-course menu, rate meals with stars & reviews, meal skip rebate estimator.
- **My Room & Roommates**: View room allocation, roommate cards, bed numbers, and inventory checklist.
- **Hostel Notice Board**: Category and urgency filtered campus bulletins.
- **Digital Smart ID Card**: Verified hostel resident digital ID card with QR code.

### 2. 👨‍🏫 Warden Portal
- **Dashboard**: Overview cards, quick approval queue, and night roll call shortcuts.
- **Student Directory**: Search & filter by block, floor, room, branch, emergency contact quick-dial.
- **Gate Pass Approvals**: 1-click approve/reject with instant parent WhatsApp alert dispatch.
- **Leave Requests**: Sanction outstation leave slips.
- **Complaints & SLA**: Review Gemini AI urgency recommendations, assign electricians/plumbers.
- **Night Roll Call Attendance**: Room-by-room night roll call checklist with instant absentee alert generator.
- **Notices & WhatsApp Broadcast**: Post circulars with automatic WhatsApp broadcast to student and parent groups.
- **Reports & Export**: Gate pass statistics, maintenance turnaround times, and CSV data export.

### 3. ⚙️ Admin Portal
- **Executive BI Dashboard**: Campus occupancy %, peak traffic hours, mess satisfaction score.
- **User Management**: Add/edit/manage Students, Wardens, Guards, and Staff with RBAC.
- **Hostel Blocks**: Manage building capacities, floors, and assigned wardens.
- **Room Allocation Matrix**: Interactive room occupancy grid with bed assignments.
- **Mess & Catering Manager**: Edit weekly meals (Breakfast, Lunch, Snacks, Dinner) and pricing.
- **Master Complaint SLA Tracker**: Track pending resolution times and staff performance.
- **System Settings**: WhatsApp templates, Gemini AI prompt tuning, hostel curfew times, academic year config.

### 4. 🛡️ Security & Staff Portal
- **Live QR Gate Pass Scanner**: Web camera QR scanner to scan student gate passes at the gate + 1-click demo test buttons.
- **Gate In/Out Check**: Real-time validation with automated parent WhatsApp alert dispatch.
- **Security In/Out Log**: Real-time feed of all student movements with search & timestamp filters.
- **Staff Maintenance Work Orders**: Assigned plumbing, electrical, carpentry tasks with "Mark as Fixed".

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, HTML5-QRCode Scanner, QRCode.React, Canvas Confetti.
- **Backend**: Node.js, Express, JWT Authentication, Role-Based Access Control (RBAC), Mongoose / In-Memory Mock Store Fallback.
- **Integrations**:
  - **Gemini AI API**: Smart Complaint Triage & 24/7 Virtual Hostel Concierge Chatbot (`SyncBot AI`).
  - **WhatsApp Cloud API**: Parent Entry/Exit alerts & broadcast simulator.
  - **QR Code Engine**: High-density QR generation & real-time camera decoding.

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
