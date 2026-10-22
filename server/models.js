import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, default: null, select: false },
  role: { type: String, enum: ['student', 'admin'], required: true },
  rollNumber: { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: '' },
  graduationYear: { type: Number, default: null },
  cgpa: { type: Number, default: null },
  backlogs: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  placementStatus: { type: String, default: 'not_placed' },
  resume: {
    filename: { type: String, default: '' },
    contentType: { type: String, default: '' },
    data: { type: Buffer, select: false },
    size: { type: Number, default: 0 },
    updatedAt: { type: Date, default: null },
  },
}, { timestamps: true });

const driveSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  companyId: { type: String, default: '' },
  role: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  packageLPA: { type: Number, default: null },
  externalApplicationUrl: { type: String, default: '' },
  eligibleBranches: { type: [String], default: [] },
  minCGPA: { type: Number, min: 0, max: 10, default: 0 },
  maxBacklogs: { type: Number, min: 0, default: 0 },
  eligibleGradYears: { type: [Number], default: [] },
  applicationDeadline: { type: String, required: true },
  driveDate: { type: String, required: true },
  status: { type: String, enum: ['draft', 'open', 'closed'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const historySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String, default: '' },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true, index: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  appliedOn: { type: String, required: true },
  lastUpdated: { type: String, required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'assessment', 'interview', 'selected', 'rejected'], default: 'applied' },
  nextStep: { type: String, default: 'Awaiting shortlist' },
  applicationMethod: { type: String, enum: ['portal', 'external'], default: 'portal' },
  statusHistory: { type: [historySchema], default: [] },
}, { timestamps: true });
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const Drive = mongoose.model('Drive', driveSchema);
export const Application = mongoose.model('Application', applicationSchema);
