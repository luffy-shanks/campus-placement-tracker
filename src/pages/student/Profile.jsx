// src/pages/student/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Upload, FileText, Download, ExternalLink, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { currentStudentProfile } from '../../data/mockData';
import { studentService } from '../../services/studentService';
import { useApiData } from '../../hooks/useApiData';

const Profile = () => {
  const { data: serverProfile } = useApiData(studentService.getProfile, currentStudentProfile);
  const [profile, setProfile] = useState({ ...currentStudentProfile });
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => () => {
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);
  }, [resumeUrl]);

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validExtension = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!validExtension) {
      toast.error('Choose a PDF, DOC, or DOCX resume.');
      event.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Resume must be 10 MB or smaller.');
      event.target.value = '';
      return;
    }
    setResume(file);
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    setResumeUrl(URL.createObjectURL(file));
    try {
      await studentService.uploadResume(file);
      toast.success('Resume uploaded to your profile');
    } catch (error) {
      toast.error(error.message || 'Could not upload your resume.');
    }
  };

  const removeResume = async () => {
    try {
      await studentService.deleteResume();
    } catch (error) {
      toast.error(error.message || 'Could not remove your saved resume.');
      return;
    }
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    setResume(null);
    setResumeUrl('');
    toast.success('Resume removed');
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: profile });

  useEffect(() => {
    setProfile({ ...serverProfile });
    reset(serverProfile);
    if (serverProfile.resume?.filename) {
      setResume(serverProfile.resume);
      studentService.getResume().then(file => {
        if (file) setResumeUrl(URL.createObjectURL(file));
      }).catch(() => toast.error('Your saved resume could not be loaded.'));
    }
  }, [serverProfile, reset]);

  const onSubmit = async (data) => {
    try {
      const updated = await studentService.updateProfile({ ...data, skills: profile.skills });
      setProfile({ ...updated });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Could not update your profile.');
    }
  };

  const handleCancel = () => {
    reset(profile);
    setEditing(false);
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      toast.error('Skill already added');
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, trimmed] });
    setNewSkill('');
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="px-4 py-2 bg-cobaltBlue text-pureWhite rounded-md font-medium hover:bg-cobaltBlue/90 transition text-sm">
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
              <input
                type="text"
                disabled={!editing}
                className={`w-full border ${errors.name ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue disabled:bg-cloudWhite disabled:text-charcoal/60`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-signalRed text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full border border-moonlitSilver rounded-md px-3 py-2 text-sm bg-cloudWhite text-charcoal/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Roll Number</label>
              <input
                type="text"
                disabled
                value={profile.rollNumber}
                className="w-full border border-moonlitSilver rounded-md px-3 py-2 text-sm bg-cloudWhite text-charcoal/60"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Department</label>
              <input
                type="text"
                disabled={!editing}
                className={`w-full border ${errors.department ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue disabled:bg-cloudWhite disabled:text-charcoal/60`}
                {...register('department', { required: 'Required' })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Graduation Year</label>
              <input
                type="number"
                disabled={!editing}
                className={`w-full border ${errors.graduationYear ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue disabled:bg-cloudWhite disabled:text-charcoal/60`}
                {...register('graduationYear', { required: 'Required', valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                disabled={!editing}
                className={`w-full border ${errors.cgpa ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue disabled:bg-cloudWhite disabled:text-charcoal/60`}
                {...register('cgpa', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' }, max: { value: 10, message: 'Max 10' } })}
              />
              {errors.cgpa && <p className="text-signalRed text-xs mt-1">{errors.cgpa.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Active Backlogs</label>
              <input
                type="number"
                disabled={!editing}
                className={`w-full border ${errors.backlogs ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue disabled:bg-cloudWhite disabled:text-charcoal/60`}
                {...register('backlogs', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })}
              />
              {errors.backlogs && <p className="text-signalRed text-xs mt-1">{errors.backlogs.message}</p>}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 bg-cobaltBlue/10 text-cobaltBlue text-sm px-3 py-1 rounded-full font-medium">
                {skill}
                {editing && (
                  <button type="button" onClick={() => removeSkill(skill)} className="text-cobaltBlue/60 hover:text-signalRed">
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>
          {editing && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 border border-moonlitSilver rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue"
              />
              <button type="button" onClick={addSkill} className="px-3 py-2 bg-cobaltBlue text-pureWhite rounded-md hover:bg-cobaltBlue/90 transition">
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Resume */}
        <section className="bg-pureWhite rounded-xl border border-moonlitSilver p-6" aria-labelledby="resume-heading">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="resume-heading" className="text-lg font-semibold text-charcoal">Resume</h2>
              <p className="mt-1 text-sm text-charcoal/60">Add a current resume to your profile. PDF, DOC, or DOCX, up to 10 MB.</p>
            </div>
            <label htmlFor="resume-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-cobaltBlue px-4 py-2 text-sm font-medium text-pureWhite transition hover:bg-cobaltBlue/90 focus-within:ring-2 focus-within:ring-cobaltBlue focus-within:ring-offset-2">
              <Upload size={16} />
              {resume ? 'Replace resume' : 'Choose resume'}
            </label>
            <input id="resume-upload" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResumeChange} className="sr-only" />
          </div>
          {resume ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-moonlitSilver bg-cloudWhite p-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={20} className="shrink-0 text-cobaltBlue" />
                <div className="min-w-0">
                  <p className="break-all text-sm font-medium text-charcoal">{resume.name || resume.filename}</p>
                  <p className="text-xs text-charcoal/60">{(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {(resume.name || resume.filename).toLowerCase().endsWith('.pdf') && <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-cobaltBlue hover:underline"><ExternalLink size={15} />View</a>}
                <a href={resumeUrl} download={resume.name || resume.filename} className="inline-flex items-center gap-1 text-sm font-medium text-cobaltBlue hover:underline"><Download size={15} />Download</a>
                <button type="button" onClick={removeResume} aria-label="Remove resume" className="rounded p-1 text-charcoal/60 hover:bg-signalRed/10 hover:text-signalRed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltBlue"><Trash2 size={16} /></button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-moonlitSilver p-5 text-center text-sm text-charcoal/60">
              No resume selected yet. Your file stays in this browser session; backend upload can be connected when resume storage is available.
            </div>
          )}
        </section>

        {/* Actions */}
        {editing && (
          <div className="flex gap-3">
            <button type="button" onClick={handleCancel} className="flex-1 py-2 border border-moonlitSilver rounded-md text-charcoal font-medium hover:bg-cloudWhite transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 bg-cobaltBlue text-pureWhite rounded-md font-semibold hover:bg-cobaltBlue/90 transition">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
