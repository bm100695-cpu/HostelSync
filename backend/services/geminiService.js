// Gemini AI Service for Smart Hostel Assistance & Automated Complaint Triage

async function analyzeComplaintWithGemini(title, description, category) {
  // If a real GEMINI_API_KEY is provided and not default mock, we can invoke Google Generative Language API
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey && !apiKey.includes('MockKey') && apiKey.length > 20) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are HostelSync AI Assistant. Analyze this hostel maintenance ticket:
Title: "${title}"
Description: "${description}"
Category: "${category}"

Provide a structured JSON output with:
- "urgency": "LOW" | "MEDIUM" | "HIGH" | "URGENT"
- "estimatedHours": number
- "assignedTeam": string (e.g., "Electrical Dept", "Plumbing & Sanitization", "Carpentry & Furniture", "Housekeeping", "Mess Warden")
- "aiSummary": brief 1-2 sentence actionable summary for warden & technician.`
            }]
          }]
        })
      });
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return parsed;
    } catch (err) {
      console.warn('Gemini API fetch error, falling back to smart heuristic triage:', err.message);
    }
  }

  // Smart Heuristic Fallback Engine
  const combined = `${title} ${description}`.toLowerCase();
  let urgency = 'MEDIUM';
  let estimatedHours = 4;
  let assignedTeam = 'General Maintenance';

  if (combined.includes('leak') || combined.includes('overflow') || combined.includes('tap') || combined.includes('flush') || combined.includes('pipe')) {
    urgency = combined.includes('flood') || combined.includes('burst') ? 'URGENT' : 'HIGH';
    assignedTeam = 'Plumbing & Sanitization';
    estimatedHours = 2;
  } else if (combined.includes('spark') || combined.includes('shock') || combined.includes('short circuit') || combined.includes('smoke')) {
    urgency = 'URGENT';
    assignedTeam = 'Electrical Emergency Unit';
    estimatedHours = 1;
  } else if (combined.includes('fan') || combined.includes('light') || combined.includes('switch') || combined.includes('power') || combined.includes('socket')) {
    urgency = 'MEDIUM';
    assignedTeam = 'Electrical Maintenance';
    estimatedHours = 3;
  } else if (combined.includes('wifi') || combined.includes('lan') || combined.includes('internet') || combined.includes('router')) {
    urgency = 'LOW';
    assignedTeam = 'Campus IT Support';
    estimatedHours = 6;
  } else if (combined.includes('door') || combined.includes('lock') || combined.includes('key') || combined.includes('window') || combined.includes('cupboard')) {
    urgency = combined.includes('lock') ? 'HIGH' : 'MEDIUM';
    assignedTeam = 'Carpentry & Hardware';
    estimatedHours = 3;
  } else if (combined.includes('food') || combined.includes('mess') || combined.includes('meal') || combined.includes('water cooler')) {
    urgency = 'HIGH';
    assignedTeam = 'Mess Committee & Hygiene Inspection';
    estimatedHours = 2;
  }

  return {
    urgency,
    estimatedHours,
    assignedTeam,
    aiSummary: `AI Analyzed: ${assignedTeam} issue flagged with ${urgency} urgency. Estimated resolution: ${estimatedHours}h. Pre-routed for swift warden dispatch.`
  };
}

async function askHostelAI(query, userContext = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const promptSystem = `You are "SyncBot", the official 24/7 AI Hostel Concierge for HostelSync. 
Hostel Rules & Information:
- Main Gate Curfew: 09:30 PM (Daily). Late entries require warden sanction.
- Gate Pass Policy: Local outings require 2 hours advance notice; outstation leaves require 24 hours advance notice and parent OTP/verification.
- Mess Timings: Breakfast (7:30-9:30 AM), Lunch (12:30-2:30 PM), Snacks (5:00-6:15 PM), Dinner (7:45-9:45 PM).
- Emergency Numbers: Chief Warden: +91 94231 55667, Security Gate: +91 91234 56789, Ambulance/Medical: +91 108.
- Room amenities: Free high-speed WiFi, 24/7 power backup, laundry service on Tuesdays and Fridays.

User details: Name: ${userContext.name || 'Student'}, Role: ${userContext.role || 'Resident'}, Room: ${userContext.room || 'Hostel'}.
Answer concisely, warmly, and helpfully with bullet points where appropriate.`;

  if (apiKey && !apiKey.includes('MockKey') && apiKey.length > 20) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${promptSystem}\n\nStudent asks: "${query}"` }] }
          ]
        })
      });
      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply;
    } catch (err) {
      console.warn('Gemini chat API error, falling back to smart responder:', err.message);
    }
  }

  // Smart Context-Aware Heuristic Replies
  const q = query.toLowerCase();
  if (q.includes('curfew') || q.includes('timing') || q.includes('gate') || q.includes('time')) {
    return `🕒 **Hostel Gate Timings & Curfew Policy**:
- **Regular Curfew**: 09:30 PM sharp.
- **Morning Gate Opening**: 06:00 AM.
- **Pass Requirement**: Valid approved digital QR Gate Pass must be scanned at Main Gate #1.
- **Late Entry**: Automatic WhatsApp SMS is dispatched to parents if entered post 09:45 PM without warden clearance.`;
  }
  if (q.includes('mess') || q.includes('food') || q.includes('menu') || q.includes('dinner') || q.includes('lunch') || q.includes('breakfast')) {
    return `🍽️ **Mess Schedule & Food Details**:
- **Breakfast**: 07:30 AM - 09:30 AM
- **Lunch**: 12:30 PM - 02:30 PM
- **High Tea / Snacks**: 05:00 PM - 06:15 PM
- **Dinner**: 07:45 PM - 09:45 PM
💡 *Tip: You can view today's complete 4-course menu and rate meals in the **Mess Portal**!*`;
  }
  if (q.includes('complaint') || q.includes('repair') || q.includes('broken') || q.includes('fix') || q.includes('fan') || q.includes('water')) {
    return `🔧 **Maintenance & Complaint Workflow**:
1. Go to the **Complaints** tab.
2. Enter your issue details. Our Gemini AI automatically triages urgency and assigns electricians or plumbers.
3. Average turnaround time is under 4 working hours.
4. You can track real-time resolution logs in your dashboard.`;
  }
  if (q.includes('leave') || q.includes('holiday') || q.includes('home') || q.includes('vacation')) {
    return `✈️ **Applying for Hostel Leave**:
- Submit an application in the **Leave** tab at least 24 hours prior.
- Your registered parent/guardian will receive a verification alert.
- Once the Warden approves, your digital leave slip will activate.`;
  }
  if (q.includes('emergency') || q.includes('doctor') || q.includes('warden') || q.includes('guard')) {
    return `🚨 **HostelSync Emergency Directory**:
- **Warden Office**: +91 94231 55667 (Dr. Ramesh Patel)
- **Main Security Gate**: +91 91234 56789
- **Campus Health Clinic**: Intercom Ext #108
- **24/7 Hostel Helpline**: +91 800-HOSTEL-SYNC`;
  }

  return `👋 Hello ${userContext.name || 'there'}! I'm your **HostelSync AI Assistant**. 
You can ask me about:
- 🚪 Gate pass rules & curfew timings
- 🍱 Daily mess menu & meal timings
- ⚡ Submitting maintenance complaints & speed triage
- 📝 Leave application guidelines & parent notifications
- 🚨 Emergency contacts & warden office locations

How may I assist you today?`;
}

module.exports = {
  analyzeComplaintWithGemini,
  askHostelAI
};
