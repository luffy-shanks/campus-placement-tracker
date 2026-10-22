// src/pages/public/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Landing = () => (
  <div className="min-h-screen bg-cloudWhite flex flex-col items-center">
    {/* Header */}
    <header className="w-full py-6 bg-charcoal flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <GraduationCap size={32} className="text-cobaltBlue" />
        <h1 className="text-2xl font-bold text-pureWhite">Campus Placement Tracker</h1>
      </div>
    </header>

    {/* Hero */}
    <section className="max-w-4xl mx-auto text-center py-16">
      <h2 className="text-4xl font-bold text-charcoal mb-4">
        Your Placement Journey, Organized.
      </h2>
      <p className="text-lg text-charcoal mb-8">
        Discover drives, track applications, and view analytics—all in one premium dashboard.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-cobaltBlue text-pureWhite rounded-md font-semibold hover:bg-cobaltBlue/80 transition"
        >
          Get Started
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-cloudWhite text-charcoal border border-charcoal rounded-md font-medium hover:bg-cloudWhite/80 transition"
        >
          Sign In
        </Link>
      </div>
    </section>

    {/* Feature cards */}
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-4 py-8">
      {[
        { title: 'Job Discovery', desc: 'Browse curated placement drives', icon: 'Briefcase' },
        { title: 'Eligibility Check', desc: 'Instantly see if you qualify', icon: 'CheckCircle' },
        { title: 'Application Tracking', desc: 'Monitor status in real‑time', icon: 'FileCheck' },
        { title: 'Placement Analytics', desc: 'Visualize your progress', icon: 'BarChart2' },
      ].map((f, i) => (
        <div
          key={i}
          className="bg-pureWhite rounded-lg shadow-sm p-6 border border-moonlitSilver hover:shadow-md transition"
        >
          <div className="flex items-center space-x-2 mb-3">
            {/* Simple placeholder icons using Lucide */}
            <svg
              className="w-6 h-6 text-cobaltBlue"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14" />
            </svg>
            <h3 className="text-lg font-semibold text-charcoal">{f.title}</h3>
          </div>
          <p className="text-sm text-charcoal">{f.desc}</p>
        </div>
      ))}
    </section>

    {/* Footer */}
    <footer className="w-full py-4 bg-charcoal text-pureWhite text-center">
      © {new Date().getFullYear()} Campus Placement Tracker. All rights reserved.
    </footer>
  </div>
);

export default Landing;
