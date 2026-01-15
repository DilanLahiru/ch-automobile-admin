import React, { useState } from 'react';
import { Wrench, Mail, Lock, ArrowRight, Car, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
       navigate('/dashboard')
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Left side - Branding */}
      <div className="relative hidden w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex lg:flex-col lg:justify-between">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-500 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-orange-500 blur-3xl animate-pulse" />
        </div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 p-12">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CH AutoMobile</h1>
              <p className="text-sm text-slate-200">Vehicle Repair Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
              <Gauge className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Dashboard Analytics</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Streamline Your<br />
              Workshop Operations
            </h2>
            <p className="text-lg text-slate-400">
              Manage repairs, track inventory, and keep your customers satisfied with our comprehensive admin platform.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-white">2.4k+</div>
              <div className="text-sm text-slate-400">Repairs Completed</div>
            </div>
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-slate-400">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Decorative car illustration */}
        <div className="absolute bottom-0 left-0 right-0 opacity-5">
          <Car className="mx-auto h-64 w-64" />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center space-x-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AutoPro</h1>
              <p className="text-sm text-slate-500">Repair Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-slate-600">
              Sign in to access your admin dashboard
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autopro.com"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Need help?{' '}
            <a
              href="#"
              className="font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}