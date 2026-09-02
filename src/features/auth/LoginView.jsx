import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { BrainCircuit, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import backgroundAnimation from '../../assets/lottieani.json';
import { Button } from '../../components/ui/Button';
import { DESIGN } from '../../lib/designTokens';

const inputClass = `w-full px-3 py-2 border border-[#2E4A3A] bg-[#1F3329]/80 text-[#F1F5F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors placeholder:text-[#6B8577]`;

export function LoginView({
  onLogin,
  onRegister,
  isLoggingIn,
  errorMessage,
  email,
  setEmail,
  password,
  setPassword
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isRegister = mode === 'register';

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError('');
    setSuccessMessage('');
    setName('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (isRegister) {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      await onRegister(name.trim(), email, password);
    } else {
      await onLogin(e);
    }
  };

  const displayError = localError || errorMessage;

  return (
    <div className={`min-h-screen flex font-sans ${DESIGN.colors.appBg}`}>
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex flex-1 bg-[#0F1D16] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Orbiting rings decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px]">
              <div className="absolute inset-0 border border-[#2E4A3A] border-dashed rounded-full opacity-50"></div>
              <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-orbit flex items-center justify-center" style={{ animationDuration: '20s' }}>
                    <div className="bg-[#1F3329] p-2 rounded-full border border-[#2E4A3A] shadow-lg">
                      <span className="text-orange-500 font-bold px-2">QUIZ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px]">
              <div className="absolute inset-0 border border-[#2E4A3A] border-dashed rounded-full opacity-40"></div>
              <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '30s' }}>
                <div className="absolute top-[14.6%] left-[85.4%] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-orbit flex items-center justify-center" style={{ animationDuration: '30s' }}>
                    <div className="bg-[#1F3329] p-2 rounded-full border border-[#2E4A3A] shadow-lg">
                      <span className="text-yellow-400 font-bold px-4">Study</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[85.4%] left-[14.6%] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-orbit flex items-center justify-center" style={{ animationDuration: '30s' }}>
                    <div className="bg-[#1F3329] p-2 rounded-full border border-[#2E4A3A] shadow-lg">
                      <span className="text-blue-400 font-bold px-3">Notion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px]">
              <div className="absolute inset-0 border border-[#2E4A3A] border-dashed rounded-full opacity-30"></div>
              <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '45s' }}>
                <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-orbit flex items-center justify-center" style={{ animationDuration: '45s' }}>
                    <div className="bg-[#1F3329] p-2 rounded-full border border-[#2E4A3A] shadow-lg">
                      <span className="text-cyan-400 font-bold px-2">Calendar</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[85.4%] left-[85.4%] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-orbit flex items-center justify-center" style={{ animationDuration: '45s' }}>
                    <div className="bg-[#1F3329] p-2 rounded-full border border-[#2E4A3A] shadow-lg">
                      <span className="text-blue-500 font-bold px-4">Time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 font-semibold text-xl tracking-tight">
          <div className={`w-8 h-8 ${DESIGN.colors.primary} text-white ${DESIGN.radius.base} flex items-center justify-center shadow-lg shadow-[#D2A24C]/20`}>
            <BrainCircuit className="w-5 h-5" />
          </div>
          AcadSync
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold tracking-tight mb-4 leading-tight text-[#F1F5F0]">
            Streamline your<br />academic workflow.
          </h1>
          <p className="text-[#9CB0A3] max-w-md">
            Connect your portals, generate intelligent study plans, and never miss a deadline again with our unified dashboard.
          </p>
        </div>
        <div className="relative z-10 text-sm text-[#6B8577]">
          © {new Date().getFullYear()} AcadSync Inc.
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#182A20] relative overflow-hidden">
        {/* Lottie background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
          <Lottie
            animationData={backgroundAnimation}
            loop={true}
            style={{ width: '100%', height: '100%', minWidth: '800px', objectFit: 'cover' }}
          />
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 font-semibold text-xl tracking-tight mb-8 text-[#F1F5F0]">
            <div className={`w-8 h-8 ${DESIGN.colors.primary} text-white ${DESIGN.radius.base} flex items-center justify-center`}>
              <BrainCircuit className="w-5 h-5" />
            </div>
            AcadSync
          </div>

          {/* Mode toggle tabs */}
          <div className="flex rounded-lg border border-[#2E4A3A] bg-[#0F1D16]/60 p-1 mb-8">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !isRegister
                  ? 'bg-[#D2A24C] text-[#0F1D16] shadow'
                  : 'text-[#9CB0A3] hover:text-[#F1F5F0]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign in
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isRegister
                  ? 'bg-[#D2A24C] text-[#0F1D16] shadow'
                  : 'text-[#9CB0A3] hover:text-[#F1F5F0]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create account
            </button>
          </div>

          {/* Headings */}
          <h2 className="text-2xl font-semibold text-[#F1F5F0] mb-1 tracking-tight">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-[#9CB0A3] mb-8">
            {isRegister
              ? 'Start managing your academic life in minutes.'
              : 'Enter your credentials to access your workspace.'}
          </p>

          {/* Success message (shown after register redirects to login mode) */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-md bg-[#2E4A3A] border border-[#3A6050] text-[#6FCF97] text-sm">
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {displayError && (
            <div className="mb-5 p-3 rounded-md bg-[#C2664A]/15 border border-[#C2664A]/40 text-[#FECACA] text-sm">
              {displayError}
            </div>
          )}

          {/* Auth form */}
          <form id={isRegister ? 'auth-register-form' : 'auth-login-form'} onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (register only) */}
            {isRegister && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-[#F1F5F0] mb-1.5">
                  Full name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  placeholder="Alex Johnson"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-[#F1F5F0] mb-1.5">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-[#F1F5F0] mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={isRegister ? 'At least 6 characters' : '••••••••'}
                className={inputClass}
              />
            </div>

            {/* Confirm password (register only) */}
            {isRegister && (
              <div>
                <label htmlFor="auth-confirm-password" className="block text-sm font-medium text-[#F1F5F0] mb-1.5">
                  Confirm password
                </label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isRegister}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            )}

            <Button
              id={isRegister ? 'auth-register-btn' : 'auth-login-btn'}
              type="submit"
              className="w-full mt-2 gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn
                ? (isRegister ? 'Creating account...' : 'Signing in...')
                : (isRegister ? 'Create account' : 'Continue to Dashboard')}
              {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* Subtle mode switch link */}
          <p className="mt-6 text-center text-sm text-[#6B8577]">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  id="auth-switch-to-login"
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#D2A24C] hover:text-[#B98A3C] font-medium transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  id="auth-switch-to-register"
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-[#D2A24C] hover:text-[#B98A3C] font-medium transition-colors"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
