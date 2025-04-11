"use client"
import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import InputBox from "@/components/common/InputBox";
import Paragraph from "@/components/common/Paragraph";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosInformationCircle } from "react-icons/io";

// Password Regex (same as signup)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

export default function NewPassword() {
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({ password: "", confirmPassword: "", general: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const router = useRouter();

    // Check authentication on mount
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authenticated") === "true";
        const emailForReset = localStorage.getItem("resetEmail");

        if (!isAuthenticated || !emailForReset) {
            // If not authenticated or email is missing, redirect away
            console.warn("User not authenticated for password reset. Redirecting...");
            router.replace("/signin"); // Use replace to avoid adding to history
        }
        // Add router to dependency array to satisfy eslint rule
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear the specific error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: "", general: "" });
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { password: "", confirmPassword: "", general: "" };

        // Password complexity check
        if (!formData.password) {
            newErrors.password = "Password is required.";
            valid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
            valid = false;
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must include at least one letter, one number, and one symbol.";
            valid = false;
        }

        // Confirm password check
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
            valid = false;
        } else if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setErrors({ password: "", confirmPassword: "", general: "" });

        if (!validateForm()) {
            return;
        }

        // Re-check authentication before proceeding
        const isAuthenticated = localStorage.getItem("authenticated") === "true";
        const emailForReset = localStorage.getItem("resetEmail");

        if (!isAuthenticated || !emailForReset) {
            setErrors({ ...errors, general: "Authentication failed. Please start the password reset process again." });
            return;
        }

        setIsSubmitting(true);

        try {
            const storedUsers = localStorage.getItem("users");
            if (!storedUsers) {
                throw new Error("User data not found.");
            }
            const users = JSON.parse(storedUsers);

            const userIndex = users.findIndex((user: { email: string }) => user.email === emailForReset);

            if (userIndex !== -1) {
                // User found, update password
                users[userIndex].password = formData.password;
                localStorage.setItem("users", JSON.stringify(users));

                // Clean up localStorage
                localStorage.removeItem("resetEmail");
                localStorage.removeItem("authenticated");

                setIsUpdated(true);
            } else {
                // Should not happen if auth check passed, but handle defensively
                throw new Error("User to update not found.");
            }
        } catch (error: any) {
            console.error("Error updating password:", error);
            setErrors({ ...errors, general: error.message || "An error occurred while updating the password." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-w-[385px] max-w-[500px] h-full flex justify-center items-center m-auto">
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                <Heading text="Create New Password" />
                <Paragraph text="Choose a strong and secure password to keep your account safe. Make sure it's easy for you to remember, but hard for others to guess!" />
                <div className="flex flex-col gap-1">
                    <Paragraph text="New Password" />
                    <InputBox
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="8+ chars, 1 letter, 1 number, 1 symbol"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <Paragraph text="Confirm New Password" />
                    <InputBox
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                        <div className="flex text-red-500 text-xs gap-1 items-center mt-1">
                            <IoIosInformationCircle />
                            <span>{errors.confirmPassword}</span>
                        </div>
                    )}
                </div>
                {errors.general && (
                    <div className="flex text-red-500 text-sm gap-2 items-center mt-2">
                        <IoIosInformationCircle />
                        <p>{errors.general}</p>
                    </div>
                )}

                <Button type="submit" className="mt-5" loading={isSubmitting}>
                    Update Password
                </Button>
            </form>
            <Modal
                buttonText="Go to Sign In"
                isOpen={isUpdated}
                onClose={() => {
                    setIsUpdated(false);
                    router.push("/signin");
                }}
                title="Password Updated!"
                message="Your password has been successfully updated. You can now use your new password to sign in."
            />
        </div>
    );
}
