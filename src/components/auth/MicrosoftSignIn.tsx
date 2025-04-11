'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { BsMicrosoft } from 'react-icons/bs';
// import { ENABLE_MICROSOFT_AUTH } from '@/config'; // Commented out - config file doesn't exist
import Button from '../common/Button';

interface MicrosoftSignInProps {
  buttonText?: string;
  callbackUrl?: string;
  onError?: (error: string) => void;
}

const MicrosoftSignIn: React.FC<MicrosoftSignInProps> = ({
  buttonText = 'Sign in with Microsoft',
  callbackUrl = '/dashboard',
  onError
}) => {
  const dispatch = useDispatch();

  const handleMicrosoftSignIn = async () => {
    try {
      // Skip if Microsoft auth is disabled
      // if (!ENABLE_MICROSOFT_AUTH) {
      //   if (onError) {
      //     onError('Microsoft authentication is currently disabled.');
      //   }
      //   return;
      // }
      
    //   dispatch(loginStart());
      
      // Sign in with NextAuth Microsoft provider
      await signIn('azure-ad', { 
        callbackUrl
      });
      
      // The rest will be handled by NextAuth callbacks and redirects
    } catch (error) {
      console.error('Microsoft sign-in failed:', error);
    //   dispatch(loginFailure('Microsoft sign-in failed'));
      
      if (onError) {
        onError('Microsoft sign-in failed. Please try again.');
      }
    }
  };

  // Temporarily always return null as the config isn't available
  // if (!ENABLE_MICROSOFT_AUTH) {
  //   return null;
  // }

  return (
    <Button
      variant="social" 
      type="button" 
      disabled={true}
      onClick={handleMicrosoftSignIn}
      icon={<BsMicrosoft size={20} />}
    >
      {buttonText}
    </Button>
  );
};

export default MicrosoftSignIn; 