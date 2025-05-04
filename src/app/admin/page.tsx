
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Icons } from '@/components/icons'; // Import icons
import { Button } from '@/components/ui/button'; // Import Button for loading state

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use null for initial loading state
  const router = useRouter();

  useEffect(() => {
     // Check localStorage only on the client-side
     const loggedInStatus = localStorage.getItem('isLoggedIn');
     if (loggedInStatus === 'true') {
       setIsLoggedIn(true);
     } else {
       // Redirect immediately if not logged in, prevent rendering dashboard briefly
       router.push('/login');
       // Keep isLoggedIn null/false until redirect completes
       setIsLoggedIn(false);
     }
  }, [router]); // Dependency array includes router

   // Loading state
  if (isLoggedIn === null) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
         <Icons.loader className="h-12 w-12 animate-spin text-primary mb-4" />
         <p className="text-muted-foreground">Loading Admin Area...</p>
       </div>
    );
  }

   // Render dashboard only if logged in is confirmed true
   // The redirect handles the false case.
  return isLoggedIn ? <AdminDashboard /> : null; // Render null while redirecting or if check failed
}
