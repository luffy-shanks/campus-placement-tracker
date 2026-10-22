// src/pages/public/Login.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    setLoading(true);
    setApiError('');
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success('Logged in successfully');
      const from = location.state?.from?.pathname || (result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      navigate(from, { replace: true });
    } else {
      setApiError(result.error);
      toast.error(result.error);
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-cloudWhite flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-pureWhite rounded-lg shadow-md p-6 border border-moonlitSilver">
        <h2 className="text-2xl font-bold text-charcoal mb-4 text-center">Login</h2>
        {apiError && <p className="text-signalRed text-sm mb-2 text-center">{apiError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-charcoal font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border ${errors.email ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cobaltBlue`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-signalRed text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <label className="block text-charcoal font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`w-full border ${errors.password ? 'border-signalRed' : 'border-moonlitSilver'} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-cobaltBlue`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-charcoal"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-signalRed text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cobaltBlue text-pureWhite font-semibold py-2 rounded-md hover:bg-cobaltBlue/90 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-charcoal text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-cobaltBlue font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
