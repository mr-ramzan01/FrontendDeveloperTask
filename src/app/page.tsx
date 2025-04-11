"use client"; // Make it a client component

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react"; // Import useSession
import Image from 'next/image'; // Import Image component
import { RootState, AppDispatch } from '@/redux/store'; // Import RootState and AppDispatch
import { logout } from '@/redux/reducers/userSlice'; // Import logout action
import Button from '@/components/common/Button'; // Assuming you have a Button component

const Home = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // Get state from both Redux (for credentials/persistence) and NextAuth (for OAuth)
  const { isAuthenticated: reduxIsAuthenticated, user: reduxUser } = useSelector((state: RootState) => state.user);
  const { data: session, status: sessionStatus } = useSession();

  // Determine authentication status based on either Redux or NextAuth session
  const isAuthenticated = reduxIsAuthenticated || sessionStatus === 'authenticated';

  // Determine which user data source to use
  const user = session?.user || reduxUser; // Prioritize session data if available

  // Effect to check authentication and redirect if not logged in
  useEffect(() => {
    // Redirect only if session loading is complete AND neither source shows authenticated
    if (sessionStatus !== 'loading' && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, sessionStatus, router]);

  const handleLogout = async () => {
    try {
      // Sign out from NextAuth (clears session/cookie)
      await signOut({ redirect: false });

      // Dispatch Redux logout (clears Redux state and associated localStorage)
      dispatch(logout());

      // Manually redirect to sign-in page
      router.push('/signin');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Show loading state if NextAuth session is loading and Redux isn't authenticated yet
  if (sessionStatus === 'loading' && !reduxIsAuthenticated) {
    return <div className="p-4">Loading...</div>;
  }

  // If not authenticated after loading, return null (or redirect effect will handle it)
  if (!isAuthenticated) {
    return null;
  }

  // Render content for authenticated users
  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 rounded-xl shadow-md flex flex-col items-center space-y-4 mt-10">
      <h1 className="text-2xl font-bold text-white">Home Page</h1>
      <p className="text-gray-300">Welcome!</p>
      {user?.image && (
        <Image
          src={user.image}
          alt={`${user.name || 'User'}'s profile picture`}
          width={80}
          height={80}
          className="rounded-full"
        />
      )}
      <div className="text-left w-full">
        {user?.name && <p className="text-gray-400">Name: <span className="text-white">{user.name}</span></p>}
        {user?.email && <p className="text-gray-400">Email: <span className="text-white">{user.email}</span></p>}
        {/* Display custom fields if they exist (these might only be on session.user) */}
        {(user as any)?.type && (
           <p className="text-gray-400">Login Type: <span className="text-white capitalize">{(user as any).type}</span></p>
        )}
         {(user as any)?.verified !== undefined && (
           <p className="text-gray-400">Verified: <span className="text-white">{(user as any).verified ? 'Yes' : 'No'}</span></p>
        )}
      </div>
      <Button onClick={handleLogout} variant="solid">
        Logout
      </Button>
    </div>
  );
};

export default Home;