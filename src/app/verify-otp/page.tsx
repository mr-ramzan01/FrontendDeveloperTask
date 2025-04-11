"use client"
import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import InputBox from "@/components/common/InputBox";
import Paragraph from "@/components/common/Paragraph";
import Modal from "@/components/ui/Modal";
import { setAuthenticated, setUser } from "@/redux/reducers/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, createRef } from "react";
import { MdOutlineTimer } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyOtp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [time, setTime] = useState(30);
    const [otpError, setOtpError] = useState("");
    const [displayEmail, setDisplayEmail] = useState("");
    const [currentFlow, setCurrentFlow] = useState<'signup' | 'reset' | null>(null);

    const router = useRouter();
    const dispatch = useDispatch();

    const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
    inputRefs.current = Array(6).fill(null).map((_, i) => inputRefs.current[i] ?? createRef<HTMLInputElement>());

    useEffect(() => {
        const signupEmail = localStorage.getItem("signupEmail");
        const resetEmail = localStorage.getItem("resetEmail");
        const signupOtpExists = localStorage.getItem("signupOTP");
        const resetOtpExists = localStorage.getItem("resetOTP");

        if (signupEmail && signupOtpExists) {
            setDisplayEmail(signupEmail);
            setCurrentFlow('signup');
        } else if (resetEmail && resetOtpExists) {
            setDisplayEmail(resetEmail);
            setCurrentFlow('reset');
        } else {
            console.warn("OTP verification context missing, redirecting...");
            router.replace('/signin');
        }
    }, [router]);

    useEffect(() => {
        if (time <= 0) return;
        const intervalId = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [time]);

    const startTimer = () => {
        setTime(30);
        setOtpError("");
    };

    const handleResendOtp = () => {
        try {
            const otpKey = currentFlow === 'signup' ? "signupOTP" : currentFlow === 'reset' ? "resetOTP" : null;
            if (otpKey) {
                 const storedOtp = localStorage.getItem(otpKey);
                 if (storedOtp) {
                     const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                     localStorage.setItem(otpKey, newOtp);
                     setOtp(Array(6).fill(''));
                     inputRefs.current[0]?.current?.focus();
                     startTimer();
                 } else {
                     setOtpError(`Could not resend OTP. ${currentFlow === 'signup' ? 'Please sign up again.' : 'Please request password reset again.'}`)
                 }
            } else {
                setOtpError("Cannot determine OTP type to resend.");
            }

        } catch (error) {
            console.error("Error resending OTP:", error);
            setOtpError("An error occurred while resending OTP.");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setOtpError("");

        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setOtpError("Please enter the complete 6-digit OTP.");
            return;
        }

        setIsSubmitting(true);

        try {
            const signupOtp = localStorage.getItem("signupOTP");
            const resetOtp = localStorage.getItem("resetOTP");

            if (currentFlow === 'signup' && signupOtp && signupOtp === enteredOtp) {
                const signupEmail = localStorage.getItem("signupEmail");
                localStorage.removeItem("signupOTP");
                localStorage.removeItem("signupEmail");

                const storedUsers = localStorage.getItem("users");
                if (storedUsers && signupEmail) {
                    try {
                         const users = JSON.parse(storedUsers);
                         const userIndex = users.findIndex((u: { email: string }) => u.email === signupEmail);
                         if (userIndex !== -1) {
                             users[userIndex].verified = true;
                             localStorage.setItem("users", JSON.stringify(users));
                         }
                     } catch (parseError) {
                         console.error("Failed to parse users from localStorage:", parseError);
                     }
                }
                router.push("/");

            } else if (currentFlow === 'reset' && resetOtp && resetOtp === enteredOtp) {
                localStorage.removeItem("resetOTP");
                localStorage.setItem("authenticated", "true");
                router.push("/new-password");

            } else {
                setOtpError("Incorrect OTP. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setOtpError("An error occurred during verification.");
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setOtpError("");
            if (value && index < 5) {
                inputRefs.current[index + 1]?.current?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.current?.focus();
        }
    };

    return (
        <div className="min-w-[385px] max-w-[500px] h-full flex justify-center items-center m-auto">
            {displayEmail && (
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <Heading text="Enter Otp" />
                    <Paragraph text={`Enter the OTP that we have sent to your email address ${displayEmail}`} />
                    <Link href={currentFlow === 'signup' ? "/signup" : "/forgot-password"} className="link text-xs text-[#8854C0]">
                        Change email address
                    </Link>
                    <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }, (_, index) => (
                            <input
                                key={index}
                                ref={inputRefs.current[index]}
                                type="text"
                                inputMode="numeric"
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(e, index)}
                                maxLength={1}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={`rounded-[10px] text-center bg-[#1D1E26] outline-none text-white border ${otpError ? 'border-red-500' : 'border-[#30303D]'} focus:border-[#8854C0] focus:ring-1 focus:ring-[#8854C0] w-[46px] h-[48px] text-lg transition-colors duration-200`}
                                required
                            />
                        ))}
                    </div>
                    <p className="text-xs text-[#A0A0A0] text-center">Your otp is {localStorage.getItem("signupOTP") || localStorage.getItem("resetOTP")}</p>
                    {otpError && <p className="text-red-500 text-xs text-center mt-1">{otpError}</p>}
                    {
                        time <= 0 ? (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isSubmitting}
                                className="my-3 text-xs w-fit text-[#8854C0] hover:underline self-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <div className="flex my-3 gap-2 items-center text-[#A0A0A0] self-center">
                                <MdOutlineTimer />
                                Resend OTP in {time}s
                            </div>
                        )
                    }
                    <Button type="submit" loading={isSubmitting}>
                        Continue
                    </Button>
                </form>
            )}
        </div>
    );
}
