"use client";
import { useState } from "react";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { Listbox } from "@headlessui/react";
import Footer from "@/components/ui/footer";
import { SignupData } from "@/domain/entities/SignUpData";
const COLORS = {
  lime: '#CCFF00',
  darkBg: '#0A0A0A',
  darkCard: '#0F0F0F',
  darkInput: '#141414',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  borderLight: 'rgba(204, 255, 0, 0.06)',
  borderMedium: 'rgba(204, 255, 0, 0.12)',
  borderStrong: 'rgba(204, 255, 0, 0.2)',
  accentGlow: 'rgba(204, 255, 0, 0.08)',
};


const ROLES = [
  { id: 0, name: "Coach" },
  { id: 1, name: "Performance Analyst" },
];
 

export default function SignupForm() {
  const { signup, loading, error } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    role: 0, // القيمة الافتراضية بناءً على الـ Schema
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleListboxChange = (name: "role", value: number) => {
    setForm({ ...form, [name]: value });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name";
        break;
      case 2:
        if (form.password.length < 6) return "Password must be at least 6 characters long";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        if (form.role === null || form.role === undefined) return "Please select a role";
        break;
    }
    return "";
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError("");
    setCurrentStep((prev) => Math.min(prev + 1, 2)); // تم التعديل لخطوتين فقط
  };

  const prevStep = () => {
    setFormError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }

    setFormError("");

    // الداتا اللي هتتبعت للـ API مطابقة للـ Schema بالضبط
    const formattedData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      password: form.password,
      role: form.role,
    }; 

    signup(formattedData as SignupData); // استخدم as any لو الـ interface لسه ماتحدثش، أو شيلها لو حدثته
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.darkBg }}>
      {/* NavBar */}
      <div className="hidden lg:block">
        <NavBar />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden pt-3 pb-2">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, ${COLORS.lime}30, transparent 70%)`,
              filter: 'blur(100px)',
              animation: 'float 8s ease-in-out infinite',
            }}
          ></div>
        </div>

        <div className="flex w-full min-h-full relative z-10 items-center justify-center md:pt-10">
          
          {/* Left Side Info */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
             <div>
                <h1 className="text-5xl font-light leading-tight mb-6" style={{ color: COLORS.textPrimary }}>
                  Join the Athletic Revolution
                </h1>
                <p className="text-lg font-light max-w-lg" style={{ color: COLORS.textSecondary }}>
                  Create your VitaLink account and unlock the power of real-time biometric insights tailored to your unique performance profile.
                </p>
             </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
              <div
                className="rounded-3xl border backdrop-blur-2xl p-8 relative overflow-hidden group"
                style={{
                  backgroundColor: `${COLORS.darkCard}E0`,
                  borderColor: COLORS.borderMedium,
                  boxShadow: `0 25px 50px rgba(0, 0, 0, 0.6), 0 0 1px ${COLORS.borderStrong}, inset 0 1px 0 ${COLORS.borderLight}`,
                }}
              >
                {/* Form Header */}
                <div className="text-center mb-8 relative z-10">
                  <h1 className="text-3xl font-light mb-2" style={{ color: COLORS.textPrimary }}>Create Account</h1>
                  <p className="text-sm font-light" style={{ color: COLORS.textTertiary }}>Step {currentStep} of 2 — Complete your profile</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / 2) * 100}%`, backgroundColor: COLORS.lime }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  
                  {/* Step 1: Basic Info (Names) */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      {/* First Name */}
                      <div>
                        <label className="text-xs uppercase font-semibold tracking-wider mb-1 block" style={{ color: COLORS.textSecondary }}>First Name</label>
                        <input
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          suppressHydrationWarning={true}
                          className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white focus:border-[#CCFF00] outline-none transition-colors"
                          placeholder="Enter first name"
                        />
                      </div>
                      {/* Last Name */}
                      <div>
                        <label className="text-xs uppercase font-semibold tracking-wider mb-1 block" style={{ color: COLORS.textSecondary }}>Last Name</label>
                        <input
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          suppressHydrationWarning={true}
                          className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white focus:border-[#CCFF00] outline-none transition-colors"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Security & Role */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      {/* Role Selection */}
                      <div>
                          <label className="text-xs uppercase font-semibold tracking-wider mb-1 block" style={{ color: COLORS.textSecondary }}>Account Role</label>
                          <Listbox value={form.role} onChange={(val) => handleListboxChange("role", val)}>
                              <div className="relative">
                                  <Listbox.Button className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white text-left focus:border-[#CCFF00] outline-none">
                                      {ROLES.find(r => r.id === form.role)?.name || "Select Role"}
                                  </Listbox.Button>
                                  <Listbox.Options className="absolute mt-1 w-full bg-[#141414] border border-gray-800 rounded-xl overflow-hidden z-20">
                                      {ROLES.map((role) => (
                                          <Listbox.Option key={role.id} value={role.id} className="px-4 py-2 hover:bg-[#CCFF00] hover:text-black cursor-pointer text-white transition-colors">
                                              {role.name}
                                          </Listbox.Option>
                                      ))}
                                  </Listbox.Options>
                              </div>
                          </Listbox>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-xs uppercase font-semibold tracking-wider mb-1 block" style={{ color: COLORS.textSecondary }}>Password</label>
                        <div className="relative">
                            <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            suppressHydrationWarning={true}
                            className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white focus:border-[#CCFF00] outline-none transition-colors"
                            placeholder="Create password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-xs text-gray-500 hover:text-white">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                      </div>
                      
                      {/* Confirm Password */}
                      <div>
                        <label className="text-xs uppercase font-semibold tracking-wider mb-1 block" style={{ color: COLORS.textSecondary }}>
                        Confirm Password
                        </label>
                        <div className="relative"> 
                          <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={handleChange}
                          suppressHydrationWarning={true}
                          className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white focus:border-[#CCFF00] outline-none transition-colors"
                          placeholder="Confirm password"
                          />
                          <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-white transition-colors"
                          style={{ color: form.confirmPassword ? COLORS.textSecondary : COLORS.textTertiary }}
                          >
                          {showConfirmPassword ? "HIDE" : "SHOW"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-8">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    
                    {currentStep < 2 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 py-3 rounded-xl font-bold text-black transition-transform active:scale-95"
                        style={{ backgroundColor: COLORS.lime }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-bold text-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: COLORS.lime }}
                      >
                        {loading ? "Creating..." : "Create Account"}
                      </button>
                    )}
                  </div>

                  {/* Error Messages */}
                  {formError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-xs text-center">
                      {formError}
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-xs text-center">
                      User already exists or server error.
                    </div>
                  )}

                </form>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                    Already have an account? <Link href="/login" className="text-[#CCFF00] hover:underline">Sign In</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}