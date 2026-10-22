import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Application, Drive, User } from './models.js';

const app = express();
const resumeUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, callback) => {
  const extensionOk = /\.(pdf|doc|docx)$/i.test(file.originalname);
  const mimeOk = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype);
  callback(extensionOk && mimeOk ? null : new Error('Resume must be a PDF, DOC, or DOCX file.'), extensionOk && mimeOk);
} });
app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim()), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/v1/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: 'draft-8', legacyHeaders: false }));

const api = express.Router();
const idParam = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid record id');
const registerSchema = z.object({ fullName: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), password: z.string().min(8).max(128), rollNumber: z.string().trim().min(1).max(40), department: z.string().trim().min(1).max(80), graduationYear: z.coerce.number().int().min(2020).max(2040), cgpa: z.coerce.number().min(0).max(10), backlogs: z.coerce.number().int().min(0) });
const adminSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), password: z.string().min(8).max(128), role: z.literal('admin').optional() });
const driveSchema = z.object({ companyName: z.string().trim().min(1).max(120), role: z.string().trim().min(1).max(120), description: z.string().trim().min(1).max(10000), location: z.string().trim().min(1).max(160), packageLPA: z.coerce.number().nonnegative().nullable().optional(), externalApplicationUrl: z.union([z.literal(''), z.string().url().refine(value => ['http:', 'https:'].includes(new URL(value).protocol))]).optional(), eligibleBranches: z.array(z.string().trim().min(1)).min(1), minCGPA: z.coerce.number().min(0).max(10), maxBacklogs: z.coerce.number().int().min(0), eligibleGradYears: z.array(z.coerce.number().int().min(2020).max(2040)).min(1), applicationDeadline: z.string().date(), driveDate: z.string().date(), status: z.enum(['draft', 'open', 'closed']).optional() });
const statusSchema = z.object({ status: z.enum(['shortlisted', 'assessment', 'interview', 'selected', 'rejected']), note: z.string().trim().max(1000).optional().default('') });
const today = () => new Date().toISOString().slice(0, 10);
const safeUser = user => ({ id: String(user._id), name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber, department: user.department, graduationYear: user.graduationYear, cgpa: user.cgpa, backlogs: user.backlogs, skills: user.skills || [], placementStatus: user.placementStatus, resume: user.resume?.filename ? { filename: user.resume.filename, contentType: user.resume.contentType, size: user.resume.size, updatedAt: user.resume.updatedAt } : null });
const record = doc => { const value = doc.toObject ? doc.toObject() : { ...doc }; value.id = String(value._id); delete value._id; delete value.__v; if (value.studentId?.name) { value.student = safeUser(value.studentId); value.studentId = String(value.studentId._id); } else if (value.studentId) value.studentId = String(value.studentId); if (value.driveId) value.driveId = String(value.driveId._id || value.driveId); return value; };
const fail = (res, status, message) => res.status(status).json({ message });
const parsed = (schema, input, res) => { const result = schema.safeParse(input); if (!result.success) { fail(res, 400, result.error.issues.map(issue => issue.message).join('; ')); return null; } return result.data; };
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) return fail(res, 401, 'Authentication required.');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.role !== payload.role) return fail(res, 401, 'Session is no longer valid.');
    req.user = user;
    next();
  } catch { return fail(res, 401, 'Invalid or expired session.'); }
};
const adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : fail(res, 403, 'Administrator access required.');
const sign = user => jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h', issuer: 'campus-placement-tracker', audience: 'cpt-web' });

api.get('/health', (_req, res) => res.json({ status: 'ok', service: 'campus-placement-tracker-api' }));

