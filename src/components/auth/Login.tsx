
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons'; // Import Icons
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic authentication logic (replace with real auth later)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome back, admin!",
      });
      router.push('/admin');
    } else {
      setError('Invalid username or password. Please try again.');
      toast({
        title: "Login Failed",
        description: error || "Invalid credentials.", // Show specific error if available
        variant: "destructive",
      });
       setIsLoading(false);
    }
     // No need to set isLoading false on success, as redirect happens
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
             <Icons.logIn className="h-6 w-6" /> Login to Your Account
          </CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
               <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-md text-sm flex items-start gap-2">
                   <Icons.alertCircle className="h-5 w-5 flex-shrink-0" />
                   <span>{error}</span>
               </div>
             )}
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logIn className="mr-2 h-4 w-4" />}
               {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-sm text-center block">
           Don't have an account?{' '}
           <Link href="/register" className="font-medium text-primary hover:underline">
             Register here
           </Link>
         </CardFooter>
      </Card>
    </div>
  );
};

// Add needed icons to src/components/icons.ts: logIn, alertCircle
