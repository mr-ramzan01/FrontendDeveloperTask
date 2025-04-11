"use client"
import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import InputBox from "@/components/common/InputBox";
import Paragraph from "@/components/common/Paragraph";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Email Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [isSendLink, setIsSendLink] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) {
            setError("");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setError("");

        if (!email) {
            setError("Email is required.");
            return;
        } else if (!emailRegex.test(email)) {
            setError("Invalid email format.");
            return;
        }

        setIsSubmitting(true);

        try {
            const storedUsers = localStorage.getItem("users");
            const users = storedUsers ? JSON.parse(storedUsers) : [];

            const userExists = users.some((user: { email: string }) => user.email === email);

            if (userExists) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                localStorage.setItem("resetOTP", otp);
                localStorage.setItem("resetEmail", email);
                setIsSubmitting(false);
                setIsSendLink(true);

            } else {
                setError("Email address not found.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error during forgot password process:", error);
            setError("An error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-w-[385px] max-w-[500px] h-full flex justify-center items-center m-auto">
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                <Heading text="Forgot Your Password?" />
                <Paragraph text="Don't worry! Enter your email address, and we'll send you a code to reset it." />
                <div className="flex flex-col gap-1">
                    <Paragraph text="Email Address" />
                    <InputBox
                        placeholder="example@gmail.com"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleChange}
                        error={error}
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>

                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
                <Modal buttonText="Okay" isOpen={isSendLink} onClose={() => {
                    setIsSendLink(!isSendLink);
                    router.push("/verify-otp");
                }} title="Link sent successfully!" message="Check your inbox! We've sent you an email with instructions to reset your password." />
            </form>
        </div>
    );
}
