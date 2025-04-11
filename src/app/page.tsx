"use client"; // Make it a client component

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react"; // Import signOut for NextAuth logout
import { RootState, AppDispatch } from '@/redux/store'; // Import RootState and AppDispatch
import { logout } from '@/redux/reducers/userSlice'; // Import logout action
import Button from '@/components/common/Button'; // Assuming you have a Button component

const Home = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  // Effect to check authentication and redirect if not logged in
  useEffect(() => {
    // Wait for persistence to possibly rehydrate auth state
    // A small delay or checking a loading state from PersistGate might be more robust,
    // but this checks on initial render and subsequent updates.
    if (!isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      // Clear NextAuth session
      await signOut({ redirect: false }); // redirect: false prevents NextAuth default redirect

      // Dispatch Redux logout action (clears Redux state and localStorage)
      dispatch(logout());

      // Manually redirect to sign-in page
      router.push('/signin');
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle logout error if needed
    }
  };

  // If not authenticated yet (or during initial redirect), show loading or nothing
  if (!isAuthenticated) {
    // Optionally, show a loading spinner or skeleton screen
    return <div>Loading...</div>; // Or return null;
  }

  // Render content for authenticated users
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Home Page (Protected)</h1>
      {user && (
        <p className="mb-4">Welcome, {user.email}!</p>
      )}
      <Button onClick={handleLogout} variant="solid">
        Logout
      </Button>
    </div>
  );
};

export default Home;