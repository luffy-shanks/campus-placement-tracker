import { mockCompanies, mockDrives, mockApplications } from '../data/mockData';
import { request } from './api';

export const companyService = {
  list: () => request({ method: 'get', url: '/companies' }, () => mockCompanies.map(company => {
    const drives = mockDrives.filter(drive => drive.companyName === company.name);
    const applications = mockApplications.filter(app => app.companyName === company.name);
    return { ...company, roles: [...new Set(drives.map(drive => drive.role))], drives: drives.length, applications: applications.length, selections: applications.filter(app => app.status === 'selected').length };
  })),
};
