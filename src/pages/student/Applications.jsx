// src/pages/student/Applications.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { mockApplications, currentStudentProfile } from '../../data/mockData';
import { formatDate, getStatusClasses, capitalize } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useApiData } from '../../hooks/useApiData';
import { applicationService } from '../../services/applicationService';

const ALL_STATUSES = ['all', 'applied', 'shortlisted', 'assessment', 'interview', 'selected', 'rejected'];
const TIMELINE_STAGES = ['applied', 'shortlisted', 'assessment', 'interview', 'selected'];

const Applications = () => {
  const { user } = useAuth();
  const student = { ...currentStudentProfile, ...user };
  const { data: applications } = useApiData(applicationService.list, mockApplications);
  const myApps = applications.filter(a => a.studentId === student.id);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const filtered = useMemo(() => {
    let list = [...myApps];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.companyName.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      list = list.filter(a => a.status === statusFilter);
    }
    list.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
    return list;
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal">My Applications</h1>
        <span className="text-sm text-charcoal/60">{filtered.length} application{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-moonlitSilver rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-moonlitSilver rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue">
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : capitalize(s)}</option>)}
        </select>
      </div>

      {/* Applications table */}
      {filtered.length > 0 ? (
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-moonlitSilver text-charcoal/70 text-left">
                <th className="py-3 px-4 font-medium">Company</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Applied</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Last Updated</th>
                <th className="py-3 px-4 font-medium">Next Step</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="border-b border-moonlitSilver/50 hover:bg-cloudWhite transition">
                  <td className="py-3 px-4 font-medium text-charcoal">{app.companyName}</td>
                  <td className="py-3 px-4 text-charcoal/70">{app.role}</td>
                  <td className="py-3 px-4 text-charcoal/70">{formatDate(app.appliedOn)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(app.status)}`}>
                      {capitalize(app.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-charcoal/70">{formatDate(app.lastUpdated)}</td>
                  <td className="py-3 px-4 text-charcoal/60 text-xs">{app.nextStep}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => setSelectedApp(app)} className="text-cobaltBlue text-xs font-medium hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-12 text-center">
          <p className="text-charcoal/50">No applications match your filters.</p>
        </div>
      )}

      {/* Application detail modal with timeline */}
      {selectedApp && (
        <Modal title={`${selectedApp.companyName} · ${selectedApp.role}`} onClose={() => setSelectedApp(null)}>

            <div className="text-sm text-charcoal/60 space-y-1 mb-6">
              <p>Applied on: <span className="text-charcoal font-medium">{formatDate(selectedApp.appliedOn)}</span></p>
              <p>Last updated: <span className="text-charcoal font-medium">{formatDate(selectedApp.lastUpdated)}</span></p>
              <p>Next step: <span className="text-charcoal font-medium">{selectedApp.nextStep}</span></p>
            </div>

            {/* Timeline */}
            <h4 className="text-sm font-semibold text-charcoal mb-3">Recruitment Timeline</h4>
            <div className="relative pl-6">
              {(() => {
                const isRejected = selectedApp.status === 'rejected';
                const historyStatuses = selectedApp.statusHistory.map(h => h.status);
                const stages = isRejected
                  ? [...TIMELINE_STAGES.filter(s => historyStatuses.includes(s)), 'rejected']
                  : TIMELINE_STAGES;

                return stages.map((stage, idx) => {
                  const historyEntry = selectedApp.statusHistory.find(h => h.status === stage);
                  const isCompleted = !!historyEntry;
                  const isCurrent = stage === selectedApp.status;
                  const isLast = idx === stages.length - 1;
                  const isRejectedStage = stage === 'rejected';

                  let dotColor = 'bg-moonlitSilver';
                  if (isRejectedStage) dotColor = 'bg-signalRed';
                  else if (isCurrent) dotColor = 'bg-cobaltBlue';
                  else if (isCompleted) dotColor = 'bg-successGreen';

                  let lineColor = 'bg-moonlitSilver';
                  if (isCompleted && !isLast) lineColor = 'bg-successGreen';

                  return (
                    <div key={stage} className="relative pb-6 last:pb-0">
                      {/* Vertical line */}
                      {!isLast && (
                        <div className={`absolute left-[-16px] top-3 w-0.5 h-full ${lineColor}`} />
                      )}
                      {/* Dot */}
                      <div className={`absolute left-[-20px] top-1 w-3 h-3 rounded-full border-2 border-pureWhite ${dotColor}`} />
                      {/* Content */}
                      <div className={`${isCurrent ? 'font-semibold text-charcoal' : isCompleted ? 'text-charcoal/70' : 'text-charcoal/40'}`}>
                        <p className="text-sm">{capitalize(stage)}</p>
                        {historyEntry && (
                          <p className="text-xs text-charcoal/50">{formatDate(historyEntry.date)}</p>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
        </Modal>
      )}
    </div>
  );
};

export default Applications;
