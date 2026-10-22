import { mockDrives, mockApplications } from '../data/mockData';
import { request } from './api';

export const driveService = {
  list: params => request({ method: 'get', url: '/drives', params }, () => [...mockDrives]),
  get: id => request({ method: 'get', url: `/drives/${id}` }, () => mockDrives.find(drive => drive.id === id) || null),
  create: data => request({ method: 'post', url: '/drives', data }, () => { const drive = { ...data, id: `d${Date.now()}` }; mockDrives.unshift(drive); return drive; }),
  update: (id, data) => request({ method: 'patch', url: `/drives/${id}`, data }, () => { const drive = mockDrives.find(item => item.id === id); if (!drive) throw new Error('Drive not found'); Object.assign(drive, data); return drive; }),
  setStatus: (id, status) => request({ method: 'patch', url: `/drives/${id}/status`, data: { status } }, () => { const drive = mockDrives.find(item => item.id === id); if (!drive) throw new Error('Drive not found'); drive.status = status; return drive; }),
  remove: id => request({ method: 'delete', url: `/drives/${id}` }, () => { const index = mockDrives.findIndex(item => item.id === id); if (index < 0) throw new Error('Drive not found'); const [drive] = mockDrives.splice(index, 1); return { ...drive, preservedApplications: mockApplications.filter(app => app.driveId === id).length }; }),
};
