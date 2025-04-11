"use client"
import Button from "@/components/common/Button";
import FormDivider from "@/components/common/Divider";
import Heading from "@/components/common/Heading";
import InputBox from "@/components/common/InputBox";
import Paragraph from "@/components/common/Paragraph";
import SignInButtons from "@/components/ui/SignInButtons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/reducers/userSlice";

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
    const dispatch = useDispatch();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value });
        // Reset error for the field being changed
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: "", password: "", confirmPassword: "" };

        if (!formData.email) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
            valid = false;
        }

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

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        try {
            // Store data in local storage
            const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

            // Check if email already exists
            const emailExists = existingUsers.some((user: { email: string }) => user.email === formData.email);
            if (emailExists) {
                // Handle existing email - setting an error and stopping submission
                setErrors({ ...errors, email: "Email already exists." });
                setIsSubmitting(false);
                return;
            }

            const newUser = { email: formData.email, password: formData.password }; // Store only email and password
            existingUsers.push(newUser);
            localStorage.setItem("users", JSON.stringify(existingUsers));

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem("signupOTP", otp); // Store OTP
            localStorage.setItem("signupEmail", formData.email); // Store OTP
            // Optionally associate OTP with email for better security if needed:
            // localStorage.setItem(`otp_${formData.email}`, otp);

            dispatch(setUser({ email: formData.email, verified: false }));

            // Redirect to OTP verification page
            router.push("/verify-otp");
        } catch (error) {
            console.error("Error during sign up:", error);
            // Handle potential errors (e.g., local storage quota exceeded)
            // Display a generic error message to the user
            // Example: setErrors({ ...errors, form: "An unexpected error occurred. Please try again." });
            // Make sure to have a place to display this form-level error if needed
            setIsSubmitting(false);
        }
        // No need to set isSubmitting back to false if redirecting successfully
    };

    return (
        <div className="min-w-[385px] max-w-[500px] m-auto py-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Heading text="Sign Up" />
                <Paragraph text="Create your account to manage your workspace." />
                <div className="flex flex-col gap-1">
                    <Paragraph text="Email Address" />
                    <InputBox
                        placeholder="example@gmail.com"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <Paragraph text="Password" />
                    <InputBox
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="8+ chars, 1 letter, 1 number, 1 symbol"
                        error={errors.password}
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <Paragraph text="Confirm Password" />
                    <InputBox
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>
                <Button type="submit" loading={isSubmitting}>
                    Sign Up
                </Button>
                <FormDivider />
                <SignInButtons
                    buttonTextPrefix="Sign up"
                    callbackUrl="/dashboard"
                    onError={() => {
                        // Handle Sign in button errors if necessary
                     }}
                />
                <p className="text-center text-[#DADADA] text-sm mt-2">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-[#8854C0] hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
}
