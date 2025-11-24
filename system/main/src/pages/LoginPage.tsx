import { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F9FA] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#4DBDCC]/10 blur-3xl animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#0B4F6C]/10 blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#4DBDCC]/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0B4F6C] text-white mb-4 shadow-lg ring-4 ring-[#4DBDCC]/30">
            <img 
              src="https://img.icons8.com/?size=100&id=4RpOhIzbPx4i&format=png&color=ffffff"
              alt="NCPS Logo"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#0B4F6C] tracking-tight">Welcome Back</h1>
          <p className="text-gray-500">Sign in to access your dashboard</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl text-center text-[#0B4F6C]">NCPS Portal</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-[#0B4F6C] hover:text-[#4DBDCC] font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0B4F6C] transition-colors" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <Button 
                type="submit" 
                className="w-full bg-[#0B4F6C] hover:bg-[#094057] text-white transition-all duration-300 h-11 text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <button className="font-bold text-[#0B4F6C] hover:text-[#4DBDCC] transition-colors hover:underline">
                Sign up
              </button>
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
