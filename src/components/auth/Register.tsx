
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

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password.length < 6) {
       setError('Password must be at least 6 characters long.');
       toast({ title: "Registration Error", description: "Password too short.", variant: "destructive" });
       return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      toast({ title: "Registration Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    // Basic registration logic (replace with real auth later)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assuming registration is always successful for this basic example
    try {
      // In a real app, you would call your registration API endpoint here.
      // For now, we just simulate success.
      localStorage.setItem('isLoggedIn', 'true'); // Auto-login after registration for demo
       toast({
        title: "Registration Successful",
        description: `Welcome, ${username}! You are now logged in.`,
      });
      router.push('/admin'); // Redirect to admin dashboard after registration
    } catch (apiError: any) {
       // Handle potential API errors from a real backend
       setError(apiError.message || 'Registration failed. Please try again.');
       toast({
         title: "Registration Failed",
         description: apiError.message || 'An unexpected error occurred.',
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
            <Icons.userPlus className="h-6 w-6" /> Create Your Account
          </CardTitle>
          <CardDescription>Join AI Blog Central to manage posts.</CardDescription>
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
                placeholder="Choose a username"
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
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.userPlus className="mr-2 h-4 w-4" />}
               {isLoading ? 'Registering...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center block">
           Already have an account?{' '}
           <Link href="/login" className="font-medium text-primary hover:underline">
             Log in here
           </Link>
         </CardFooter>
      </Card>
    </div>
  );
};

// Add needed icons to src/components/icons.ts: userPlus, alertCircle
