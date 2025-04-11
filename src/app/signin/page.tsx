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
import { setUser } from "@/redux/reducers/userSlice";
import { useDispatch } from "react-redux";

// Email Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (authError) {
      setAuthError("");
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

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
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setAuthError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const storedUsers = localStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find(
        (u: { email: string }) => u.email === formData.email
      );

      if (user && user.password === formData.password) {
        router.push("/");
        dispatch(setUser({ email: formData.email, verified: true }));
        localStorage.setItem("singinEmail", formData.email);
      } else {
        setAuthError("Invalid email or password.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setAuthError("An error occurred during sign in. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-[385px] max-w-[500px] m-auto py-8">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Heading text="Sign In" />
        <Paragraph text="Welcome back! Sign in to access your workspace." />
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
            error={errors.password}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input type="checkbox" className="cursor-pointer" />
            <label htmlFor="rememberMe" className="ml-2 block text-xs md:text-sm cursor-pointer" style={{ color: 'var(--paragraph)' }}>
              Remember me
            </label>
          </div>

          <Link href="/forgot-password" className="link text-xs text-[#8854C0]">
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" loading={isSubmitting}>
          Sign In
        </Button>
        {authError && <p className="text-red-500 text-sm text-center mt-2">{authError}</p>}
        <FormDivider />
        <SignInButtons
          buttonTextPrefix="Sign in"
          callbackUrl="/dashboard"
          onError={() => { }}
        />
        <p className="text-center text-[#DADADA] text-sm mt-2">
          {`Don't have an account? `}
          <Link href="/signup" className="text-[#8854C0] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
