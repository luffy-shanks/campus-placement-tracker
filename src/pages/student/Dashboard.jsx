// src/pages/student/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Briefcase, CheckCircle, Users, Award, Clock, ArrowRight, Calendar } from 'lucide-react';
import { mockApplications, mockDrives, currentStudentProfile } from '../../data/mockData';
import { checkEligibility, getEligibilityLabel, getEligibilityClasses } from '../../utils/eligibility';
import { formatDate, daysRemaining, getStatusClasses, capitalize } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useApiData } from '../../hooks/useApiData';
import { driveService } from '../../services/driveService';
import { applicationService } from '../../services/applicationService';

const CHART_COLORS = ['#3454D1', '#FFBF00', '#8B5CF6', '#F59E0B', '#16845B', '#E10600'];
const STATUS_ORDER = ['applied', 'shortlisted', 'assessment', 'interview', 'selected', 'rejected'];

const Dashboard = () => {
  const { user } = useAuth();
  const student = { ...currentStudentProfile, ...user };
  const { data: drives } = useApiData(driveService.list, mockDrives);
  const { data: applications } = useApiData(applicationService.list, mockApplications);
  const myApps = applications.filter(a => a.studentId === student.id);

  // KPI counts
  const totalApps = myApps.length;
  const shortlisted = myApps.filter(a => a.status === 'shortlisted').length;
  const interviews = myApps.filter(a => a.status === 'interview').length;
  const offers = myApps.filter(a => a.status === 'selected').length;

  // Donut chart data
  const statusCounts = STATUS_ORDER.map(s => ({
    name: capitalize(s),
    value: myApps.filter(a => a.status === s).length,
  })).filter(d => d.value > 0);

  // Upcoming deadlines
  const upcomingDrives = drives
    .filter(d => d.status === 'open' && daysRemaining(d.applicationDeadline) > 0)
    .sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline))
    .slice(0, 4);

  // Recommended drives (eligible + open)
  const recommendedDrives = drives
    .filter(d => {
      if (d.status !== 'open') return false;
      const result = checkEligibility(student, d);
      return result.eligible;
    })
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        <h1 className="text-2xl font-bold text-charcoal">Welcome back, {student.name}!</h1>
        <p className="text-charcoal/60 mt-1">Track your placement journey and stay updated with upcoming opportunities.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', count: totalApps, icon: Briefcase, accent: 'text-cobaltBlue', bg: 'bg-cobaltBlue/10' },
          { label: 'Shortlisted', count: shortlisted, icon: CheckCircle, accent: 'text-successGreen', bg: 'bg-successGreen/10' },
          { label: 'Interviews', count: interviews, icon: Users, accent: 'text-amber', bg: 'bg-amber/10' },
          { label: 'Offers', count: offers, icon: Award, accent: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-pureWhite rounded-xl border border-moonlitSilver p-5 flex items-center space-x-4 hover:shadow-md transition">
              <div className={`${kpi.bg} p-3 rounded-lg`}>
                <Icon className={kpi.accent} size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{kpi.count}</p>
                <p className="text-sm text-charcoal/60">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Deadlines row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Application Status Overview</h2>
          {statusCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusCounts.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-charcoal/50 text-center py-12">No applications yet.</p>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Upcoming Deadlines</h2>
          {upcomingDrives.length > 0 ? (
            <ul className="space-y-3">
              {upcomingDrives.map(d => {
                const days = daysRemaining(d.applicationDeadline);
                const urgent = days <= 5;
                return (
                  <li key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-cloudWhite hover:bg-cloudWhite/80 transition">
                    <div>
                      <p className="font-semibold text-charcoal">{d.companyName}</p>
                      <p className="text-sm text-charcoal/60">{d.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-charcoal/70">{formatDate(d.applicationDeadline)}</p>
                      <p className={`text-xs font-medium ${urgent ? 'text-signalRed' : 'text-amber'}`}>
                        <Clock size={12} className="inline mr-1" />
                        {days} day{days !== 1 ? 's' : ''} left
                      </p>
                    </div>
                    <Link to={`/student/drives/${d.id}`} className="ml-3 text-cobaltBlue hover:text-cobaltBlue/80">
                      <ArrowRight size={18} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-charcoal/50 text-center py-12">No upcoming deadlines.</p>
          )}
        </div>
      </div>

      {/* Recommended Drives */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal">Recommended Placement Drives</h2>
          <Link to="/student/drives" className="text-cobaltBlue text-sm font-medium hover:underline">View All</Link>
        </div>
        {recommendedDrives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedDrives.map(d => {
              const eligLabel = getEligibilityLabel(student, d);
              const eligClass = getEligibilityClasses(eligLabel);
              const alreadyApplied = myApps.some(a => a.driveId === d.id);
              return (
                <div key={d.id} className="border border-moonlitSilver rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-charcoal">{d.companyName}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${eligClass}`}>{eligLabel}</span>
                  </div>
                  <p className="text-sm text-charcoal/70 mb-1">{d.role}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-charcoal/60 mb-3">
                    <span>📍 {d.location}</span>
                    {d.packageLPA && <span>💰 {d.packageLPA} LPA</span>}
                    <span><Calendar size={12} className="inline mr-1" />{formatDate(d.applicationDeadline)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/student/drives/${d.id}`} className="flex-1 text-center text-sm px-3 py-1.5 border border-cobaltBlue text-cobaltBlue rounded-md hover:bg-cobaltBlue/5 transition font-medium">
                      View Details
                    </Link>
                    {alreadyApplied ? (
                      <span className="flex-1 text-center text-sm px-3 py-1.5 bg-successGreen/10 text-successGreen rounded-md font-medium">Applied</span>
                    ) : (
                      <Link to={`/student/drives/${d.id}`} className="flex-1 text-center text-sm px-3 py-1.5 bg-cobaltBlue text-pureWhite rounded-md hover:bg-cobaltBlue/90 transition font-medium">
                        Apply
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-charcoal/50 text-center py-8">No eligible drives at the moment.</p>
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="bg-pureWhite rounded-xl border border-moonlitSilver p-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4">Recent Applications</h2>
        {myApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-moonlitSilver text-charcoal/70 text-left">
                  <th className="py-2 pr-4 font-medium">Company</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Applied On</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Next Step</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myApps.map(app => (
                  <tr key={app.id} className="border-b border-moonlitSilver/50 hover:bg-cloudWhite transition">
                    <td className="py-3 pr-4 font-medium text-charcoal">{app.companyName}</td>
                    <td className="py-3 pr-4 text-charcoal/70">{app.role}</td>
                    <td className="py-3 pr-4 text-charcoal/70">{formatDate(app.appliedOn)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(app.status)}`}>
                        {capitalize(app.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-charcoal/60 text-xs">{app.nextStep}</td>
                    <td className="py-3">
                      <Link to="/student/applications" className="text-cobaltBlue text-xs font-medium hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-charcoal/50 text-center py-8">No applications yet. Browse placement drives to get started.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
