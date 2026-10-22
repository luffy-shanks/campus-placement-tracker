import { currentStudentProfile, mockStudents } from '../data/mockData';
import { request } from './api';

let mockResume = null;

export const studentService = {
  list: params => request({ method: 'get', url: '/students', params }, () => [...mockStudents]),
  get: id => request({ method: 'get', url: `/students/${id}` }, () => mockStudents.find(student => student.id === id) || null),
  getProfile: () => request({ method: 'get', url: '/students/profile' }, () => currentStudentProfile),
  updateProfile: data => request({ method: 'patch', url: '/students/profile', data }, () => { Object.assign(currentStudentProfile, data); const item = mockStudents.find(s => s.id === currentStudentProfile.id); if (item) Object.assign(item, data); return currentStudentProfile; }),
  uploadResume: file => {
    const form = new FormData();
    form.append('resume', file);
    return request({ method: 'put', url: '/students/profile/resume', data: form, headers: { 'Content-Type': 'multipart/form-data' } }, () => {
      mockResume = file;
      return { filename: file.name, contentType: file.type, size: file.size };
    });
  },
  getResume: () => request({ method: 'get', url: '/students/profile/resume', responseType: 'blob' }, () => mockResume),
  deleteResume: () => request({ method: 'delete', url: '/students/profile/resume' }, () => { mockResume = null; }),
};
