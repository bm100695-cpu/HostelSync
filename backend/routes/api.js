const bcrypt = require('bcryptjs');
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const mockStore = require('../data/mockDbStore');
const { protect, authorize, JWT_SECRET } = require('../middleware/auth');
const { analyzeComplaintWithGemini, askHostelAI } = require('../services/geminiService');
const { sendWhatsAppNotification } = require('../services/whatsappService');

// ================= AUTH ROUTES =================


// STUDENT REGISTRATION
router.post('/auth/register', async (req, res) => {
  try {
    const {
      name,
      rollNo,
      email,
      phone,
      branch,
      year,
      block,
      room,
      password
    } = req.body;

    // Required fields
    if (
      !name ||
      !rollNo ||
      !email ||
      !phone ||
      !branch ||
      !year ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRollNo = rollNo.trim().toUpperCase();

    // Check duplicate email
    const existingEmail = await User.findOne({
      email: normalizedEmail
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check duplicate roll number
    const existingRollNo = await User.findOne({
      rollNo: normalizedRollNo
    });

    if (existingRollNo) {
      return res.status(409).json({
        success: false,
        message: 'Roll number already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create student
    const user = await User.create({
      name: name.trim(),
      rollNo: normalizedRollNo,
      email: normalizedEmail,
      phone: phone.trim(),
      branch: branch.trim(),
      year: year.trim(),
      block: block?.trim() || '',
      room: room?.trim() || '',
      
      passwordHash,
      role: 'student',
      avatar: ''
    });

    // JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // Password remove karke response
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      rollNo: user.rollNo,
      email: user.email,
      phone: user.phone,
      branch: user.branch,
      year: user.year,
      block: user.block,
      room: user.room,
     
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Student registration successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or Roll Number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});


// LOGIN
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // MongoDB user
    const user = await User.findOne({
      email: normalizedEmail
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      rollNo: user.rollNo,
      email: user.email,
      phone: user.phone,
      branch: user.branch,
      year: user.year,
      block: user.block,
      room: user.room,
     
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});


// QUICK LOGIN
router.post('/auth/quick-login', (req, res) => {
  const { role } = req.body;

  const user = mockStore.users.find(
    u => u.role === role
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `No demo user found for role ${role}`
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

  const { passwordHash, ...userWithoutPass } = user;

  res.json({
    success: true,
    token,
    user: userWithoutPass
  });
});


// CURRENT USER
router.get('/auth/me', protect, async (req, res) => {
  try {
    // MongoDB user already loaded by middleware
    const user = req.user;

    const {
      passwordHash,
      ...userWithoutPass
    } = user.toObject ? user.toObject() : user;

    res.json({
      success: true,
      user: userWithoutPass
    });

  } catch (error) {
    console.error('Auth me error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch current user'
    });
  }
});

// ================= GATE PASS ROUTES =================
router.get('/passes', protect, (req, res) => {
  let passes = mockStore.gatePasses;
  if (req.user.role === 'student') {
    passes = passes.filter(p => p.studentId === req.user.id);
  }
  res.json({ success: true, count: passes.length, data: passes });
});

router.post('/passes', protect, (req, res) => {
  const { type, destination, reason, outTime, expectedInTime } = req.body;
  
  const newPass = {
    id: `GP-2026-${Math.floor(100 + Math.random() * 900)}`,
    studentId: req.user.id,
    studentName: req.user.name,
    rollNo: req.user.rollNo || '21BCE1042',
    room: req.user.room || 'B-304',
    block: req.user.block || 'Block-B',
    parentPhone: req.user.parentPhone || '+91 98765 00001',
    type: type || 'Local Outing',
    destination,
    reason,
    outTime: outTime || new Date().toISOString(),
    expectedInTime: expectedInTime || new Date(Date.now() + 14400000).toISOString(),
    actualOutTime: null,
    actualInTime: null,
    status: 'PENDING',
    qrCodeData: `HOSTELSYNC-PASS-GP-${Date.now()}`,
    wardenRemark: '',
    approvedBy: null,
    parentNotified: false,
    whatsappLogs: [],
    createdAt: new Date().toISOString()
  };

  mockStore.gatePasses.unshift(newPass);
  res.status(201).json({ success: true, data: newPass });
});

router.patch('/passes/:id/status', protect, authorize('warden', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { status, wardenRemark } = req.body;

  const pass = mockStore.gatePasses.find(p => p.id === id);
  if (!pass) return res.status(404).json({ success: false, message: 'Pass not found' });

  pass.status = status;
  if (wardenRemark) pass.wardenRemark = wardenRemark;
  pass.approvedBy = req.user.name;

  if (status === 'APPROVED') {
    pass.parentNotified = true;
    // Send WhatsApp notification to parent
    await sendWhatsAppNotification({
      to: pass.parentPhone,
      recipientName: `${pass.studentName}'s Parent`,
      type: 'GATE_PASS_APPROVED',
      message: `🔔 HostelSync Alert: Gate Pass #${pass.id} for ${pass.studentName} (${pass.rollNo}) has been APPROVED by Warden ${req.user.name}.\nDestination: ${pass.destination}\nExpected Return: ${new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
  }

  res.json({ success: true, data: pass });
});

// ================= SECURITY GATE SCANNER ROUTES =================
router.post('/security/scan', protect, authorize('staff', 'admin', 'warden'), async (req, res) => {
  const { qrData, action } = req.body; // action: 'EXIT' or 'ENTRY'
  
  const pass = mockStore.gatePasses.find(p => p.qrCodeData === qrData || p.id === qrData);
  
  if (!pass) {
    return res.status(404).json({
      success: false,
      valid: false,
      message: 'Invalid QR Code. No gate pass matches this signature in HostelSync DB.'
    });
  }

  if (pass.status === 'PENDING') {
    return res.status(400).json({
      success: false,
      valid: false,
      message: 'Pass is still PENDING warden approval. Entry/Exit denied.',
      pass
    });
  }

  if (pass.status === 'REJECTED') {
    return res.status(400).json({
      success: false,
      valid: false,
      message: 'Gate Pass was REJECTED by Warden. Entry/Exit strictly forbidden.',
      pass
    });
  }

  const now = new Date().toISOString();
  let logAction = action || (pass.status === 'APPROVED' ? 'EXIT' : 'ENTRY');

  if (logAction === 'EXIT') {
    pass.status = 'CHECKED_OUT';
    pass.actualOutTime = now;
    
    // Alert Parent of Exit
    await sendWhatsAppNotification({
      to: pass.parentPhone,
      recipientName: `${pass.studentName}'s Parent`,
      type: 'CAMPUS_EXIT',
      message: `🚪 Hostel Gate Exit Alert: ${pass.studentName} has checked OUT through Main Gate at ${new Date().toLocaleTimeString()}.\nExpected return: ${new Date(pass.expectedInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    });
  } else {
    pass.status = 'CHECKED_IN';
    pass.actualInTime = now;

    // Alert Parent of Safe Return
    await sendWhatsAppNotification({
      to: pass.parentPhone,
      recipientName: `${pass.studentName}'s Parent`,
      type: 'CAMPUS_ENTRY',
      message: `✅ Hostel Gate Return Alert: ${pass.studentName} has safely returned and checked IN at ${new Date().toLocaleTimeString()}. Pass #${pass.id} completed.`
    });
  }

  // Create audit log
  const logEntry = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    passId: pass.id,
    studentName: pass.studentName,
    rollNo: pass.rollNo,
    action: logAction,
    gate: req.user.gate || 'Main Gate #1',
    guardName: req.user.name,
    timestamp: now,
    parentNotified: true
  };
  mockStore.securityMovementLogs.unshift(logEntry);

  res.json({
    success: true,
    valid: true,
    message: `Security validation success: ${pass.studentName} ${logAction} recorded.`,
    pass,
    log: logEntry
  });
});

router.get('/security/logs', protect, (req, res) => {
  res.json({ success: true, count: mockStore.securityMovementLogs.length, data: mockStore.securityMovementLogs });
});

// ================= LEAVE ROUTES =================
router.get('/leaves', protect, (req, res) => {
  let leaves = mockStore.leaves;
  if (req.user.role === 'student') {
    leaves = leaves.filter(l => l.studentId === req.user.id);
  }
  res.json({ success: true, count: leaves.length, data: leaves });
});

router.post('/leaves', protect, (req, res) => {
  const { fromDate, toDate, reason, destination, emergencyContact } = req.body;
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const newLeave = {
    id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
    studentId: req.user.id,
    studentName: req.user.name,
    rollNo: req.user.rollNo || '21BCE1042',
    room: req.user.room || 'B-304',
    block: req.user.block || 'Block-B',
    fromDate,
    toDate,
    totalDays: diffDays,
    reason,
    destination,
    emergencyContact: emergencyContact || req.user.parentPhone,
    parentConsentVerified: true,
    status: 'PENDING',
    wardenRemarks: '',
    approvedBy: null,
    createdAt: new Date().toISOString()
  };

  mockStore.leaves.unshift(newLeave);
  res.status(201).json({ success: true, data: newLeave });
});

router.patch('/leaves/:id/status', protect, authorize('warden', 'admin'), (req, res) => {
  const { id } = req.params;
  const { status, wardenRemarks } = req.body;
  const leave = mockStore.leaves.find(l => l.id === id);
  if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

  leave.status = status;
  if (wardenRemarks) leave.wardenRemarks = wardenRemarks;
  leave.approvedBy = req.user.name;

  res.json({ success: true, data: leave });
});

// ================= COMPLAINTS WITH GEMINI AI =================
router.get('/complaints', protect, (req, res) => {
  let complaints = mockStore.complaints;
  if (req.user.role === 'student') {
    complaints = complaints.filter(c => c.studentId === req.user.id);
  }
  res.json({ success: true, count: complaints.length, data: complaints });
});

router.post('/complaints', protect, async (req, res) => {
  const { title, description, category, images } = req.body;

  // Run Gemini AI auto-triage
  const aiTriage = await analyzeComplaintWithGemini(title, description, category);

  const newComplaint = {
    id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
    studentId: req.user.id,
    studentName: req.user.name,
    room: req.user.room || 'B-304',
    block: req.user.block || 'Block-B',
    category: category || 'General',
    title,
    description,
    urgency: aiTriage.urgency,
    aiSummary: aiTriage.aiSummary,
    status: 'PENDING',
    assignedTo: aiTriage.assignedTeam || 'Maintenance Dept',
    resolutionNotes: '',
    images: images || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockStore.complaints.unshift(newComplaint);

  // Also add to staff work orders
  mockStore.staffWorkOrders.unshift({
    id: `WO-${Math.floor(100 + Math.random() * 900)}`,
    complaintId: newComplaint.id,
    title: newComplaint.title,
    room: newComplaint.room,
    block: newComplaint.block,
    staffName: aiTriage.assignedTeam,
    category: newComplaint.category,
    priority: newComplaint.urgency,
    status: 'PENDING',
    deadline: 'Within 24 Hours'
  });

  res.status(201).json({ success: true, data: newComplaint, aiTriage });
});

router.patch('/complaints/:id', protect, authorize('warden', 'admin', 'staff'), (req, res) => {
  const { id } = req.params;
  const { status, assignedTo, resolutionNotes } = req.body;
  const complaint = mockStore.complaints.find(c => c.id === id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

  if (status) complaint.status = status;
  if (assignedTo) complaint.assignedTo = assignedTo;
  if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
  complaint.updatedAt = new Date().toISOString();

  res.json({ success: true, data: complaint });
});

// ================= MESS ROUTES =================
router.get('/mess', (req, res) => {
  res.json({ success: true, data: mockStore.messMenu });
});

router.put('/mess/menu', protect, authorize('admin', 'warden'), (req, res) => {
  const { weekDaySchedule, mealTimes } = req.body;
  if (weekDaySchedule) mockStore.messMenu.weekDaySchedule = weekDaySchedule;
  if (mealTimes) mockStore.messMenu.mealTimes = mealTimes;
  res.json({ success: true, message: 'Mess menu updated successfully', data: mockStore.messMenu });
});

router.post('/mess/feedback', protect, (req, res) => {
  const { rating, comment } = req.body;
  const feedback = {
    id: `FB-${Date.now()}`,
    studentName: req.user.name,
    rating: Number(rating) || 5,
    comment,
    date: new Date().toISOString().split('T')[0]
  };
  mockStore.messMenu.studentFeedback.unshift(feedback);
  res.status(201).json({ success: true, data: feedback });
});

// ================= ROOMS ROUTES =================
router.get('/rooms', protect, (req, res) => {
  res.json({ success: true, count: mockStore.rooms.length, data: mockStore.rooms });
});

router.get('/rooms/my-room', protect, (req, res) => {
  const room = mockStore.rooms.find(r => r.roomNo === req.user.room) || mockStore.rooms[0];
  res.json({ success: true, data: room });
});

router.post('/rooms/allocate', protect, authorize('admin', 'warden'), (req, res) => {
  const { studentId, roomNo, bed } = req.body;
  const student = mockStore.users.find(u => u.id === studentId);
  const room = mockStore.rooms.find(r => r.roomNo === roomNo);
  if (!student || !room) return res.status(404).json({ success: false, message: 'Student or Room not found' });

  student.room = roomNo;
  student.block = room.block;
  
  if (!room.occupants.some(o => o.id === studentId)) {
    room.occupants.push({
      id: student.id,
      name: student.name,
      rollNo: student.rollNo,
      bed: bed || `Bed ${room.occupants.length + 1}`
    });
    room.occupied = room.occupants.length;
    room.status = room.occupied >= room.capacity ? 'Occupied' : 'Partially Available';
  }

  res.json({ success: true, message: `Allocated ${student.name} to ${roomNo}`, data: room });
});

// ================= NOTICES ROUTES =================
router.get('/notices', (req, res) => {
  res.json({ success: true, count: mockStore.notices.length, data: mockStore.notices });
});

router.post('/notices', protect, authorize('admin', 'warden'), async (req, res) => {
  const { title, category, urgency, content, broadcastWhatsApp } = req.body;
  const newNotice = {
    id: `NTC-2026-${Math.floor(100 + Math.random() * 900)}`,
    title,
    category: category || 'General',
    urgency: urgency || 'NORMAL',
    author: req.user.name,
    date: new Date().toISOString().split('T')[0],
    content,
    pinned: urgency === 'URGENT' || urgency === 'HIGH'
  };

  mockStore.notices.unshift(newNotice);

  if (broadcastWhatsApp) {
    await sendWhatsAppNotification({
      to: '+91 ALL STUDENTS & PARENTS',
      recipientName: 'Hostel Community Broadcast',
      type: 'NOTICE_BROADCAST',
      message: `📢 [HostelSync Notice] ${newNotice.title}\n\n${newNotice.content}\n\n- ${newNotice.author}`
    });
  }

  res.status(201).json({ success: true, data: newNotice });
});

// ================= ATTENDANCE ROUTES =================
router.get('/attendance', protect, authorize('warden', 'admin'), (req, res) => {
  res.json({ success: true, data: mockStore.attendance });
});

router.post('/attendance/submit', protect, authorize('warden', 'admin'), (req, res) => {
  const { block, records } = req.body;
  const present = records.filter(r => r.status === 'PRESENT').length;
  const absent = records.filter(r => r.status === 'ABSENT').length;
  const onLeave = records.filter(r => r.status === 'ON_LEAVE').length;

  const attendanceRecord = {
    id: `ATT-${new Date().toISOString().split('T')[0]}`,
    date: new Date().toISOString().split('T')[0],
    block: block || 'Block-B',
    conductedBy: req.user.name,
    totalStudents: records.length,
    present,
    absent,
    onLeave,
    records
  };

  mockStore.attendance.unshift(attendanceRecord);
  res.status(201).json({ success: true, message: 'Roll call submitted successfully', data: attendanceRecord });
});

// ================= ADMIN & USER MANAGEMENT =================
router.get('/admin/users', protect, authorize('admin', 'warden'), (req, res) => {
  const cleanUsers = mockStore.users.map(({ passwordHash, ...u }) => u);
  res.json({ success: true, count: cleanUsers.length, data: cleanUsers });
});

router.post('/admin/users', protect, authorize('admin'), (req, res) => {
  const { name, email, role, rollNo, room, block, phone, parentName, parentPhone, branch, year } = req.body;
  
  if (mockStore.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'User with this email already exists' });
  }

  const newUser = {
    id: `usr-${role.substring(0, 3)}-${Date.now()}`,
    name,
    email,
    passwordHash: '$2a$10$demoHashForHostelSyncPass123',
    role,
    rollNo,
    room,
    block,
    phone,
    parentName,
    parentPhone,
    branch,
    year,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  mockStore.users.push(newUser);
  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json({ success: true, data: safeUser });
});

router.get('/admin/hostels', protect, (req, res) => {
  res.json({ success: true, data: mockStore.hostels });
});

router.post('/admin/hostels', protect, authorize('admin'), (req, res) => {
  const { name, type, floors, totalRooms, warden, caretaker } = req.body;
  const newHostel = {
    id: `HST-BLK-${Date.now().toString().slice(-4)}`,
    name: name || 'New Hostel Block',
    type: type || 'Boys',
    floors: Number(floors) || 3,
    totalRooms: Number(totalRooms) || 50,
    occupiedRooms: 0,
    warden: warden || 'Unassigned',
    caretaker: caretaker || 'Unassigned',
    status: 'Active'
  };
  mockStore.hostels.push(newHostel);
  res.status(201).json({ success: true, data: newHostel });
});

router.get('/admin/analytics', protect, authorize('admin', 'warden'), (req, res) => {
  const totalStudents = mockStore.users.filter(u => u.role === 'student').length;
  const activePasses = mockStore.gatePasses.filter(p => p.status === 'APPROVED' || p.status === 'CHECKED_OUT').length;
  const openComplaints = mockStore.complaints.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length;
  const resolvedComplaints = mockStore.complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  
  const analyticsData = {
    stats: {
      totalResidents: totalStudents + 168, // projected campus total
      occupancyRate: '92.4%',
      activePassesCount: activePasses,
      pendingComplaints: openComplaints,
      resolvedComplaintsCount: resolvedComplaints,
      messSatisfactionIndex: '4.7 / 5.0'
    },
    passesByDay: [
      { day: 'Mon', count: 18 },
      { day: 'Tue', count: 24 },
      { day: 'Wed', count: 32 },
      { day: 'Thu', count: 28 },
      { day: 'Fri', count: 65 },
      { day: 'Sat', count: 110 },
      { day: 'Sun', count: 95 }
    ],
    complaintsByCategory: [
      { category: 'Electrical', count: 14, fill: '#3b82f6' },
      { category: 'Plumbing', count: 11, fill: '#06b6d4' },
      { category: 'WiFi/Network', count: 6, fill: '#8b5cf6' },
      { category: 'Carpentry', count: 5, fill: '#f59e0b' },
      { category: 'Mess/Hygiene', count: 4, fill: '#10b981' }
    ],
    recentLogs: mockStore.securityMovementLogs.slice(0, 5)
  };

  res.json({ success: true, data: analyticsData });
});

// ================= GEMINI AI CHAT ROUTE =================
router.post('/ai/chat', protect, async (req, res) => {
  const { message } = req.body;
  const reply = await askHostelAI(message, {
    name: req.user.name,
    role: req.user.role,
    room: req.user.room
  });
  res.json({ success: true, reply });
});

// ================= WHATSAPP LOGS ROUTE =================
router.get('/whatsapp/logs', protect, authorize('admin', 'warden'), (req, res) => {
  res.json({ success: true, count: mockStore.whatsappLogs.length, data: mockStore.whatsappLogs });
});

router.post('/whatsapp/broadcast', protect, authorize('admin', 'warden'), async (req, res) => {
  const { message, recipientGroup } = req.body;
  const log = await sendWhatsAppNotification({
    to: recipientGroup || '+91 ALL HOSTEL RESIDENTS',
    recipientName: recipientGroup || 'All Residents & Parents',
    type: 'ADMIN_BROADCAST',
    message: `📢 [HostelSync Broadcast]\n${message}\n\n- Issued by: ${req.user.name} (${req.user.role.toUpperCase()})`
  });
  res.json({ success: true, message: 'Broadcast dispatched to WhatsApp gateway', data: log });
});

module.exports = router;
