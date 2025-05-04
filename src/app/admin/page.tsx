
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { AdminDashboard } from '@/components/AdminDashboard'; // Remove static import
import { Icons } from '@/components/icons'; // Import icons
import { Button } from '@/components/ui/button'; // Import Button for loading state
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import AdminDashboard with ssr: false
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard').then(mod => mod.AdminDashboard), {
  ssr: false,
  loading: () => ( // Optional: Add a specific loading component for the dashboard itself
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Icons.loader className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading Dashboard...</p>
    </div>
  ),
});


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

   // Loading state for the initial auth check
  if (isLoggedIn === null) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
         <Icons.loader className="h-12 w-12 animate-spin text-primary mb-4" />
         <p className="text-muted-foreground">Checking Authentication...</p>
       </div>
    );
  }

   // Render dashboard only if logged in is confirmed true
   // The redirect handles the false case.
   // Dynamic import handles the rendering on the client.
  return isLoggedIn ? <AdminDashboard /> : null; // Render null while redirecting or if check failed
}
