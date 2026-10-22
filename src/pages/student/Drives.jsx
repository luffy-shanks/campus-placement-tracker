// src/pages/student/Drives.jsx
import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Calendar, MapPin, IndianRupee, GraduationCap, ExternalLink } from 'lucide-react';
import { mockDrives, mockApplications, currentStudentProfile } from '../../data/mockData';
import { getEligibilityLabel, getEligibilityClasses } from '../../utils/eligibility';
import { formatDate, daysRemaining } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useApiData } from '../../hooks/useApiData';
import { driveService } from '../../services/driveService';
import { applicationService } from '../../services/applicationService';

const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EEE'];
const LOCATIONS = ['All', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai'];

const Drives = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const student = { ...currentStudentProfile, ...user };
  const { data: drives } = useApiData(driveService.list, mockDrives);
  const { data: applications } = useApiData(applicationService.list, mockApplications);
  const myApps = applications.filter(a => a.studentId === student.id);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [branchFilter, setBranchFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [minPackage, setMinPackage] = useState('');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sortByDeadline, setSortByDeadline] = useState(true);

  const filtered = useMemo(() => {
    let list = [...drives];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => d.companyName.toLowerCase().includes(q) || d.role.toLowerCase().includes(q));
    }
    // Branch
    if (branchFilter !== 'All') {
      list = list.filter(d => d.eligibleBranches.includes(branchFilter));
    }
    // Location
    if (locationFilter !== 'All') {
      list = list.filter(d => d.location === locationFilter);
    }
    // Min package
    if (minPackage) {
      list = list.filter(d => d.packageLPA >= parseFloat(minPackage));
    }
    // Eligible only
    if (eligibleOnly) {
      list = list.filter(d => getEligibilityLabel(student, d) === 'Eligible');
    }
    // Sort
    if (sortByDeadline) {
      list.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
    }
    return list;
  }, [drives, search, branchFilter, locationFilter, minPackage, eligibleOnly, sortByDeadline, student]);

  const clearFilters = () => {
    setSearch('');
    setBranchFilter('All');
    setLocationFilter('All');
    setMinPackage('');
    setEligibleOnly(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">Placement Drives</h1>
        <span className="text-sm text-charcoal/60">{filtered.length} drive{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Filters */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-moonlitSilver rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue"
            />
          </div>
          {/* Branch */}
          <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="border border-moonlitSilver rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue">
            {BRANCHES.map(b => <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>)}
          </select>
          {/* Location */}
          <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="border border-moonlitSilver rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue">
            {LOCATIONS.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
          </select>
          {/* Min package */}
          <input
            type="number"
            placeholder="Min Package (LPA)"
            value={minPackage}
            onChange={e => setMinPackage(e.target.value)}
            className="border border-moonlitSilver rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue"
          />
          {/* Clear */}
          <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-signalRed hover:text-signalRed/80 transition font-medium">
            <X size={14} /> Clear Filters
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input type="checkbox" checked={eligibleOnly} onChange={e => setEligibleOnly(e.target.checked)} className="accent-cobaltBlue" />
            Eligible Only
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input type="checkbox" checked={sortByDeadline} onChange={e => setSortByDeadline(e.target.checked)} className="accent-cobaltBlue" />
            Sort by Deadline
          </label>
        </div>
      </div>

      {/* Drive cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(d => {
            const eligLabel = getEligibilityLabel(student, d);
            const eligClass = getEligibilityClasses(eligLabel);
            const alreadyApplied = myApps.some(a => a.driveId === d.id);
            const days = daysRemaining(d.applicationDeadline);
            const expired = d.status === 'closed' || days <= 0;

            return (
              <div key={d.id} className="bg-pureWhite rounded-xl border border-moonlitSilver p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal">{d.companyName}</h3>
                    <p className="text-sm text-charcoal/70">{d.role}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${eligClass}`}>{eligLabel}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-charcoal/60 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={12} />{d.location}</span>
                  {d.packageLPA && <span className="flex items-center gap-1"><IndianRupee size={12} />{d.packageLPA} LPA</span>}
                  <span className="flex items-center gap-1"><GraduationCap size={12} />Min CGPA: {d.minCGPA}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(d.applicationDeadline)}</span>
                </div>
                <div className="text-xs text-charcoal/50 mb-3">
                  Branches: {d.eligibleBranches.join(', ')} · Backlogs ≤ {d.maxBacklogs}
                </div>
                <div className="mb-3 text-sm">
                  {d.externalApplicationUrl ? (
                    <a href={d.externalApplicationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-cobaltBlue hover:underline">
                      Open external application <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="text-charcoal/50">Apply through the college placement portal</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link to={`/student/drives/${d.id}`} className="flex-1 text-center text-sm px-3 py-2 border border-cobaltBlue text-cobaltBlue rounded-md hover:bg-cobaltBlue/5 transition font-medium">
                    View Details
                  </Link>
                  {alreadyApplied ? (
                    <span className="flex-1 text-center text-sm px-3 py-2 bg-successGreen/10 text-successGreen rounded-md font-medium">Applied ✓</span>
                  ) : expired ? (
                    <span className="flex-1 text-center text-sm px-3 py-2 bg-gray-100 text-gray-400 rounded-md font-medium">Closed</span>
                  ) : (
                    <Link to={`/student/drives/${d.id}`} className="flex-1 text-center text-sm px-3 py-2 bg-cobaltBlue text-pureWhite rounded-md hover:bg-cobaltBlue/90 transition font-medium">
                      Apply Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-12 text-center">
          <p className="text-charcoal/50">No drives match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Drives;
