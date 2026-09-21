const API_BASE = 'https://hostel-sync-sckq.vercel.app/api';
//const API_BASE = '/api';

export const api = {
  // Generic fetch wrapper with automatic JWT token attachment
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('hostelsync_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error.message);
      throw error;
    }
  },

  // Auth APIs
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  quickLogin(role) {
    return this.request('/auth/quick-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  getCurrentUser() {
    return this.request('/auth/me');
  },

  // Passes
  getPasses() {
    return this.request('/passes');
  },

  createPass(passData) {
    return this.request('/passes', {
      method: 'POST',
      body: JSON.stringify(passData),
    });
  },

  updatePassStatus(id, status, wardenRemark = '') {
    return this.request(`/passes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, wardenRemark }),
    });
  },

  // Security Scanner
  scanQR(qrData, action) {
    return this.request('/security/scan', {
      method: 'POST',
      body: JSON.stringify({ qrData, action }),
    });
  },

  getSecurityLogs() {
    return this.request('/security/logs');
  },

  // Leaves
  getLeaves() {
    return this.request('/leaves');
  },

  createLeave(leaveData) {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  },

  updateLeaveStatus(id, status, wardenRemarks = '') {
    return this.request(`/leaves/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, wardenRemarks }),
    });
  },

  // Complaints
  getComplaints() {
    return this.request('/complaints');
  },

  createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },

  updateComplaint(id, updateData) {
    return this.request(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // Mess
  getMessMenu() {
    return this.request('/mess');
  },

  updateMessMenu(menuData) {
    return this.request('/mess/menu', {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  },

  submitMessFeedback(feedback) {
    return this.request('/mess/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },

  // Rooms
  getRooms() {
    return this.request('/rooms');
  },

  getMyRoom() {
    return this.request('/rooms/my-room');
  },

  allocateRoom(studentId, roomNo, bed) {
    return this.request('/rooms/allocate', {
      method: 'POST',
      body: JSON.stringify({ studentId, roomNo, bed }),
    });
  },

  // Notices
  getNotices() {
    return this.request('/notices');
  },

  createNotice(noticeData) {
    return this.request('/notices', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
  },

  // Attendance
  getAttendance() {
    return this.request('/attendance');
  },

  submitAttendance(attendanceData) {
    return this.request('/attendance/submit', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },

  // Admin
  getAdminUsers() {
    return this.request('/admin/users');
  },

  createAdminUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getHostels() {
    return this.request('/admin/hostels');
  },

  createHostel(hostelData) {
    return this.request('/admin/hostels', {
      method: 'POST',
      body: JSON.stringify(hostelData),
    });
  },

  getAnalytics() {
    return this.request('/admin/analytics');
  },

  // AI Chatbot
  askAI(message) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // WhatsApp
  getWhatsAppLogs() {
    return this.request('/whatsapp/logs');
  },

  broadcastWhatsApp(message, recipientGroup) {
    return this.request('/whatsapp/broadcast', {
      method: 'POST',
      body: JSON.stringify({ message, recipientGroup }),
    });
  },
};
