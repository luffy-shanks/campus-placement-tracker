// src/pages/student/DriveDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, IndianRupee, Calendar, GraduationCap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockDrives, mockApplications, currentStudentProfile } from '../../data/mockData';
import { checkEligibility, getEligibilityLabel, getEligibilityClasses } from '../../utils/eligibility';
import { formatDate, daysRemaining } from '../../utils/helpers';
import { applicationService } from '../../services/applicationService';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { driveService } from '../../services/driveService';

const DriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const student = { ...currentStudentProfile, ...user };
  const [drive, setDrive] = useState(() => mockDrives.find(d => d.id === id) || null);
  const [applications, setApplications] = useState(mockApplications);
  const [showConfirm, setShowConfirm] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([driveService.get(id), applicationService.list()]).then(([nextDrive, nextApplications]) => {
      if (!active) return;
      setDrive(nextDrive);
      setApplications(nextApplications);
    }).catch(error => toast.error(error.message || 'Could not load this drive.'));
    return () => { active = false; };
  }, [id]);

  if (!drive) {
    return (
      <div className="text-center py-20">
        <p className="text-charcoal/50 text-lg">Drive not found.</p>
        <Link to="/student/drives" className="text-cobaltBlue font-medium hover:underline mt-4 inline-block">← Back to Drives</Link>
      </div>
    );
  }

  const alreadyApplied = applications.some(a => a.studentId === student.id && a.driveId === drive.id);
  const existingApp = applications.find(a => a.studentId === student.id && a.driveId === drive.id);
  const eligResult = checkEligibility(student, drive);
  const eligLabel = getEligibilityLabel(student, drive);
  const eligClass = getEligibilityClasses(eligLabel);
  const days = daysRemaining(drive.applicationDeadline);
  const expired = drive.status === 'closed' || days <= 0;

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.apply(drive, { external: Boolean(drive.externalApplicationUrl) });
      setApplications(current => [...current, { studentId: student.id, driveId: drive.id, status: 'applied' }]);
      toast.success(`Application submitted for ${drive.companyName} – ${drive.role}`);
      setShowConfirm(false);
      navigate('/student/applications');
    } catch (error) {
      toast.error(error.message || 'Could not submit your application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to="/student/drives" className="inline-flex items-center gap-1 text-cobaltBlue font-medium hover:underline text-sm">
        <ArrowLeft size={16} /> Back to Drives
      </Link>

      {/* Header */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">{drive.companyName}</h1>
            <p className="text-lg text-charcoal/70 mt-1">{drive.role}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${eligClass}`}>{eligLabel}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-charcoal/60 mt-4">
          <span className="flex items-center gap-1"><MapPin size={14} />{drive.location}</span>
          {drive.packageLPA && <span className="flex items-center gap-1"><IndianRupee size={14} />{drive.packageLPA} LPA</span>}
          <span className="flex items-center gap-1"><Calendar size={14} />Deadline: {formatDate(drive.applicationDeadline)}</span>
          <span className="flex items-center gap-1"><Calendar size={14} />Drive: {formatDate(drive.driveDate)}</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        <h2 className="text-lg font-semibold text-charcoal mb-3">Job Description</h2>
        <p className="text-charcoal/70 leading-relaxed">{drive.description}</p>
      </div>

      {/* Eligibility */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        <h2 className="text-lg font-semibold text-charcoal mb-3">Eligibility Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2"><GraduationCap size={14} className="text-cobaltBlue" /><span>Branches: {drive.eligibleBranches.join(', ')}</span></div>
          <div className="flex items-center gap-2"><GraduationCap size={14} className="text-cobaltBlue" /><span>Min CGPA: {drive.minCGPA}</span></div>
          <div className="flex items-center gap-2"><GraduationCap size={14} className="text-cobaltBlue" /><span>Max Backlogs: {drive.maxBacklogs}</span></div>
          <div className="flex items-center gap-2"><GraduationCap size={14} className="text-cobaltBlue" /><span>Grad Years: {drive.eligibleGradYears.join(', ')}</span></div>
        </div>

        {/* Eligibility result */}
        <div className={`mt-4 p-3 rounded-lg border ${eligResult.eligible ? 'bg-successGreen/5 border-successGreen/20' : 'bg-signalRed/5 border-signalRed/20'}`}>
          <div className="flex items-center gap-2 mb-1">
            {eligResult.eligible ? <CheckCircle size={16} className="text-successGreen" /> : <XCircle size={16} className="text-signalRed" />}
            <span className={`font-medium ${eligResult.eligible ? 'text-successGreen' : 'text-signalRed'}`}>
              {eligResult.eligible ? 'You are eligible for this drive' : 'You are not eligible for this drive'}
            </span>
          </div>
          {!eligResult.eligible && (
            <ul className="ml-6 text-sm text-signalRed/80 list-disc">
              {eligResult.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        {alreadyApplied ? (
          <div className="flex items-center gap-2 text-successGreen">
            <CheckCircle size={20} />
            <div>
              <p className="font-semibold">You have already applied</p>
              <p className="text-sm text-charcoal/60">Current status: <span className="font-medium capitalize">{existingApp?.status}</span></p>
            </div>
          </div>
        ) : expired ? (
          <div className="flex items-center gap-2 text-charcoal/50">
            <AlertCircle size={20} />
            <span className="font-medium">This drive is closed. Applications are no longer accepted.</span>
          </div>
        ) : !eligResult.eligible ? (
          <div className="flex items-center gap-2 text-signalRed/70">
            <XCircle size={20} />
            <span className="font-medium">You do not meet the eligibility criteria for this drive.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {drive.externalApplicationUrl ? (
              <>
                <p className="text-sm text-charcoal/70">This company uses an external application form. Complete the form there, then return here to record your application.</p>
                <a href={drive.externalApplicationUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-md border border-cobaltBlue px-4 py-2.5 text-center font-semibold text-cobaltBlue transition hover:bg-cobaltBlue/5">
                  Open company application form
                </a>
                <button type="button" onClick={() => setShowConfirm(true)} className="w-full rounded-md bg-cobaltBlue py-3 text-lg font-semibold text-pureWhite transition hover:bg-cobaltBlue/90">
                  I have completed the application
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 bg-cobaltBlue text-pureWhite rounded-md font-semibold hover:bg-cobaltBlue/90 transition text-lg"
              >
                Apply for this Drive
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <Modal title="Confirm application" onClose={() => setShowConfirm(false)}>
            <p className="mb-4 text-charcoal/70">{drive.externalApplicationUrl ? <>Confirm that you completed the company application for <strong>{drive.role}</strong> at <strong>{drive.companyName}</strong>. This will add it to My Applications.</> : <>Are you sure you want to apply for <strong>{drive.role}</strong> at <strong>{drive.companyName}</strong>?</>}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 py-2 border border-moonlitSilver rounded-md text-charcoal font-medium hover:bg-cloudWhite transition">
                Cancel
              </button>
              <button type="button" onClick={handleApply} disabled={applying} className="flex-1 py-2 bg-cobaltBlue text-pureWhite rounded-md font-semibold hover:bg-cobaltBlue/90 transition">
                {applying ? 'Submitting...' : drive.externalApplicationUrl ? 'Yes, I completed it' : 'Confirm'}
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default DriveDetail;