api.post('/auth/register', async (req, res) => {
  const data = parsed(registerSchema, req.body, res); if (!data) return;
  const email = data.email.toLowerCase();
  if (await User.exists({ email })) return fail(res, 409, 'An account with this email already exists.');
  const user = await User.create({ name: data.fullName, email, passwordHash: await bcrypt.hash(data.password, 12), role: 'student', rollNumber: data.rollNumber, department: data.department, graduationYear: data.graduationYear, cgpa: data.cgpa, backlogs: data.backlogs, skills: [] });
  res.status(201).json({ user: safeUser(user), token: sign(user) });
});

api.post('/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return fail(res, 400, 'Email and password are required.');
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return fail(res, 401, 'Invalid email or password.');
  res.json({ user: safeUser(user), token: sign(user) });
});
api.get('/auth/me', auth, (req, res) => res.json(safeUser(req.user)));

api.post('/admin/users', auth, adminOnly, async (req, res) => {
  const data = parsed(adminSchema, req.body, res); if (!data) return;
  const email = data.email.toLowerCase();
  if (await User.exists({ email })) return fail(res, 409, 'An account with this email already exists.');
  const user = await User.create({ name: data.name, email, passwordHash: await bcrypt.hash(data.password, 12), role: 'admin' });
  res.status(201).json(safeUser(user));
});

api.get('/students/profile', auth, async (req, res) => req.user.role === 'student' ? res.json(safeUser(req.user)) : fail(res, 403, 'Student access required.'));
api.patch('/students/profile', auth, async (req, res) => {
  if (req.user.role !== 'student') return fail(res, 403, 'Student access required.');
  const allowed = ['name', 'department', 'graduationYear', 'cgpa', 'backlogs', 'skills'];
  const update = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
  if (update.skills && (!Array.isArray(update.skills) || update.skills.some(item => typeof item !== 'string' || item.length > 60))) return fail(res, 400, 'Skills must be a list of short text values.');
  const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true, runValidators: true });
  res.json(safeUser(user));
});
api.put('/students/profile/resume', auth, (req, res, next) => {
  if (req.user.role !== 'student') return fail(res, 403, 'Student access required.');
  resumeUpload.single('resume')(req, res, error => error ? fail(res, 400, error.message) : next());
}, async (req, res) => {
  if (!req.file) return fail(res, 400, 'Choose a resume file to upload.');
  const resume = { filename: req.file.originalname.replace(/[\r\n"\\/]/g, '_').slice(0, 200), contentType: req.file.mimetype, data: req.file.buffer, size: req.file.size, updatedAt: new Date() };
  await User.updateOne({ _id: req.user._id }, { $set: { resume } });
  res.json({ filename: resume.filename, contentType: resume.contentType, size: resume.size, url: '/api/v1/students/profile/resume' });
});
api.get('/students/profile/resume', auth, async (req, res) => {
  if (req.user.role !== 'student') return fail(res, 403, 'Student access required.');
  const user = await User.findById(req.user._id).select('+resume.data');
  if (!user?.resume?.data) return fail(res, 404, 'No resume is available.');
  const safeName = encodeURIComponent(user.resume.filename || 'resume');
  res.set({ 'Content-Type': user.resume.contentType, 'Content-Length': String(user.resume.size), 'Content-Disposition': `${user.resume.contentType === 'application/pdf' ? 'inline' : 'attachment'}; filename*=UTF-8''${safeName}`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' });
  res.send(user.resume.data);
});
api.delete('/students/profile/resume', auth, async (req, res) => {
  if (req.user.role !== 'student') return fail(res, 403, 'Student access required.');
  await User.updateOne({ _id: req.user._id }, { $unset: { resume: 1 } });
  res.status(204).end();
});
api.get('/students', auth, adminOnly, async (req, res) => {
  const filter = { role: 'student' };
  if (req.query.department) filter.department = req.query.department;
  if (req.query.graduationYear) filter.graduationYear = Number(req.query.graduationYear);
  const users = await User.find(filter).sort({ name: 1 });
  res.json(users.map(safeUser));
});
api.get('/students/:id', auth, adminOnly, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid student id.');
  const user = await User.findOne({ _id: req.params.id, role: 'student' });
  return user ? res.json(safeUser(user)) : fail(res, 404, 'Student not found.');
});

api.get('/drives', auth, async (req, res) => {
  const filter = {};
  if (req.user.role === 'student') filter.status = 'open';
  else if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
  if (req.query.search) filter.$or = [{ companyName: new RegExp(String(req.query.search).slice(0, 80), 'i') }, { role: new RegExp(String(req.query.search).slice(0, 80), 'i') }];
  if (req.query.location) filter.location = new RegExp(String(req.query.location).slice(0, 80), 'i');
  const drives = await Drive.find(filter).sort({ applicationDeadline: 1 });
  res.json(drives.map(record));
});
api.get('/drives/:id', auth, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid drive id.');
  const drive = await Drive.findById(req.params.id);
  return drive && (req.user.role === 'admin' || drive.status === 'open') ? res.json(record(drive)) : fail(res, 404, 'Drive not found.');
});
api.post('/drives', auth, adminOnly, async (req, res) => {
  const data = parsed(driveSchema, req.body, res); if (!data) return;
  if (data.driveDate < data.applicationDeadline) return fail(res, 400, 'Drive date must be on or after the application deadline.');
  res.status(201).json(record(await Drive.create({ ...data, createdBy: req.user._id })));
});
api.patch('/drives/:id', auth, adminOnly, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid drive id.');
  const data = parsed(driveSchema.partial(), req.body, res); if (!data) return;
  if (data.driveDate && data.applicationDeadline && data.driveDate < data.applicationDeadline) return fail(res, 400, 'Drive date must be on or after the application deadline.');
  const drive = await Drive.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  return drive ? res.json(record(drive)) : fail(res, 404, 'Drive not found.');
});
api.patch('/drives/:id/status', auth, adminOnly, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid drive id.');
  const status = z.enum(['open', 'closed', 'draft']).safeParse(req.body?.status);
  if (!status.success) return fail(res, 400, 'Invalid drive status.');
  const drive = await Drive.findByIdAndUpdate(req.params.id, { status: status.data }, { new: true });
  return drive ? res.json(record(drive)) : fail(res, 404, 'Drive not found.');
});
api.delete('/drives/:id', auth, adminOnly, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid drive id.');
  const drive = await Drive.findByIdAndDelete(req.params.id);
  return drive ? res.json({ ...record(drive), preservedApplications: await Application.countDocuments({ driveId: drive._id }) }) : fail(res, 404, 'Drive not found.');
});

