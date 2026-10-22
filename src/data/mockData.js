// src/data/mockData.js
// Consistent mock data used across the entire application

export const mockStudents = [
  { id: 's1', name: 'John Doe', email: 'john@college.edu', rollNumber: 'CS2021001', department: 'CSE', graduationYear: 2025, cgpa: 8.5, backlogs: 0, skills: ['React', 'Node.js', 'Python'], placementStatus: 'placed' },
  { id: 's2', name: 'Priya Sharma', email: 'priya@college.edu', rollNumber: 'IT2021002', department: 'IT', graduationYear: 2025, cgpa: 9.1, backlogs: 0, skills: ['Java', 'Spring Boot', 'SQL'], placementStatus: 'placed' },
  { id: 's3', name: 'Rahul Verma', email: 'rahul@college.edu', rollNumber: 'ECE2021003', department: 'ECE', graduationYear: 2025, cgpa: 7.8, backlogs: 1, skills: ['Embedded C', 'MATLAB'], placementStatus: 'not_placed' },
  { id: 's4', name: 'Ananya Gupta', email: 'ananya@college.edu', rollNumber: 'CS2021004', department: 'CSE', graduationYear: 2025, cgpa: 8.9, backlogs: 0, skills: ['JavaScript', 'React', 'AWS'], placementStatus: 'placed' },
  { id: 's5', name: 'Vikram Singh', email: 'vikram@college.edu', rollNumber: 'EEE2021005', department: 'EEE', graduationYear: 2025, cgpa: 7.2, backlogs: 2, skills: ['Python', 'AutoCAD'], placementStatus: 'not_placed' },
  { id: 's6', name: 'Sneha Reddy', email: 'sneha@college.edu', rollNumber: 'IT2021006', department: 'IT', graduationYear: 2025, cgpa: 8.3, backlogs: 0, skills: ['Django', 'PostgreSQL', 'Docker'], placementStatus: 'placed' },
  { id: 's7', name: 'Arjun Patel', email: 'arjun@college.edu', rollNumber: 'CS2021007', department: 'CSE', graduationYear: 2025, cgpa: 9.4, backlogs: 0, skills: ['C++', 'Algorithms', 'ML'], placementStatus: 'placed' },
  { id: 's8', name: 'Meera Nair', email: 'meera@college.edu', rollNumber: 'ECE2021008', department: 'ECE', graduationYear: 2025, cgpa: 8.0, backlogs: 0, skills: ['VHDL', 'IoT', 'Python'], placementStatus: 'not_placed' },
  { id: 's9', name: 'Karthik Iyer', email: 'karthik@college.edu', rollNumber: 'CS2021009', department: 'CSE', graduationYear: 2026, cgpa: 8.7, backlogs: 0, skills: ['React', 'TypeScript', 'Go'], placementStatus: 'not_placed' },
  { id: 's10', name: 'Divya Menon', email: 'divya@college.edu', rollNumber: 'IT2021010', department: 'IT', graduationYear: 2026, cgpa: 7.6, backlogs: 1, skills: ['PHP', 'Laravel', 'MySQL'], placementStatus: 'not_placed' },
];

export const mockCompanies = [
  { id: 'c1', name: 'Google', industry: 'Technology', location: 'Bangalore' },
  { id: 'c2', name: 'Microsoft', industry: 'Technology', location: 'Hyderabad' },
  { id: 'c3', name: 'Amazon', industry: 'E-Commerce / Cloud', location: 'Bangalore' },
  { id: 'c4', name: 'Infosys', industry: 'IT Services', location: 'Pune' },
  { id: 'c5', name: 'TCS', industry: 'IT Services', location: 'Mumbai' },
];

