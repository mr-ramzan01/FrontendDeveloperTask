'use client';

import React from 'react';
import GoogleSignIn from '../auth/GoogleSignIn';
import MicrosoftSignIn from '../auth/MicrosoftSignIn';

interface SignInButtonsProps {
    buttonTextPrefix?: string;
    callbackUrl?: string;
    onError?: (error: string) => void; // Made onError optional
}

const SignInButtons: React.FC<SignInButtonsProps> = ({
    buttonTextPrefix = 'Sign in',
    callbackUrl = "/" // Reverted default callback to /
}) => {
    return (
        <div className="space-y-3 w-full">

            <GoogleSignIn
                buttonText={`${buttonTextPrefix} with Google`}
                callbackUrl={callbackUrl} // Pass callbackUrl
            />

            <MicrosoftSignIn
                buttonText={`${buttonTextPrefix} with Microsoft`}
            />
        </div>
    );
};

export default SignInButtons; 