api.get('/applications', auth, async (req, res) => {
  const filter = req.user.role === 'student' ? { studentId: req.user._id } : {};
  if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
  if (req.query.driveId && idParam.safeParse(String(req.query.driveId)).success) filter.driveId = req.query.driveId;
  const applications = await Application.find(filter).populate('studentId', 'name email rollNumber department graduationYear').sort({ appliedOn: -1 });
  res.json(applications.map(record));
});
api.get('/applications/:id', auth, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid application id.');
  const application = await Application.findById(req.params.id).populate('studentId', 'name email rollNumber department graduationYear');
  if (!application || (req.user.role === 'student' && !application.studentId._id.equals(req.user._id))) return fail(res, 404, 'Application not found.');
  res.json(record(application));
});
api.post('/drives/:id/applications', auth, async (req, res) => {
  if (req.user.role !== 'student') return fail(res, 403, 'Only students can apply to drives.');
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid drive id.');
  const drive = await Drive.findById(req.params.id);
  if (!drive || drive.status !== 'open') return fail(res, 404, 'This drive is unavailable.');
  if (drive.applicationDeadline < today()) return fail(res, 400, 'The application deadline has passed.');
  const eligible = (!drive.eligibleBranches.length || drive.eligibleBranches.includes(req.user.department)) && (req.user.cgpa ?? 0) >= drive.minCGPA && (req.user.backlogs ?? 0) <= drive.maxBacklogs && (!drive.eligibleGradYears.length || drive.eligibleGradYears.includes(req.user.graduationYear));
  if (!eligible) return fail(res, 403, 'You do not meet the eligibility criteria for this drive.');
  const external = Boolean(drive.externalApplicationUrl);
  const date = today();
  try {
    const application = await Application.create({ studentId: req.user._id, driveId: drive._id, companyName: drive.companyName, role: drive.role, appliedOn: date, lastUpdated: date, status: 'applied', nextStep: external ? 'External application marked as completed' : 'Awaiting shortlist', applicationMethod: external ? 'external' : 'portal', statusHistory: [{ status: 'applied', date, note: external ? 'Student confirmed external application completion' : '' }] });
    res.status(201).json(record(application));
  } catch (error) { if (error.code === 11000) return fail(res, 409, 'You have already applied to this drive.'); throw error; }
});
api.patch('/applications/:id/status', auth, adminOnly, async (req, res) => {
  if (!idParam.safeParse(req.params.id).success) return fail(res, 400, 'Invalid application id.');
  const update = parsed(statusSchema, req.body, res); if (!update) return;
  const application = await Application.findById(req.params.id);
  if (!application) return fail(res, 404, 'Application not found.');
  const transitions = { applied: ['shortlisted', 'rejected'], shortlisted: ['assessment', 'rejected'], assessment: ['interview', 'rejected'], interview: ['selected', 'rejected'], selected: [], rejected: [] };
  if (!transitions[application.status].includes(update.status)) return fail(res, 409, `Cannot move an application from ${application.status} to ${update.status}.`);
  application.status = update.status; application.lastUpdated = today(); application.nextStep = update.note || update.status; application.statusHistory.push({ status: update.status, date: today(), note: update.note });
  await application.save();
  res.json(record(await application.populate('studentId', 'name email rollNumber department graduationYear')));
});