export const mockDrives = [
  {
    id: 'd1', companyId: 'c1', companyName: 'Google', role: 'Software Engineer', description: 'Full-time SDE role working on cloud infrastructure and large-scale distributed systems.', location: 'Bangalore', packageLPA: 25, eligibleBranches: ['CSE', 'IT'], minCGPA: 8.0, maxBacklogs: 0, eligibleGradYears: [2025], applicationDeadline: '2025-03-15', driveDate: '2025-03-25', status: 'open',
  },
  {
    id: 'd2', companyId: 'c2', companyName: 'Microsoft', role: 'Full Stack Developer', description: 'Build scalable web applications using React and .NET for enterprise clients.', location: 'Hyderabad', packageLPA: 22, eligibleBranches: ['CSE', 'IT', 'ECE'], minCGPA: 7.5, maxBacklogs: 0, eligibleGradYears: [2025], applicationDeadline: '2025-03-20', driveDate: '2025-04-01', status: 'open',
  },
  {
    id: 'd3', companyId: 'c3', companyName: 'Amazon', role: 'SDE Intern', description: 'Summer internship with the possibility of a pre-placement offer. Work on AWS services.', location: 'Bangalore', packageLPA: 12, eligibleBranches: ['CSE', 'IT'], minCGPA: 7.0, maxBacklogs: 0, eligibleGradYears: [2026], applicationDeadline: '2025-02-28', driveDate: '2025-03-10', status: 'closed',
  },
  {
    id: 'd4', companyId: 'c4', companyName: 'Infosys', role: 'Systems Engineer', description: 'Entry-level role in IT services, consulting, and digital transformation projects.', location: 'Pune', packageLPA: 6.5, eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'], minCGPA: 6.0, maxBacklogs: 2, eligibleGradYears: [2025, 2026], applicationDeadline: '2025-04-10', driveDate: '2025-04-20', status: 'open',
  },
  {
    id: 'd5', companyId: 'c5', companyName: 'TCS', role: 'Assistant Systems Engineer', description: 'TCS NQT-based hiring for engineering graduates across all branches.', location: 'Mumbai', packageLPA: 4.5, eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'], minCGPA: 6.0, maxBacklogs: 1, eligibleGradYears: [2025], applicationDeadline: '2025-03-30', driveDate: '2025-04-05', status: 'open',
  },
  {
    id: 'd6', companyId: 'c1', companyName: 'Google', role: 'Data Analyst', description: 'Analyze large datasets to derive business insights using SQL and Python.', location: 'Bangalore', packageLPA: 18, eligibleBranches: ['CSE', 'IT'], minCGPA: 8.5, maxBacklogs: 0, eligibleGradYears: [2025], applicationDeadline: '2025-04-05', driveDate: '2025-04-15', status: 'open',
  },
  {
    id: 'd7', companyId: 'c3', companyName: 'Amazon', role: 'Cloud Support Engineer', description: 'Provide technical support and troubleshooting for AWS cloud services.', location: 'Hyderabad', packageLPA: 10, eligibleBranches: ['CSE', 'IT', 'ECE'], minCGPA: 7.0, maxBacklogs: 0, eligibleGradYears: [2025, 2026], applicationDeadline: '2025-04-12', driveDate: '2025-04-22', status: 'open',
  },
  {
    id: 'd8', companyId: 'c2', companyName: 'Microsoft', role: 'Program Manager', description: 'Lead cross-functional teams to ship products and features at scale.', location: 'Bangalore', packageLPA: 20, eligibleBranches: ['CSE', 'IT'], minCGPA: 8.0, maxBacklogs: 0, eligibleGradYears: [2025], applicationDeadline: '2025-03-28', driveDate: '2025-04-08', status: 'open',
  },
];

