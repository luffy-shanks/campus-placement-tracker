import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Search,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    title: 'Find relevant drives',
    description: 'Browse placement opportunities shared by your college and find the roles that fit your goals.',
    icon: Search,
  },
  {
    title: 'Check eligibility',
    description: 'See key requirements up front, including branch, CGPA, year of study, and backlogs.',
    icon: CheckCircle2,
  },
  {
    title: 'Track every next step',
    description: 'Keep application links, submission progress, and placement updates together in one place.',
    icon: FileCheck2,
  },
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[610px] lg:ml-auto" aria-label="Illustrative dashboard preview">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-cobaltBlue/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_28px_80px_-32px_rgba(31,55,110,0.35)] sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cobaltBlue text-white">
              <GraduationCap size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Placement overview</p>
              <p className="text-xs text-slate-500">Student dashboard</p>
            </div>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cobaltBlue">Preview</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 py-4 sm:gap-3">
          {[
            ['Applications', '12', 'text-cobaltBlue'],
            ['Interviews', '03', 'text-amber-600'],
            ['Offers', '01', 'text-emerald-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4">
              <p className="text-[10px] font-medium text-slate-500 sm:text-xs">{label}</p>
              <p className={`mt-1 text-xl font-bold ${color} sm:text-2xl`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-800">Application status</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-[82px] w-[82px] shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#3454d1 0 48%, #21a67a 48% 69%, #f1b84b 69% 84%, #e8edf5 84% 100%)' }}>
                <div className="grid h-[54px] w-[54px] place-items-center rounded-full bg-white text-center">
                  <span className="text-[9px] leading-tight text-slate-500">In<br />progress</span>
                </div>
              </div>
              <div className="space-y-2 text-[10px] text-slate-600">
                <p><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-cobaltBlue" />Applied</p>
                <p><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />Shortlisted</p>
                <p><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" />Interview</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-800">Recent applications</p>
              <span className="text-[10px] text-slate-400">View all</span>
            </div>
            <div className="mt-2 divide-y divide-slate-100">
              {[
                ['Software Engineer', 'Shortlisted', 'bg-emerald-50 text-emerald-700'],
                ['Graduate Trainee', 'In review', 'bg-blue-50 text-cobaltBlue'],
                ['Product Intern', 'Applied', 'bg-slate-100 text-slate-600'],
              ].map(([role, status, badge]) => (
                <div key={role} className="flex items-center justify-between gap-2 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500"><BriefcaseBusiness size={13} /></span>
                    <span className="truncate text-[10px] font-medium text-slate-700 sm:text-[11px]">{role}</span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-medium ${badge}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">Illustrative preview · your dashboard shows your own account data</p>
      </div>
    </div>
  );
}

const Landing = () => (
  <main className="min-h-screen w-full overflow-hidden bg-white text-slate-900">
    <header className="relative z-10 border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Campus Placement Tracker home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-cobaltBlue"><GraduationCap size={25} /></span>
          <span className="hidden text-base font-bold tracking-tight text-slate-900 sm:inline sm:text-lg">Campus Placement Tracker</span>
          <span className="text-sm font-bold tracking-tight text-slate-900 sm:hidden">Campus Tracker</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
          <a className="transition hover:text-cobaltBlue" href="#features">For students</a>
          <a className="transition hover:text-cobaltBlue" href="#how-it-works">How it works</a>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-cobaltBlue sm:px-4">Sign in</Link>
          <Link to="/register" className="rounded-xl bg-cobaltBlue px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-4 sm:text-sm">Create student account</Link>
        </div>
      </div>
    </header>

    <section className="relative bg-[#f3f7ff]">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:py-24">
        <div className="relative z-10 max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-cobaltBlue shadow-sm">
            <Sparkles size={14} /> Your campus placement companion
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.6rem]">
            Your placement journey, <span className="text-cobaltBlue">all in one place.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Discover college-shared drives, check your eligibility, and keep every application update organized.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cobaltBlue px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Create student account <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-cobaltBlue hover:text-cobaltBlue">Sign in</Link>
          </div>
          <p className="mt-5 text-xs font-medium text-slate-500">Built for students · Managed by your placement cell</p>
        </div>
        <DashboardPreview />
      </div>
    </section>

    <section id="features" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cobaltBlue">Everything in one place</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">A clearer path from drive to offer</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-cobaltBlue transition group-hover:bg-cobaltBlue group-hover:text-white"><Icon size={21} /></span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>

    <section id="how-it-works" className="border-t border-slate-100 bg-slate-50/70">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:px-8 md:grid-cols-3">
        {[
          ['01', 'Set up your profile', 'Add your academic details and skills so eligibility is clear.'],
          ['02', 'Explore college drives', 'Review role details, requirements, deadlines, and application links.'],
          ['03', 'Follow your progress', 'Track submitted applications and placement status from your dashboard.'],
        ].map(([number, title, description]) => (
          <div key={number} className="flex gap-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-cobaltBlue">{number}</span>
            <div><h3 className="text-sm font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p></div>
          </div>
        ))}
      </div>
    </section>

    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:px-8">
        <span className="flex items-center gap-2 font-semibold text-slate-700"><GraduationCap size={18} className="text-cobaltBlue" /> Campus Placement Tracker</span>
        <span>© {new Date().getFullYear()} Campus Placement Tracker. All rights reserved.</span>
      </div>
    </footer>
  </main>
);

export default Landing;
