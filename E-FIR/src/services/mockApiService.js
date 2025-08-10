// src/services/mockApiService.js
// This file is for development/testing ONLY.
// Replace direct calls to these functions with calls to your actual backend API (via api.js).

import { FIR_STATUSES, ROLES } from '../utils/constants';

// --- Mock Data ---
let mockUsers = [
  { id: 'user1', name: 'John Doe', email: 'user@example.com', password: 'password123', role: ROLES.PUBLIC },
  { id: 'admin1', name: 'Super Admin', email: 'admin@example.com', password: 'adminpassword', role: ROLES.ADMIN },
  { id: 'officer1', name: 'Officer Smith', email: 'officer@example.com', password: 'officerpassword', role: ROLES.POLICE_OFFICER },
];

let mockFirs = [
  {
    id: 'fir001',
    firNo: 'FIR/2024/001',
    title: 'Theft at Sector 17',
    description: 'A theft occurred at a residential property in Sector 17, Chandigarh. Valuables missing.',
    complainantName: 'Alice Johnson',
    incidentDate: '2024-05-10T10:00:00Z',
    incidentLocation: 'House No. 123, Sector 17, Chandigarh',
    currentStatus: FIR_STATUSES.REGISTERED,
    registeredAt: '2024-05-10T12:30:00Z',
    updatedAt: '2024-05-10T12:30:00Z',
    assignedTo: null,
    adminNotes: '',
    statusHistory: [
      { oldStatus: null, newStatus: FIR_STATUSES.REGISTERED, changedBy: 'System', changedAt: '2024-05-10T12:30:00Z', remarks: 'FIR registered by complainant online.' }
    ]
  },
  {
    id: 'fir002',
    firNo: 'FIR/2024/002',
    title: 'Missing Person Report',
    description: 'My son, David, aged 15, went missing from home on 2024-05-12.',
    complainantName: 'Maria Rodriguez',
    incidentDate: '2024-05-12T08:00:00Z',
    incidentLocation: 'Home Address',
    currentStatus: FIR_STATUSES.UNDER_INVESTIGATION,
    registeredAt: '2024-05-12T14:00:00Z',
    updatedAt: '2024-05-13T09:00:00Z',
    assignedTo: 'Officer Smith',
    adminNotes: '',
    statusHistory: [
      { oldStatus: null, newStatus: FIR_STATUSES.REGISTERED, changedBy: 'System', changedAt: '2024-05-12T14:00:00Z', remarks: 'FIR registered online.' },
      { oldStatus: FIR_STATUSES.REGISTERED, newStatus: FIR_STATUSES.UNDER_INVESTIGATION, changedBy: 'Officer Smith', changedAt: '2024-05-13T09:00:00Z', remarks: 'Initial inquiry started.' }
    ]
  },
  {
    id: 'fir003',
    firNo: 'FIR/2024/003',
    title: 'Traffic Accident',
    description: 'Minor fender bender on main street.',
    complainantName: 'Bob Williams',
    incidentDate: '2024-05-15T16:00:00Z',
    incidentLocation: 'Main Street, near City Hall',
    currentStatus: FIR_STATUSES.CLOSED,
    registeredAt: '2024-05-15T17:00:00Z',
    updatedAt: '2024-05-16T10:00:00Z',
    assignedTo: 'Officer Smith',
    adminNotes: 'Resolved with mutual agreement.',
    statusHistory: [
      { oldStatus: null, newStatus: FIR_STATUSES.REGISTERED, changedBy: 'System', changedAt: '2024-05-15T17:00:00Z', remarks: 'FIR registered.' },
      { oldStatus: FIR_STATUSES.REGISTERED, newStatus: FIR_STATUSES.CLOSED, changedBy: 'Officer Smith', changedAt: '2024-05-16T10:00:00Z', remarks: 'Case closed, parties reached agreement.' }
    ]
  },
  // Add more mock FIRs as needed
];

// --- Mock API Functions ---

const generateToken = (userId, role) => `mock-jwt-${userId}-${role}-${Date.now()}`;

export const mockAuthService = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const token = generateToken(user.id, user.role);
      // In a real app, you'd send minimal user data here for security
      return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    }
    throw new Error('Invalid credentials');
  },
  // Mock registration (for public users)
  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      name,
      email,
      password, // In real app, hash this!
      role: ROLES.PUBLIC,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  }
  // You might add a /auth/me equivalent here for token verification
};

export const mockFirService = {
  getAllFirs: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredFirs = [...mockFirs];

    if (params.status) {
      filteredFirs = filteredFirs.filter(fir => fir.currentStatus === params.status);
    }
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredFirs = filteredFirs.filter(fir =>
        fir.firNo.toLowerCase().includes(searchTerm) ||
        fir.title.toLowerCase().includes(searchTerm) ||
        fir.complainantName.toLowerCase().includes(searchTerm)
      );
    }

    const totalCount = filteredFirs.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedFirs = filteredFirs.slice(startIndex, endIndex);

    return { firs: paginatedFirs, totalCount };
  },

  getFirById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const fir = mockFirs.find(f => f.id === id);
    if (fir) {
      return { ...fir }; // Return a copy to prevent direct modification
    }
    throw new Error('FIR not found');
  },

  updateFirStatus: async (firId, newStatus, remarks, changedById, changedByName) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const firIndex = mockFirs.findIndex(f => f.id === firId);
    if (firIndex !== -1) {
      const fir = mockFirs[firIndex];
      const oldStatus = fir.currentStatus;

      // Add to status history
      if (!fir.statusHistory) fir.statusHistory = [];
      fir.statusHistory.push({
        oldStatus: oldStatus,
        newStatus: newStatus,
        changedBy: changedByName || 'Admin/Officer', // In real app, get from changedById
        changedAt: new Date().toISOString(),
        remarks: remarks
      });
      fir.currentStatus = newStatus;
      fir.updatedAt = new Date().toISOString();
      mockFirs[firIndex] = fir; // Update in mock array

      return { message: 'FIR status updated successfully', fir };
    }
    throw new Error('FIR not found for update');
  },

  getDashboardSummary: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const totalFirs = mockFirs.length;
    const firsByStatus = {};
    Object.keys(FIR_STATUSES).forEach(key => firsByStatus[FIR_STATUSES[key]] = 0); // Initialize all statuses
    mockFirs.forEach(fir => {
      firsByStatus[fir.currentStatus] = (firsByStatus[fir.currentStatus] || 0) + 1;
    });
    return { totalFirs, firsByStatus };
  }
};

export const mockUserService = {
  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, you'd filter out sensitive info like passwords
    return mockUsers.map(({ password, ...rest }) => rest);
  },
  createUser: async (name, email, password, role) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    const newUser = {
      id: `user${Date.now()}`,
      name,
      email,
      password, // In real app, hash this!
      role,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { ...newUser, password: '***' }; // Don't return password
  },
  updateUser: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');

    const user = mockUsers[userIndex];
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.role) user.role = data.role;
    if (data.password) user.password = data.password; // In real app, hash this!
    user.updatedAt = new Date().toISOString();

    mockUsers[userIndex] = user;
    return { ...user, password: '***' };
  },
  deleteUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const initialLength = mockUsers.length;
    mockUsers = mockUsers.filter(u => u.id !== id);
    if (mockUsers.length === initialLength) throw new Error('User not found');
    return { message: 'User deleted successfully' };
  }
};