export const mockApplications = [
  { id: 'a1', studentId: 's1', driveId: 'd1', companyName: 'Google', role: 'Software Engineer', appliedOn: '2025-02-20', status: 'selected', lastUpdated: '2025-03-25', nextStep: 'Offer letter', statusHistory: [ { status: 'applied', date: '2025-02-20' }, { status: 'shortlisted', date: '2025-02-28' }, { status: 'assessment', date: '2025-03-05' }, { status: 'interview', date: '2025-03-18' }, { status: 'selected', date: '2025-03-25' } ] },
  { id: 'a2', studentId: 's1', driveId: 'd2', companyName: 'Microsoft', role: 'Full Stack Developer', appliedOn: '2025-02-22', status: 'interview', lastUpdated: '2025-03-15', nextStep: 'HR Round on Mar 20', statusHistory: [ { status: 'applied', date: '2025-02-22' }, { status: 'shortlisted', date: '2025-03-01' }, { status: 'assessment', date: '2025-03-08' }, { status: 'interview', date: '2025-03-15' } ] },
  { id: 'a3', studentId: 's1', driveId: 'd4', companyName: 'Infosys', role: 'Systems Engineer', appliedOn: '2025-03-01', status: 'applied', lastUpdated: '2025-03-01', nextStep: 'Awaiting shortlist', statusHistory: [ { status: 'applied', date: '2025-03-01' } ] },
  { id: 'a4', studentId: 's1', driveId: 'd5', companyName: 'TCS', role: 'Assistant Systems Engineer', appliedOn: '2025-03-05', status: 'rejected', lastUpdated: '2025-03-20', nextStep: '–', statusHistory: [ { status: 'applied', date: '2025-03-05' }, { status: 'shortlisted', date: '2025-03-10' }, { status: 'rejected', date: '2025-03-20' } ] },
  { id: 'a5', studentId: 's2', driveId: 'd2', companyName: 'Microsoft', role: 'Full Stack Developer', appliedOn: '2025-02-23', status: 'selected', lastUpdated: '2025-04-01', nextStep: 'Offer letter', statusHistory: [ { status: 'applied', date: '2025-02-23' }, { status: 'shortlisted', date: '2025-03-02' }, { status: 'assessment', date: '2025-03-10' }, { status: 'interview', date: '2025-03-22' }, { status: 'selected', date: '2025-04-01' } ] },
  { id: 'a6', studentId: 's3', driveId: 'd5', companyName: 'TCS', role: 'Assistant Systems Engineer', appliedOn: '2025-03-06', status: 'shortlisted', lastUpdated: '2025-03-12', nextStep: 'Online assessment on Mar 18', statusHistory: [ { status: 'applied', date: '2025-03-06' }, { status: 'shortlisted', date: '2025-03-12' } ] },
  { id: 'a7', studentId: 's4', driveId: 'd1', companyName: 'Google', role: 'Software Engineer', appliedOn: '2025-02-21', status: 'selected', lastUpdated: '2025-03-25', nextStep: 'Offer letter', statusHistory: [ { status: 'applied', date: '2025-02-21' }, { status: 'shortlisted', date: '2025-02-28' }, { status: 'assessment', date: '2025-03-05' }, { status: 'interview', date: '2025-03-18' }, { status: 'selected', date: '2025-03-25' } ] },
  { id: 'a8', studentId: 's4', driveId: 'd8', companyName: 'Microsoft', role: 'Program Manager', appliedOn: '2025-03-02', status: 'assessment', lastUpdated: '2025-03-12', nextStep: 'Assessment on Mar 16', statusHistory: [ { status: 'applied', date: '2025-03-02' }, { status: 'shortlisted', date: '2025-03-08' }, { status: 'assessment', date: '2025-03-12' } ] },
  { id: 'a9', studentId: 's5', driveId: 'd4', companyName: 'Infosys', role: 'Systems Engineer', appliedOn: '2025-03-03', status: 'applied', lastUpdated: '2025-03-03', nextStep: 'Awaiting shortlist', statusHistory: [ { status: 'applied', date: '2025-03-03' } ] },
  { id: 'a10', studentId: 's6', driveId: 'd2', companyName: 'Microsoft', role: 'Full Stack Developer', appliedOn: '2025-02-24', status: 'interview', lastUpdated: '2025-03-16', nextStep: 'HR Round on Mar 22', statusHistory: [ { status: 'applied', date: '2025-02-24' }, { status: 'shortlisted', date: '2025-03-03' }, { status: 'assessment', date: '2025-03-10' }, { status: 'interview', date: '2025-03-16' } ] },
  { id: 'a11', studentId: 's7', driveId: 'd1', companyName: 'Google', role: 'Software Engineer', appliedOn: '2025-02-19', status: 'selected', lastUpdated: '2025-03-25', nextStep: 'Offer letter', statusHistory: [ { status: 'applied', date: '2025-02-19' }, { status: 'shortlisted', date: '2025-02-27' }, { status: 'assessment', date: '2025-03-04' }, { status: 'interview', date: '2025-03-17' }, { status: 'selected', date: '2025-03-25' } ] },
  { id: 'a12', studentId: 's7', driveId: 'd6', companyName: 'Google', role: 'Data Analyst', appliedOn: '2025-03-10', status: 'shortlisted', lastUpdated: '2025-03-18', nextStep: 'Assessment on Mar 25', statusHistory: [ { status: 'applied', date: '2025-03-10' }, { status: 'shortlisted', date: '2025-03-18' } ] },
  { id: 'a13', studentId: 's8', driveId: 'd7', companyName: 'Amazon', role: 'Cloud Support Engineer', appliedOn: '2025-03-15', status: 'applied', lastUpdated: '2025-03-15', nextStep: 'Awaiting shortlist', statusHistory: [ { status: 'applied', date: '2025-03-15' } ] },
  { id: 'a14', studentId: 's9', driveId: 'd4', companyName: 'Infosys', role: 'Systems Engineer', appliedOn: '2025-03-20', status: 'applied', lastUpdated: '2025-03-20', nextStep: 'Awaiting shortlist', statusHistory: [ { status: 'applied', date: '2025-03-20' } ] },
  { id: 'a15', studentId: 's10', driveId: 'd4', companyName: 'Infosys', role: 'Systems Engineer', appliedOn: '2025-03-21', status: 'shortlisted', lastUpdated: '2025-03-28', nextStep: 'Online assessment on Apr 2', statusHistory: [ { status: 'applied', date: '2025-03-21' }, { status: 'shortlisted', date: '2025-03-28' } ] },
];

// Current logged-in student profile (used by student pages)
export const currentStudentProfile = {
  id: 's1',
  name: 'John Doe',
  email: 'john@college.edu',
  rollNumber: 'CS2021001',
  department: 'CSE',
  graduationYear: 2025,
  cgpa: 8.5,
  backlogs: 0,
  skills: ['React', 'Node.js', 'Python', 'MongoDB', 'Docker'],
};

// Activity feed for admin dashboard
export const mockActivities = [
  { id: 'act1', type: 'drive_published', message: 'Google – Software Engineer drive published', timestamp: '2025-02-18T10:30:00Z' },
  { id: 'act2', type: 'application', message: 'John Doe applied to Google – Software Engineer', timestamp: '2025-02-20T14:15:00Z' },
  { id: 'act3', type: 'status_update', message: 'Priya Sharma shortlisted for Microsoft – Full Stack Developer', timestamp: '2025-03-02T09:00:00Z' },
  { id: 'act4', type: 'student_registered', message: 'New student registered: Karthik Iyer', timestamp: '2025-03-05T11:45:00Z' },
  { id: 'act5', type: 'drive_closed', message: 'Amazon – SDE Intern drive closed', timestamp: '2025-03-10T17:00:00Z' },
  { id: 'act6', type: 'status_update', message: 'Arjun Patel selected by Google – Software Engineer', timestamp: '2025-03-25T16:00:00Z' },
];