api.get('/companies', auth, adminOnly, async (_req, res) => {
  const drives = await Drive.find(); const applications = await Application.find();
  const companies = new Map();
  for (const drive of drives) { const item = companies.get(drive.companyName) || { name: drive.companyName, roles: new Set(), drives: 0, applications: 0, selections: 0 }; item.roles.add(drive.role); item.drives++; companies.set(drive.companyName, item); }
  for (const application of applications) { const item = companies.get(application.companyName) || { name: application.companyName, roles: new Set(), drives: 0, applications: 0, selections: 0 }; item.applications++; if (application.status === 'selected') item.selections++; companies.set(application.companyName, item); }
  res.json([...companies.values()].map(item => ({ ...item, roles: [...item.roles] })));
});
api.get('/analytics/dashboard', auth, adminOnly, async (_req, res) => {
  const [students, drives, applications] = await Promise.all([User.find({ role: 'student' }).lean(), Drive.find().lean(), Application.find().lean()]);
  res.json({ students: students.map(record), drives: drives.map(record), applications: applications.map(record), activities: [] });
});
api.get('/analytics/reports', auth, adminOnly, async (req, res) => {
  const [students, drives, applications] = await Promise.all([User.find({ role: 'student' }).lean(), Drive.find().lean(), Application.find().lean()]);
  const year = req.query.graduationYear; const department = req.query.department;
  const selected = students.filter(student => (!year || year === 'all' || String(student.graduationYear) === String(year)) && (!department || department === 'all' || student.department === department));
  const ids = new Set(selected.map(student => String(student._id)));
  res.json({ students: selected.map(record), drives: drives.map(record), applications: applications.filter(application => ids.has(String(application.studentId))).map(record) });
});

app.use('/api/v1', api);
app.use((_req, res) => fail(res, 404, 'API endpoint not found.'));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === 'ValidationError') return fail(res, 400, error.message);
  if (error.code === 11000) return fail(res, 409, 'A record with this value already exists.');
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

export default app;
