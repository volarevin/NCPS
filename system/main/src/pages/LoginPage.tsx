import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, Mail, Phone, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type ViewMode = 'login' | 'signup' | 'forgot-password';

export default function LoginPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    switch (viewMode) {
      case 'login': document.title = "NCPS Login"; break;
      case 'signup': document.title = "NCPS Sign Up"; break;
      case 'forgot-password': document.title = "Reset Password"; break;
    }
  }, [viewMode]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Configuration
    const boxSize = 20; // Tiny boxes
    const lights = [
      { 
        x: Math.random() * width, 
        y: Math.random() * height, 
        vx: (Math.random() - 0.5) * 3.0, // Increased speed
        vy: (Math.random() - 0.5) * 3.0, 
        baseRadius: 400, 
        radius: 400,
        pulseSpeed: 0.002,
        pulseOffset: Math.random() * Math.PI * 2,
        color: '77, 189, 204' 
      }, // #4DBDCC
      { 
        x: Math.random() * width, 
        y: Math.random() * height, 
        vx: (Math.random() - 0.5) * 3.0, 
        vy: (Math.random() - 0.5) * 3.0, 
        baseRadius: 450, 
        radius: 450,
        pulseSpeed: 0.0015,
        pulseOffset: Math.random() * Math.PI * 2,
        color: '11, 79, 108' 
      }, // #0B4F6C
    ];

    const draw = () => {
      ctx.fillStyle = '#F0F9FA';
      ctx.fillRect(0, 0, width, height);

      const time = Date.now();

      // Update lights
      lights.forEach(light => {
        // Organic movement: slightly change velocity
        light.vx += (Math.random() - 0.5) * 0.1;
        light.vy += (Math.random() - 0.5) * 0.1;
        
        // Limit max speed
        const maxSpeed = 4.0; // Increased max speed
        const speed = Math.hypot(light.vx, light.vy);
        if (speed > maxSpeed) {
          light.vx = (light.vx / speed) * maxSpeed;
          light.vy = (light.vy / speed) * maxSpeed;
        }

        light.x += light.vx;
        light.y += light.vy;

        // Bounce off walls
        if (light.x < -200 || light.x > width + 200) light.vx *= -1;
        if (light.y < -200 || light.y > height + 200) light.vy *= -1;

        // Pulsate radius
        light.radius = light.baseRadius + Math.sin(time * light.pulseSpeed + light.pulseOffset) * 80;
      });

      // Draw grid
      const cols = Math.ceil(width / boxSize);
      const rows = Math.ceil(height / boxSize);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * boxSize;
          const y = j * boxSize;
          const cx = x + boxSize / 2;
          const cy = y + boxSize / 2;

          let maxOpacity = 0;
          let activeColor = '';

          for (const light of lights) {
            const dist = Math.hypot(cx - light.x, cy - light.y);
            if (dist < light.radius) {
              // Smoother falloff
              const opacity = Math.pow(1 - dist / light.radius, 2);
              if (opacity > maxOpacity) {
                maxOpacity = opacity;
                activeColor = light.color;
              }
            }
          }

          if (maxOpacity > 0.05) { // Threshold to avoid drawing barely visible boxes
            ctx.strokeStyle = `rgba(${activeColor}, ${maxOpacity * 0.5})`; // Restored darkness
            ctx.lineWidth = 1; // Restored thickness
            ctx.strokeRect(x, y, boxSize, boxSize);
            
            ctx.fillStyle = `rgba(${activeColor}, ${maxOpacity * 0.05})`; // Very subtle fill
            ctx.fillRect(x, y, boxSize, boxSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (viewMode === 'forgot-password') {
      console.log('Reset password for:', email);
      toast.success("Password reset link sent to your email!");
      setViewMode('login');
      setIsLoading(false);
      return;
    }

    if (viewMode === 'signup') {
      // Sign Up Logic
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Mock check for existing username
      if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'customer') {
        toast.error("Username already exists");
        setIsLoading(false);
        return;
      }

      console.log('Sign Up attempt:', { username, firstName, lastName, email, phone, password });
      toast.success("Account created successfully! Please login.");
      setViewMode('login');
      setIsLoading(false);
      return;
    }

    // Login Logic
    console.log('Login attempt:', { username, password });
    
    // Simple routing logic for demo
    if (username.toLowerCase().includes('admin')) {
      navigate('/admin');
    } else if (username.toLowerCase().includes('tech')) {
      navigate('/technician');
    } else if (username.toLowerCase().includes('recep')) {
      navigate('/receptionist');
    } else {
      navigate('/customer');
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FA] relative overflow-hidden">
      {/* Background Elements */}
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className="w-full max-w-md z-10 px-4 py-8">
        <div className="text-center mb-8 space-y-2 transition-all duration-500 ease-in-out">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0B4F6C] text-white mb-4 shadow-lg ring-4 ring-[#4DBDCC]/30">
            <img 
              src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=ffffff"
              alt="NCPS Logo"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0B4F6C] tracking-tight">
            {viewMode === 'login' && 'Welcome Back'}
            {viewMode === 'signup' && 'Create Account'}
            {viewMode === 'forgot-password' && 'Reset Password'}
          </h1>
          <p className="text-gray-500">
            {viewMode === 'login' && 'Sign in to access your dashboard'}
            {viewMode === 'signup' && 'Join NCPS today'}
            {viewMode === 'forgot-password' && 'Enter your email to receive instructions'}
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl text-center text-[#0B4F6C]">
              {viewMode === 'login' && 'NCPS Portal'}
              {viewMode === 'signup' && 'Sign Up'}
              {viewMode === 'forgot-password' && 'Forgot Password'}
            </CardTitle>
            <CardDescription className="text-center">
              {viewMode === 'login' && 'Enter your credentials to continue'}
              {viewMode === 'signup' && 'Fill in your details to register'}
              {viewMode === 'forgot-password' && 'We\'ll send you a reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div key={viewMode} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {viewMode === 'forgot-password' && (
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                      </div>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20"
                        required
                      />
                    </div>
                  </div>
                )}

                {viewMode === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0912 345 6789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {(viewMode === 'login' || viewMode === 'signup') && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {(viewMode === 'login' || viewMode === 'signup') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {viewMode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => {
                            setViewMode('forgot-password');
                            resetForm();
                          }}
                          className="text-xs text-[#0B4F6C] hover:text-[#4DBDCC] font-medium transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={viewMode === 'login' ? "Enter your password" : "Create a password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#0B4F6C] transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {viewMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 border-gray-200 focus:border-[#0B4F6C] focus:ring-[#0B4F6C]/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#0B4F6C] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#0B4F6C] hover:bg-[#094057] text-white transition-all duration-300 h-11 text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {viewMode === 'login' && <>Sign In <ArrowRight className="w-4 h-4" /></>}
                      {viewMode === 'signup' && <>Create Account <UserPlus className="w-4 h-4" /></>}
                      {viewMode === 'forgot-password' && <>Send Reset Link <KeyRound className="w-4 h-4" /></>}
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                {viewMode === 'login' && (
                  <>
                    <span className="text-gray-500">Don't have an account? </span>
                    <button 
                      onClick={() => {
                        setViewMode('signup');
                        resetForm();
                      }}
                      className="font-bold text-[#0B4F6C] hover:text-[#4DBDCC] transition-colors hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                )}
                {viewMode === 'signup' && (
                  <>
                    <span className="text-gray-500">Already have an account? </span>
                    <button 
                      onClick={() => {
                        setViewMode('login');
                        resetForm();
                      }}
                      className="font-bold text-[#0B4F6C] hover:text-[#4DBDCC] transition-colors hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
                {viewMode === 'forgot-password' && (
                  <button 
                    onClick={() => {
                      setViewMode('login');
                      resetForm();
                    }}
                    className="flex items-center justify-center gap-2 mx-auto font-bold text-[#0B4F6C] hover:text-[#4DBDCC] transition-colors hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          &copy; 2025 Nasugbu Computer Parts and Services. All rights reserved.
        </div>
      </div>
    </div>
  );
}
