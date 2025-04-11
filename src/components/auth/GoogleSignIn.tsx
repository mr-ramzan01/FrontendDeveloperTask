'use client';

import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { FcGoogle } from 'react-icons/fc';
import Button from '../common/Button';
import { setUser } from '@/redux/reducers/userSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface GoogleSignInProps {
  buttonText?: string;
  callbackUrl?: string;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  buttonText = 'Sign in with Google',
  callbackUrl = "/api/auth/callback/google"
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleGoogleSignIn = async () => {
    try {
      console.log('herer');
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.log('Google sign-in error:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      dispatch(setUser({
          email: session.user.email || '',
          name: session.user.name || '',
          image: session.user.image || '',
          type: 'google',
          verified: true
      }));
    }
  }, [status, session, dispatch, router, callbackUrl]);

  return (
    <Button
      variant="social"
      type="button"
      onClick={handleGoogleSignIn}
      loading={status === 'loading'}
      icon={<FcGoogle size={20} />}
    >
      {buttonText}
    </Button>
  );
};

export default GoogleSignIn; 