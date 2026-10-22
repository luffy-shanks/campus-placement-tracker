import { mockActivities, mockApplications, mockDrives, mockStudents } from '../data/mockData';
import { request } from './api';

export const analyticsService = {
  dashboard: () => request({ method: 'get', url: '/analytics/dashboard' }, () => ({ students: mockStudents, drives: mockDrives, applications: mockApplications, activities: mockActivities })),
  report: params => request({ method: 'get', url: '/analytics/reports', params }, () => ({ students: mockStudents, drives: mockDrives, applications: mockApplications })),
};
