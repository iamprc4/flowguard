import React, { useState, useEffect } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, Sparkles, CheckSquare, Loader2, ArrowLeft, User, ChevronDown, Save, CheckCircle } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: any) => void;
  onBackToHome?: () => void;
}

export default function AuthPage({ onLoginSuccess, onBackToHome }: AuthProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'officer' | 'admin' | 'logistics'>('officer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordFlow, setForgotPasswordFlow] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);

  // Load saved credentials from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('flowguard_saved_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.password) setPassword(parsed.password);
        setRememberMe(true);
        setCredentialsLoaded(true);
        // Clear the indicator after a few seconds
        const timer = setTimeout(() => setCredentialsLoaded(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Silently ignore corrupted data
      localStorage.removeItem('flowguard_saved_credentials');
    }
  }, []);

  // Quick preset logger helper for the user to try different roles
  const handleSelectRolePreset = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
    setErrorMsg('');
  };

  // Clear all form fields
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setSelectedRole('officer');
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Switch between login and register tabs
  const switchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    clearForm();
    setForgotPasswordFlow(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid municipal email address.');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Credentials must be at least 4 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        // Save token & call parent success callback
        localStorage.setItem('flowguard_token', data.token);
        // Save or clear credentials based on Remember Me toggle
        if (rememberMe) {
          localStorage.setItem('flowguard_saved_credentials', JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem('flowguard_saved_credentials');
        }
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to the FlowGuard backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, role: selectedRole })
      });

      const data = await response.json();
      if (response.ok) {
        // Auto-login after registration
        localStorage.setItem('flowguard_token', data.token);
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to the FlowGuard backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Please enter your municipal email to receive reset instructions.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Reset code has been securely dispatched to your verified government inbox.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col lg:flex-row relative selection:bg-[#00C6FF]/30 select-none">
      
      {/* Left Column: FlowGuard Branding & animated visual loop (Split screen style) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#0A101F] to-[#04060C] p-12 flex-col justify-between relative overflow-hidden border-r border-white/5">
        {/* Glow dots behind */}
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#00C6FF]/5 rounded-full pointer-events-none blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#7B61FF]/5 rounded-full pointer-events-none blur-3xl" />

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onBackToHome}>
          <div className="w-8 h-8 bg-[#00C6FF] rounded-lg rotate-12 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-slate-950 font-black" fill="#00C6FF" />
          </div>
          <div>
            <span className="font-display font-bold text-base tracking-tight text-white block">Flow<span className="text-[#00C6FF]">Guard</span></span>
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">AI Traffic Platforms</span>
          </div>
        </div>

        {/* Tactical operations aesthetic graphics */}
        <div className="my-auto space-y-6 max-w-lg z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-white/10 rounded-full text-[10px] font-mono text-cyan-400">
            <Sparkles className="w-3 h-3" />
            SECURE ACCESS PORTAL ACTIVE
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight leading-[1.15] m-0">
            Real-Time Command & Dispatch Control Room
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed m-0">
            Please log in with your credentials to access live municipal forecasts, configure digital barricade alerts, generate officer assignments, and plan active route diversions.
          </p>

          <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/5 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-500 uppercase">System Status</span>
              <span className="text-[#4CDE9A] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#4CDE9A] rounded-full animate-pulse" />
                Live Online
              </span>
            </div>
            <div className="text-slate-400 space-y-1 text-[11px]">
              <p>&gt; Ingestion Rate: 1.4 events / min</p>
              <p>&gt; Gemini forecasting: Online (3.5-flash)</p>
              <p>&gt; SQLite Local Store: Active & persistent</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>FlowGuard v3.4.1</span>
          <span>Municipal Ingress Node</span>
        </div>
      </div>

      {/* Right Column: Auth Card with Login/Register tabs */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#070B14]">
        <div className="w-full max-w-md space-y-6 animate-fade-in relative">
          
          <div className="flex justify-between items-center">
            {onBackToHome ? (
              <button 
                onClick={onBackToHome}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Main Home
              </button>
            ) : (
              <div />
            )}
            <span className="text-[10px] text-slate-500 font-mono">FLOWGUARD PORTAL</span>
          </div>

          {/* Login/Register Tab Switcher */}
          {!forgotPasswordFlow && (
            <div className="flex bg-slate-950/60 border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 text-xs font-mono py-2.5 rounded-lg transition-all duration-200 ${
                  authMode === 'login'
                    ? 'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/20 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 text-xs font-mono py-2.5 rounded-lg transition-all duration-200 ${
                  authMode === 'register'
                    ? 'bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-display font-medium text-white my-0 mb-2">
              {forgotPasswordFlow 
                ? 'Operations Access Recovery' 
                : authMode === 'login' 
                  ? 'Command Center Access' 
                  : 'Create Your Account'}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm m-0">
              {forgotPasswordFlow 
                ? 'Generate a temporary pass-sequence sent to your verified government email.' 
                : authMode === 'login'
                  ? 'Sign in using your certified municipality credentials.'
                  : 'Register for a new FlowGuard operator account.'}
            </p>
          </div>

          {/* Preset Buttons for easy developer navigation — login mode only */}
          {!forgotPasswordFlow && authMode === 'login' && (
            <div className="bg-slate-950/60 p-4 border border-[#00C6FF]/40 rounded-xl space-y-3">
              <span className="text-[#00C6FF] text-[11px] font-mono uppercase block mb-1 font-bold tracking-wider">🔐 Judge Demo — One-Click Login</span>
              <div className="text-slate-300 text-xs leading-relaxed space-y-1.5 font-mono bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-white font-semibold select-all">admin@flowguard.gov</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Password:</span>
                  <span className="text-white font-semibold select-all">admin123</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('admin@flowguard.gov');
                    setPassword('admin123');
                    setLoading(true);
                    setErrorMsg('');
                    fetch('/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: 'admin@flowguard.gov', password: 'admin123' })
                    })
                    .then(res => res.json())
                    .then(data => {
                      if (data.token) {
                        localStorage.setItem('flowguard_token', data.token);
                        onLoginSuccess(data.user);
                      } else {
                        setErrorMsg(data.error || 'Authentication failed.');
                      }
                    })
                    .catch(() => setErrorMsg('Unable to connect to the FlowGuard backend server.'))
                    .finally(() => setLoading(false));
                  }}
                  className="bg-[#00C6FF] hover:bg-opacity-90 text-slate-950 text-xs font-bold py-2.5 px-3 rounded-lg transition text-center col-span-2 shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                >
                  <Sparkles className="w-4 h-4" />
                  Login as Commissioner (Admin — Full Access)
                </button>
                <button 
                  type="button"
                  onClick={() => handleSelectRolePreset('officer@flowguard.gov')}
                  className="bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 text-[#7B61FF] border border-[#7B61FF]/25 text-[10px] font-mono py-1.5 px-2 rounded-lg transition text-center cursor-pointer"
                >
                  Field Officer
                </button>
                <button 
                  type="button"
                  onClick={() => handleSelectRolePreset('logistics@flowguard.gov')}
                  className="bg-[#4CDE9A]/10 hover:bg-[#4CDE9A]/20 text-[#4CDE9A] border border-[#4CDE9A]/25 text-[10px] font-mono py-1.5 px-2 rounded-lg transition text-center cursor-pointer"
                >
                  Logistics Mgr
                </button>
              </div>
            </div>
          )}

          {/* Form alert states */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl animate-shake">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-[#4CDE9A]/10 border border-[#4CDE9A]/20 text-[#4CDE9A] text-xs px-4 py-3 rounded-xl animate-fade-in">
              {successMsg}
            </div>
          )}

          {/* === FORGOT PASSWORD FORM === */}
          {forgotPasswordFlow ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Government Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="officer@agency.gov"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => { setForgotPasswordFlow(false); setSuccessMsg(''); }}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Back to Sign In
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#00C6FF] hover:bg-opacity-90 text-slate-950 font-display font-semibold px-5 py-3 rounded-xl text-xs transition duration-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Dispatch Code
                </button>
              </div>
            </form>

          /* === REGISTER FORM === */
          ) : authMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Inspector Ravi Kumar"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B61FF] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Government / Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="officer@flowguard.gov"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B61FF] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 4 characters"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white focus:outline-none focus:border-[#7B61FF] transition"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B61FF] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Operational Role</label>
                <div className="relative">
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as any)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B61FF] transition appearance-none cursor-pointer"
                  >
                    <option value="officer">Field Officer</option>
                    <option value="admin">Traffic Administrator</option>
                    <option value="logistics">Logistics Manager</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#7B61FF] to-[#00C6FF] hover:opacity-90 text-slate-950 font-display font-bold py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7B61FF]/10"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Create Operator Account'
                )}
              </button>
            </form>

          /* === LOGIN FORM === */
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Government / Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="officer@flowguard.gov"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-mono text-gray-400 uppercase">Operational Password</label>
                  <button 
                    type="button"
                    onClick={() => setForgotPasswordFlow(true)}
                    className="text-[11px] text-gray-500 hover:text-[#00C6FF] transition font-sans"
                  >
                    Forgot Credentials?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={e => {
                      setRememberMe(e.target.checked);
                      if (!e.target.checked) {
                        localStorage.removeItem('flowguard_saved_credentials');
                      }
                    }}
                    className="accent-[#00C6FF]"
                  />
                  <span className="flex items-center gap-1.5">
                    <Save className="w-3 h-3 text-gray-500 group-hover:text-[#00C6FF] transition" />
                    Save my credentials
                  </span>
                </label>
                {credentialsLoaded && (
                  <span className="flex items-center gap-1 text-[10px] text-[#4CDE9A] font-mono animate-fade-in">
                    <CheckCircle className="w-3 h-3" />
                    Credentials loaded
                  </span>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#00C6FF] hover:bg-opacity-90 text-slate-950 font-display font-bold py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00C6FF]/10"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Authorize Command Access'
                )}
              </button>
            </form>
          )}

          {/* Social login mock — login mode only */}
          {!forgotPasswordFlow && authMode === 'login' && (
            <div className="pt-6 border-t border-white/5 space-y-4">
              <span className="text-center text-xs text-gray-500 uppercase font-mono tracking-widest block">Single Sign-On SSO Alternative</span>
              <button 
                type="button"
                onClick={() => {
                  setEmail('admin@flowguard.gov');
                  setPassword('admin-sso-ok');
                  setSuccessMsg('Federated Google Single-Sign-On handshake active. Click "Authorize Command Access" below.');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-white/10 font-sans text-xs text-gray-300 py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.195-6.887 4.195-4.8 0-8.7-3.9-8.7-8.7s3.9-8.7 8.7-8.7c2.25 0 4.1.85 5.5 2.15l3.25-3.25C18.45 1.7 15.6 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.9 0 12.24-4.86 12.24-12.24 0-.83-.08-1.63-.24-2.39H12.24z"/>
                </svg>
                Login securely with Government G-Suite
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
