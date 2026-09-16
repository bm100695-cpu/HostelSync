// In-memory data store with complete starter data for HostelSync
const { v4: uuidv4 } = require('uuid');

const mockStore = {
  users: [
    {
      id: 'usr-std-1',
      name: 'Aarav Sharma',
      email: 'student@hostelsync.com',
      passwordHash: '$2a$10$demoHashForHostelSyncPass123', // plain 'password123'
      role: 'student',
      rollNo: '21BCE1042',
      room: 'B-304',
      block: 'Block-B (Boys Hostel)',
      phone: '+91 98765 43210',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91 98765 00001',
      branch: 'Computer Science & Engineering',
      year: '3rd Year',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      diet: 'Vegetarian',
      messPlan: 'Standard Full Board',
      createdAt: '2024-08-01T10:00:00Z'
    },
    {
      id: 'usr-std-2',
      name: 'Ananya Verma',
      email: 'ananya@hostelsync.com',
      passwordHash: '$2a$10$demoHashForHostelSyncPass123',
      role: 'student',
      rollNo: '22BIT2019',
      room: 'G-201',
      block: 'Block-G (Girls Hostel)',
      phone: '+91 98111 22334',
      parentName: 'Sanjay Verma',
      parentPhone: '+91 98111 00002',
      branch: 'Information Technology',
      year: '2nd Year',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      diet: 'Eggetarian',
      messPlan: 'Premium Plus',
      createdAt: '2024-08-01T10:00:00Z'
    },
    {
      id: 'usr-wrd-1',
      name: 'Dr. Ramesh K. Patel',
      email: 'warden@hostelsync.com',
      passwordHash: '$2a$10$demoHashForHostelSyncPass123',
      role: 'warden',
      block: 'Block-B (Boys Hostel)',
      phone: '+91 94231 55667',
      office: 'Block-B Ground Floor, Room 002',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      createdAt: '2023-01-15T10:00:00Z'
    },
    {
      id: 'usr-adm-1',
      name: 'Prof. Meenakshi Sundaram',
      email: 'admin@hostelsync.com',
      passwordHash: '$2a$10$demoHashForHostelSyncPass123',
      role: 'admin',
      designation: 'Chief Hostel Warden & Dean of Student Affairs',
      phone: '+91 99000 11223',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2022-06-01T10:00:00Z'
    },
    {
      id: 'usr-sec-1',
      name: 'Vikram Singh (Security Chief)',
      email: 'security@hostelsync.com',
      passwordHash: '$2a$10$demoHashForHostelSyncPass123',
      role: 'staff',
      staffType: 'security',
      gate: 'Main North Gate #1',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2023-09-01T10:00:00Z'
    }
  ],

  gatePasses: [
    {
      id: 'GP-2026-901',
      studentId: 'usr-std-1',
      studentName: 'Aarav Sharma',
      rollNo: '21BCE1042',
      room: 'B-304',
      block: 'Block-B (Boys Hostel)',
      parentPhone: '+91 98765 00001',
      type: 'Local Outing',
      destination: 'Central City Library & Medical Store',
      reason: 'Academic project reference books & prescription refill',
      outTime: new Date(Date.now() + 1800000).toISOString(),
      expectedInTime: new Date(Date.now() + 18000000).toISOString(),
      actualOutTime: null,
      actualInTime: null,
      status: 'APPROVED', // PENDING, APPROVED, REJECTED, CHECKED_OUT, CHECKED_IN, EXPIRED
      qrCodeData: 'HOSTELSYNC-PASS-GP-2026-901',
      wardenRemark: 'Approved. Return before 8:30 PM strictly.',
      approvedBy: 'Dr. Ramesh K. Patel',
      parentNotified: true,
      whatsappLogs: [
        { type: 'APPROVAL_NOTICE', time: new Date().toISOString(), status: 'SENT' }
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'GP-2026-880',
      studentId: 'usr-std-1',
      studentName: 'Aarav Sharma',
      rollNo: '21BCE1042',
      room: 'B-304',
      block: 'Block-B (Boys Hostel)',
      parentPhone: '+91 98765 00001',
      type: 'Market Visit',
      destination: 'Campus Mall',
      reason: 'Grocery and essentials',
      outTime: new Date(Date.now() - 86400000).toISOString(),
      expectedInTime: new Date(Date.now() - 72000000).toISOString(),
      actualOutTime: new Date(Date.now() - 86000000).toISOString(),
      actualInTime: new Date(Date.now() - 74000000).toISOString(),
      status: 'CHECKED_IN',
      qrCodeData: 'HOSTELSYNC-PASS-GP-2026-880',
      wardenRemark: 'Approved',
      approvedBy: 'Dr. Ramesh K. Patel',
      parentNotified: true,
      createdAt: new Date(Date.now() - 90000000).toISOString()
    },
    {
      id: 'GP-2026-902',
      studentId: 'usr-std-2',
      studentName: 'Ananya Verma',
      rollNo: '22BIT2019',
      room: 'G-201',
      block: 'Block-G (Girls Hostel)',
      parentPhone: '+91 98111 00002',
      type: 'Weekend Outing',
      destination: 'Family Relative Residence, Sector 15',
      reason: 'Family dinner gathering and book exchange',
      outTime: new Date(Date.now() + 7200000).toISOString(),
      expectedInTime: new Date(Date.now() + 36000000).toISOString(),
      actualOutTime: null,
      actualInTime: null,
      status: 'PENDING',
      qrCodeData: 'HOSTELSYNC-PASS-GP-2026-902',
      wardenRemark: '',
      approvedBy: null,
      parentNotified: false,
      createdAt: new Date().toISOString()
    }
  ],

  leaves: [
    {
      id: 'LV-2026-101',
      studentId: 'usr-std-1',
      studentName: 'Aarav Sharma',
      rollNo: '21BCE1042',
      room: 'B-304',
      block: 'Block-B (Boys Hostel)',
      fromDate: '2026-09-20',
      toDate: '2026-09-24',
      totalDays: 4,
      reason: 'Sister wedding ceremony at hometown',
      destination: 'Jaipur, Rajasthan',
      emergencyContact: '+91 98765 00001',
      parentConsentVerified: true,
      status: 'APPROVED',
      wardenRemarks: 'Granted 4 days leave. Submit return slip on 25th morning.',
      approvedBy: 'Dr. Ramesh K. Patel',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ],

  complaints: [
    {
      id: 'CMP-2026-401',
      studentId: 'usr-std-1',
      studentName: 'Aarav Sharma',
      room: 'B-304',
      block: 'Block-B',
      category: 'Electrical',
      title: 'Ceiling Fan making grinding squeaky noise & low speed',
      description: 'The regulator is on 5 but fan is moving very slowly with a loud mechanical grinding noise since yesterday night. Needs capacitor or bearing replacement.',
      urgency: 'MEDIUM',
      aiSummary: 'Electrical appliance issue (Capacitor/Motor wear). Predicted fix time: 2 hours. Assigned to Electrician team.',
      status: 'IN_PROGRESS', // PENDING, IN_PROGRESS, RESOLVED, CLOSED
      assignedTo: 'Manoj Kumar (Electrician #2)',
      resolutionNotes: 'Technician assigned. Parts requested from inventory.',
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10000000).toISOString()
    },
    {
      id: 'CMP-2026-402',
      studentId: 'usr-std-2',
      studentName: 'Ananya Verma',
      room: 'G-201',
      block: 'Block-G',
      category: 'Plumbing',
      title: 'Water seepage from bathroom washbasin tap',
      description: 'Continuous dripping faucet causing water overflow on floor tile.',
      urgency: 'HIGH',
      aiSummary: 'Plumbing leak detected. Urgent risk of floor damage and water wastage.',
      status: 'PENDING',
      assignedTo: 'Unassigned',
      resolutionNotes: '',
      images: [],
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      updatedAt: new Date(Date.now() - 14400000).toISOString()
    }
  ],

  hostels: [
    {
      id: 'HST-BLK-A',
      name: 'Block-A (Senior Boys Hostel)',
      type: 'Boys',
      floors: 4,
      totalRooms: 60,
      occupiedRooms: 54,
      warden: 'Dr. Ramesh K. Patel',
      caretaker: 'Suresh Rana',
      status: 'Active'
    },
    {
      id: 'HST-BLK-B',
      name: 'Block-B (Junior Boys Hostel)',
      type: 'Boys',
      floors: 4,
      totalRooms: 80,
      occupiedRooms: 76,
      warden: 'Dr. Ramesh K. Patel',
      caretaker: 'Ravi Verma',
      status: 'Active'
    },
    {
      id: 'HST-BLK-G',
      name: 'Block-G (Girls Residency)',
      type: 'Girls',
      floors: 5,
      totalRooms: 100,
      occupiedRooms: 92,
      warden: 'Prof. Sunita Deshmukh',
      caretaker: 'Anita Sen',
      status: 'Active'
    }
  ],

  rooms: [
    {
      id: 'RM-B-304',
      block: 'Block-B (Boys Hostel)',
      roomNo: 'B-304',
      floor: 3,
      type: 'Double Sharing',
      capacity: 2,
      occupied: 2,
      occupants: [
        { id: 'usr-std-1', name: 'Aarav Sharma', rollNo: '21BCE1042', bed: 'Bed 1' },
        { id: 'usr-std-3', name: 'Kunal Singhania', rollNo: '21BCE1099', bed: 'Bed 2' }
      ],
      amenities: ['Attached Balcony', 'High Speed LAN', 'Air Cooler', 'Study Tables (2)'],
      status: 'Occupied'
    },
    {
      id: 'RM-B-305',
      block: 'Block-B (Boys Hostel)',
      roomNo: 'B-305',
      floor: 3,
      type: 'Double Sharing',
      capacity: 2,
      occupied: 1,
      occupants: [
        { id: 'usr-std-4', name: 'Devendra Joshi', rollNo: '21BME1008', bed: 'Bed 1' }
      ],
      amenities: ['High Speed LAN', 'Study Tables (2)', 'Wardrobe (2)'],
      status: 'Partially Available'
    },
    {
      id: 'RM-G-201',
      block: 'Block-G (Girls Hostel)',
      roomNo: 'G-201',
      floor: 2,
      type: 'Triple Sharing',
      capacity: 3,
      occupied: 2,
      occupants: [
        { id: 'usr-std-2', name: 'Ananya Verma', rollNo: '22BIT2019', bed: 'Bed 1' },
        { id: 'usr-std-5', name: 'Rhea Chakraborty', rollNo: '22BIT2045', bed: 'Bed 2' }
      ],
      amenities: ['Air Conditioner', 'Attached Washroom', 'High Speed WiFi'],
      status: 'Partially Available'
    },
    {
      id: 'RM-B-101',
      block: 'Block-B (Boys Hostel)',
      roomNo: 'B-101',
      floor: 1,
      type: 'Double Sharing',
      capacity: 2,
      occupied: 0,
      occupants: [],
      amenities: ['LAN Port', 'Study Table', 'Balcony'],
      status: 'Vacant'
    }
  ],

  messMenu: {
    weekDaySchedule: {
      Monday: {
        breakfast: 'Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs / Banana, Tea & Coffee',
        lunch: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Phulka Roti, Cucumber Salad, Curd',
        snacks: 'Veg Cutlet, Green Mint Chutney, Hot Masala Chai',
        dinner: 'Aloo Gobi Matar, Chana Dal, Steamed Rice, Butter Roti, Gulab Jamun'
      },
      Tuesday: {
        breakfast: 'Poha with Sev & Peanuts, Sprouts, Boiled Eggs, Fresh Fruits, Tea & Milk',
        lunch: 'Rajma Masala, Aloo Jeera, Steamed Basmati Rice, Tawa Roti, Boondi Raita, Pickle',
        snacks: 'Pani Puri / Sev Puri Stall, Lemon Iced Tea',
        dinner: 'Egg Curry / Kadhai Mushroom, Yellow Moong Dal, Jeera Rice, Chapati, Kheer'
      },
      Wednesday: {
        breakfast: 'Idli Vada with Sambar & 2 Chutneys, Fresh Orange Juice, Filter Coffee',
        lunch: 'Mix Veg Korma, Dal Makhani, Veg Pulao, Butter Naan/Roti, Papad, Green Salad',
        snacks: 'Crispy Samosa with Sweet Tamarind Dip, Adrak Chai',
        dinner: 'Chicken Curry (Special) / Malai Kofta, Kashmiri Pulao, Tandoori Roti, Ice Cream'
      },
      Thursday: {
        breakfast: 'Aloo Paratha with White Butter, Curd, Pickle, Boiled Eggs, Tea',
        lunch: 'Kadhi Pakoda, Aloo Bhindi Fry, Steamed Rice, Phulka Roti, Salad',
        snacks: 'Pav Bhaji, Chopped Onions, Lemon, Hot Tea',
        dinner: 'Dal Fry, Bhindi Do Pyaza, Steamed Rice, Butter Roti, Fruit Custard'
      },
      Friday: {
        breakfast: 'Chole Bhature / Upma with Podi, Fresh Papaya, Tea & Coffee',
        lunch: 'Shahi Paneer, Panchmel Dal, Peas Pulao, Garlic Roti, Onion Raita',
        snacks: 'Veg Grilled Sandwich, Tomato Ketchup, Filter Coffee',
        dinner: 'Hyderabadi Veg/Egg Dum Biryani, Mirchi Ka Salan, Raita, Rasgulla'
      },
      Saturday: {
        breakfast: 'Uttapam with Sambar & Chutney, Boiled Eggs, Banana, Tea',
        lunch: 'Kashmiri Dum Aloo, Kali Dal, Rice, Phulka Roti, Boondi Salad',
        snacks: 'Bhel Puri, Masala Biscuits, Ginger Cardamom Tea',
        dinner: 'South Indian Thali Special, Rasam, Curd Rice, Payasam'
      },
      Sunday: {
        breakfast: 'Puri Sabzi, Halwa, Fresh Fruit Juice, Tea & Milk',
        lunch: 'Special Sunday Feast: Paneer Tikka Masala / Butter Chicken, Dal Makhani, Biryani, Naan, Rasmalai',
        snacks: 'Veg Spring Rolls, Sweet Chilli Sauce, Cold Coffee',
        dinner: 'Light Khichdi, Gujarati Kadhi, Papad, Chokha, Roasted Veggies'
      }
    },
    mealTimes: {
      breakfast: '07:30 AM - 09:30 AM',
      lunch: '12:30 PM - 02:30 PM',
      snacks: '05:00 PM - 06:15 PM',
      dinner: '07:45 PM - 09:45 PM'
    },
    studentFeedback: [
      { id: 'FB-1', studentName: 'Aarav Sharma', rating: 5, comment: 'Wednesday dinner Biryani was outstanding!', date: '2026-09-14' },
      { id: 'FB-2', studentName: 'Devendra Joshi', rating: 4, comment: 'Poha was fresh, add more peanuts please.', date: '2026-09-15' }
    ]
  },

  notices: [
    {
      id: 'NTC-2026-01',
      title: 'Hostel Annual Sports & Cultural Meet "AAGAZ 2026"',
      category: 'Events',
      urgency: 'HIGH',
      author: 'Warden Office',
      date: '2026-09-15',
      content: 'All hostel residents are invited to participate in Inter-Hostel Badminton, Cricket, and Chess tournaments scheduled for this weekend. Register your team with Floor Reps by Thursday.',
      pinned: true
    },
    {
      id: 'NTC-2026-02',
      title: 'Scheduled Campus Water Supply Maintenance on Wednesday',
      category: 'Maintenance',
      urgency: 'URGENT',
      author: 'Chief Engineer',
      date: '2026-09-14',
      content: 'Routine pipeline sanitization in Block-A & Block-B between 10:00 AM to 01:00 PM. Please store sufficient drinking water in advance.',
      pinned: true
    },
    {
      id: 'NTC-2026-03',
      title: 'Night Curfew & Gate Entry Policy Reminder',
      category: 'Rules',
      urgency: 'NORMAL',
      author: 'Dean of Student Affairs',
      date: '2026-09-10',
      content: 'All residents must present their digital QR Gate Pass at Main Gate before 09:30 PM. Late entries without approved emergency passes will trigger automatic SMS/WhatsApp to parents.',
      pinned: false
    }
  ],

  attendance: [
    {
      id: 'ATT-2026-09-15',
      date: '2026-09-15',
      block: 'Block-B (Boys Hostel)',
      conductedBy: 'Dr. Ramesh K. Patel',
      totalStudents: 76,
      present: 72,
      absent: 2,
      onLeave: 2,
      records: [
        { studentId: 'usr-std-1', name: 'Aarav Sharma', room: 'B-304', status: 'PRESENT', remark: '' },
        { studentId: 'usr-std-3', name: 'Kunal Singhania', room: 'B-304', status: 'PRESENT', remark: '' },
        { studentId: 'usr-std-4', name: 'Devendra Joshi', room: 'B-305', status: 'ON_LEAVE', remark: 'Approved Leave #LV-2026-101' }
      ]
    }
  ],

  securityMovementLogs: [
    {
      id: 'LOG-8801',
      passId: 'GP-2026-880',
      studentName: 'Aarav Sharma',
      rollNo: '21BCE1042',
      action: 'EXIT',
      gate: 'Main North Gate #1',
      guardName: 'Vikram Singh',
      timestamp: new Date(Date.now() - 86000000).toISOString(),
      parentNotified: true
    },
    {
      id: 'LOG-8802',
      passId: 'GP-2026-880',
      studentName: 'Aarav Sharma',
      rollNo: '21BCE1042',
      action: 'ENTRY',
      gate: 'Main North Gate #1',
      guardName: 'Vikram Singh',
      timestamp: new Date(Date.now() - 74000000).toISOString(),
      parentNotified: true
    }
  ],

  whatsappLogs: [
    {
      id: 'WA-MSG-1',
      recipientPhone: '+91 98765 00001',
      recipientName: 'Rajesh Sharma (Parent)',
      messageType: 'GATE_PASS_APPROVED',
      content: 'Dear Parent, Gate Pass for Aarav Sharma (21BCE1042) for Local Outing has been approved. Expected return: Today 08:30 PM.',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 3500000).toISOString()
    }
  ],

  staffWorkOrders: [
    {
      id: 'WO-101',
      complaintId: 'CMP-2026-401',
      title: 'Ceiling Fan Repair & Capacitor Fix',
      room: 'B-304',
      block: 'Block-B',
      staffName: 'Manoj Kumar',
      category: 'Electrical',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      deadline: 'Today, 06:00 PM'
    },
    {
      id: 'WO-102',
      complaintId: 'CMP-2026-402',
      title: 'Washbasin Tap Leakage Replacement',
      room: 'G-201',
      block: 'Block-G',
      staffName: 'Ramesh Plumber',
      category: 'Plumbing',
      priority: 'HIGH',
      status: 'PENDING',
      deadline: 'Today, 04:00 PM'
    }
  ]
};

module.exports = mockStore;
