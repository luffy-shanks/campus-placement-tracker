// src/pages/public/Register.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerStudent(data);
      if (result.success) {
        toast.success('Registration successful! Welcome aboard.');
        navigate('/student/dashboard');
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (error) =>
    `w-full border ${error ? 'border-signalRed' : 'border-moonlitSilver'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cobaltBlue transition`;

  return (
    <div className="min-h-screen bg-cloudWhite flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-pureWhite rounded-xl shadow-lg p-8 border border-moonlitSilver">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap size={28} className="text-cobaltBlue" />
            <span className="text-xl font-bold text-charcoal">Campus Placement Tracker</span>
          </div>
          <h2 className="text-2xl font-bold text-charcoal">Student Registration</h2>
          <p className="text-sm text-charcoal/60 mt-1">Create your account to start tracking placements</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" className={inputClasses(errors.fullName)}
              {...register('fullName', { required: 'Full name is required' })} />
            {errors.fullName && <p className="text-signalRed text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="email">College Email</label>
            <input id="email" type="email" className={inputClasses(errors.email)}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email format' },
              })} />
            {errors.email && <p className="text-signalRed text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password + Confirm in row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="password">Password</label>
              <input id="password" type={showPassword ? 'text' : 'password'} className={inputClasses(errors.password)}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-charcoal/50 hover:text-charcoal">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-signalRed text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type={showPassword ? 'text' : 'password'} className={inputClasses(errors.confirmPassword)}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: v => v === password || 'Passwords do not match',
                })} />
              {errors.confirmPassword && <p className="text-signalRed text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Roll Number + Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="rollNumber">Roll Number</label>
              <input id="rollNumber" type="text" className={inputClasses(errors.rollNumber)}
                {...register('rollNumber', { required: 'Roll number is required' })} />
              {errors.rollNumber && <p className="text-signalRed text-xs mt-1">{errors.rollNumber.message}</p>}
            </div>
            <div>
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="department">Department / Branch</label>
              <select id="department" className={inputClasses(errors.department)}
                {...register('department', { required: 'Department is required' })}>
                <option value="">Select</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>
              {errors.department && <p className="text-signalRed text-xs mt-1">{errors.department.message}</p>}
            </div>
          </div>

          {/* Grad Year, CGPA, Backlogs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="graduationYear">Graduation Year</label>
              <input id="graduationYear" type="number" min="2020" max="2035" className={inputClasses(errors.graduationYear)}
                {...register('graduationYear', { required: 'Required', valueAsNumber: true, min: { value: 2020, message: 'Too early' }, max: { value: 2035, message: 'Too far' } })} />
              {errors.graduationYear && <p className="text-signalRed text-xs mt-1">{errors.graduationYear.message}</p>}
            </div>
            <div>
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="cgpa">CGPA</label>
              <input id="cgpa" type="number" step="0.01" min="0" max="10" className={inputClasses(errors.cgpa)}
                {...register('cgpa', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Min 0' }, max: { value: 10, message: 'Max 10' } })} />
              {errors.cgpa && <p className="text-signalRed text-xs mt-1">{errors.cgpa.message}</p>}
            </div>
            <div>
              <label className="block text-charcoal text-sm font-medium mb-1" htmlFor="backlogs">Active Backlogs</label>
              <input id="backlogs" type="number" min="0" className={inputClasses(errors.backlogs)}
                {...register('backlogs', { required: 'Required', valueAsNumber: true, min: { value: 0, message: 'Min 0' } })} />
              {errors.backlogs && <p className="text-signalRed text-xs mt-1">{errors.backlogs.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-cobaltBlue text-pureWhite font-semibold py-2.5 rounded-lg hover:bg-cobaltBlue/90 transition disabled:opacity-60">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-charcoal text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-cobaltBlue font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
