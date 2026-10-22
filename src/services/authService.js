import { currentStudentProfile, mockStudents } from '../data/mockData';
import { request } from './api';

const demoUsers = [
  { id: 's1', email: 'student@example.com', password: 'password123', name: 'John Doe', role: 'student', token: 'demo-student-token' },
  { id: 'a1', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin', token: 'demo-admin-token' },
];

export const authService = {
  login: async (email, password) => {
    const result = await request({ method: 'post', url: '/auth/login', data: { email, password } }, () => {
    const createdAdmins = JSON.parse(localStorage.getItem('cpt_admin_accounts') || '[]');
    const user = [...demoUsers, ...createdAdmins].find(item => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) throw new Error('Invalid email or password. Try student@example.com / password123 or admin@example.com / admin123');
    const { password: _secret, ...safeUser } = user;
    return safeUser;
    });
    return result.user ? { ...result.user, token: result.token || result.user.token } : result;
  },
  register: async data => {
    const studentData = { ...data, role: 'student' };
    const result = await request({ method: 'post', url: '/auth/register', data: studentData }, () => {
    const student = {
      id: `s-new-${Date.now()}`, name: data.fullName, email: data.email, role: 'student', token: 'registered-student-token',
      rollNumber: data.rollNumber, department: data.department, graduationYear: Number(data.graduationYear), cgpa: Number(data.cgpa), backlogs: Number(data.backlogs), skills: [],
    };
    const { token, role, ...profile } = student;
    mockStudents.push({ ...profile, placementStatus: 'not_placed' });
    Object.assign(currentStudentProfile, profile);
    return student;
    });
    return result.user ? { ...result.user, token: result.token || result.user.token } : result;
  },
  createAdmin: data => request({ method: 'post', url: '/admin/users', data: { ...data, role: 'admin' } }, () => {
    const existing = JSON.parse(localStorage.getItem('cpt_admin_accounts') || '[]');
    const normalizedEmail = data.email.trim().toLowerCase();
    if ([...demoUsers, ...existing].some(user => user.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }
    const admin = { id: `a-${Date.now()}`, name: data.name.trim(), email: normalizedEmail, password: data.password, role: 'admin', token: `admin-${Date.now()}` };
    localStorage.setItem('cpt_admin_accounts', JSON.stringify([...existing, admin]));
    const { password: _secret, ...safeAdmin } = admin;
    return safeAdmin;
  }),
  me: () => request({ method: 'get', url: '/auth/me' }, () => JSON.parse(localStorage.getItem('cpt_user') || 'null')),
};
