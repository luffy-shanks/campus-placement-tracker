import { mockApplications } from '../data/mockData';
import { request } from './api';

export const applicationService = {
  list: params => request({ method: 'get', url: '/applications', params }, () => [...mockApplications]),
  get: id => request({ method: 'get', url: `/applications/${id}` }, () => mockApplications.find(app => app.id === id) || null),
  apply: (drive, { external = false } = {}) => request({ method: 'post', url: `/drives/${drive.id}/applications`, data: { external } }, () => {
    const studentId = JSON.parse(localStorage.getItem('cpt_user') || '{}').id || 's1';
    if (mockApplications.some(app => app.driveId === drive.id && app.studentId === studentId)) throw new Error('You have already applied to this drive.');
    const app = { id: `a${Date.now()}`, studentId, driveId: drive.id, companyName: drive.companyName, role: drive.role, appliedOn: new Date().toISOString().slice(0, 10), lastUpdated: new Date().toISOString().slice(0, 10), status: 'applied', nextStep: external ? 'External application marked as completed' : 'Awaiting shortlist', applicationMethod: external ? 'external' : 'portal', statusHistory: [{ status: 'applied', date: new Date().toISOString().slice(0, 10), note: external ? 'Student confirmed external application completion' : '' }] };
    mockApplications.unshift(app); return app;
  }),
  updateStatus: (id, status, note = '') => request({ method: 'patch', url: `/applications/${id}/status`, data: { status, note } }, () => {
    const app = mockApplications.find(item => item.id === id); if (!app) throw new Error('Application not found');
    const next = { applied: ['shortlisted','rejected'], shortlisted: ['assessment','rejected'], assessment: ['interview','rejected'], interview: ['selected','rejected'], selected: [], rejected: [] };
    if (!next[app.status]?.includes(status)) throw new Error(`Cannot move an application from ${app.status} to ${status}.`);
    const date = new Date().toISOString().slice(0, 10); app.status = status; app.lastUpdated = date; app.nextStep = note || status; app.statusHistory.push({ status, date, note }); return app;
  }),
};
