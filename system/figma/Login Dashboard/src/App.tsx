import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
  // Sign up form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (signUpPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    console.log('Sign up:', { firstName, lastName, email, phoneNumber, password: signUpPassword });
    // Reset form and close modal
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setSignUpPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowSignUpModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Top Banner - Mobile Only */}
      <div className="lg:hidden w-full py-6 px-8 relative overflow-hidden" style={{ backgroundColor: '#0B4F6C' }}>
        {/* Background Security Camera Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img 
            src="https://img.icons8.com/?size=400&id=4RpOhIzbPx4i&format=png&color=B8D4D8"
            alt="Background"
            className="w-32 h-32 object-contain animate-pulse-slow"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-2">
          <h2 className="text-white text-3xl tracking-wider animate-fade-in-up">NCPS</h2>
          <div className="space-y-0">
            <p className="text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Nasugbu Computer Parts and Services</p>
          </div>
          <div className="pt-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-2 h-2 rounded-full mx-auto animate-pulse" style={{ backgroundColor: '#3FA9BC' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 lg:px-16 lg:py-12 relative" style={{ backgroundColor: '#B8D4D8' }}>
          {/* Animated background circles */}
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#3FA9BC' }}></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#0B4F6C', animationDelay: '1s' }}></div>
          
          <div className="w-full max-w-md space-y-6 lg:space-y-8 relative z-10">
            {/* Logo and Welcome */}
            <div className="text-center space-y-4 lg:space-y-6">
              {/* Logo with animated circle outline */}
              <div className="relative inline-block group">
                <div className="absolute inset-0 rounded-full border-4 border-[#0B4F6C] animate-spin-slow" style={{ padding: '8px' }}></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#3FA9BC] opacity-50 animate-ping-slow" style={{ padding: '8px' }}></div>
                <div className="relative bg-white rounded-full p-4 border-4 border-[#0B4F6C] group-hover:border-[#3FA9BC] transition-all duration-300 group-hover:scale-110">
                  <img 
                    src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
                    alt="NCPS Logo"
                    className="w-16 h-16 lg:w-20 lg:h-20"
                  />
                </div>
              </div>
              
              <h1 className="text-[#0B4F6C] animate-fade-in">Welcome!</h1>
              <p className="text-[#0B4F6C] opacity-80">Log in to your NCPS account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              {/* Username Field */}
              <div className="space-y-2 group">
                <label htmlFor="username" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Username:
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-b-2 border-t-0 border-x-0 rounded-none px-0 border-[#0B4F6C] bg-transparent focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC]"
                  placeholder="John023"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <label htmlFor="password" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Password:
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b-2 border-t-0 border-x-0 rounded-none px-0 pr-16 border-[#0B4F6C] bg-transparent focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC]"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {password && <Check className="w-5 h-5 text-[#0B4F6C] animate-scale-in" />}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#0B4F6C] hover:text-[#3FA9BC] transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-[#0B4F6C] hover:text-[#3FA9BC] transition-all duration-300 relative group inline-block">
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3FA9BC] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full rounded-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group"
                style={{ backgroundColor: '#0B4F6C' }}
              >
                <span className="relative z-10">Log in</span>
                <div className="absolute inset-0 bg-[#3FA9BC] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-[#0B4F6C]">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setShowSignUpModal(true)}
                  className="text-[#0B4F6C] hover:text-[#3FA9BC] transition-all duration-300 underline hover:scale-105 inline-block transform active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="text-center pt-4 lg:pt-8">
              <p className="text-[#0B4F6C]">
                <a href="#" className="hover:text-[#3FA9BC] transition-all duration-300 relative group">
                  Terms of use
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3FA9BC] transition-all duration-300 group-hover:w-full"></span>
                </a>
                {' | '}
                <a href="#" className="hover:text-[#3FA9BC] transition-all duration-300 relative group">
                  Privacy & Terms
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3FA9BC] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Branding Panel */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-8 py-12 relative overflow-hidden lg:min-h-screen" style={{ backgroundColor: '#0B4F6C' }}>
          {/* Background Security Camera Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <img 
              src="https://img.icons8.com/?size=400&id=4RpOhIzbPx4i&format=png&color=B8D4D8"
              alt="Background"
              className="w-96 h-96 object-contain animate-pulse-slow"
            />
          </div>

          {/* Animated gradient circles */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full opacity-20 bg-gradient-to-br from-[#3FA9BC] to-transparent animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full opacity-20 bg-gradient-to-br from-[#B8D4D8] to-transparent animate-float" style={{ animationDelay: '2s' }}></div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-white text-7xl tracking-wider animate-fade-in-up">NCPS</h2>
            <div className="space-y-1">
              <p className="text-white text-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Nasugbu Computer</p>
              <p className="text-white text-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Parts and Services</p>
            </div>
            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-3 h-3 rounded-full mx-auto animate-pulse" style={{ backgroundColor: '#3FA9BC' }}></div>
            </div>
          </div>
        </div>

        {/* Sign Up Modal */}
        <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-4 border-[#0B4F6C]" style={{ backgroundColor: '#B8D4D8' }}>
            <DialogHeader>
              <DialogTitle className="text-center text-[#0B4F6C] flex items-center justify-center gap-3">
                <div className="bg-white rounded-full p-2 border-2 border-[#0B4F6C]">
                  <img 
                    src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=042D62"
                    alt="NCPS Logo"
                    className="w-8 h-8"
                  />
                </div>
                <span>Create Account</span>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSignUp} className="space-y-4 pt-4">
              {/* First Name */}
              <div className="space-y-2 group">
                <label htmlFor="firstName" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  First Name:
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-2 border-[#0B4F6C] rounded-lg bg-white/50 focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC]"
                  placeholder="John"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2 group">
                <label htmlFor="lastName" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Last Name:
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-2 border-[#0B4F6C] rounded-lg bg-white/50 focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC]"
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label htmlFor="email" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Email:
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-[#0B4F6C] rounded-lg bg-white/50 focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC]"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2 group">
                <label htmlFor="phoneNumber" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Phone Number:
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border-2 border-[#0B4F6C] rounded-lg bg-white/50 focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC]"
                  placeholder="+63 912 345 6789"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label htmlFor="signUpPassword" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Password:
                </label>
                <div className="relative">
                  <Input
                    id="signUpPassword"
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full border-2 border-[#0B4F6C] rounded-lg bg-white/50 focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC] pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B4F6C] hover:text-[#3FA9BC] transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 group">
                <label htmlFor="confirmPassword" className="block text-[#0B4F6C] transition-all duration-300 group-focus-within:text-[#3FA9BC]">
                  Confirm Password:
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-2 border-[#0B4F6C] rounded-lg bg-white/50 focus-visible:ring-0 focus-visible:border-[#3FA9BC] text-[#0B4F6C] transition-all duration-300 hover:border-[#3FA9BC] pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B4F6C] hover:text-[#3FA9BC] transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full rounded-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group mt-6"
                style={{ backgroundColor: '#0B4F6C' }}
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-[#3FA9BC] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>

              {/* Already have account */}
              <div className="text-center pt-2">
                <span className="text-[#0B4F6C]">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setShowSignUpModal(false)}
                  className="text-[#0B4F6C] hover:text-[#3FA9BC] transition-all duration-300 underline hover:scale-105 inline-block transform active:scale-95"
                >
                  Log in
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes ping-slow {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.3; }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.2; }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fade-in-up {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes scale-in {
            from { 
              transform: scale(0);
            }
            to { 
              transform: scale(1);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          
          .animate-ping-slow {
            animation: ping-slow 3s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
          }
          
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}