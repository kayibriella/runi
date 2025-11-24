import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
    const { signIn } = useAuthActions();
    const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Multi-step signup
    
    // Form data state
    const [formData, setFormData] = useState({
        businessName: "",
        businessEmail: "",
        fullName: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (flow === "signUp") {
                // Create a FormData object with all the collected data
                const signUpData = new FormData();
                signUpData.append("businessName", formData.businessName);
                signUpData.append("businessEmail", formData.businessEmail);
                signUpData.append("fullName", formData.fullName);
                signUpData.append("phoneNumber", formData.phoneNumber);
                signUpData.append("password", formData.password);
                
                // Sign up with business information
                await signIn("password", signUpData);
                toast.success("Account created successfully!");
            } else {
                // Sign in with business email and password
                const formData = new FormData(event.currentTarget);
                await signIn("password", formData);
                toast.success("Signed in successfully!");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            toast.error(
                flow === "signUp"
                    ? "Failed to create account. Please try again."
                    : "Invalid business email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Business Name
    const renderStep1 = () => (
        <div className="space-y-4">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Information</h3>
                <p className="text-gray-600">Let's start by knowing your business name</p>
            </div>
            
            <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                </label>
                <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="auth-input-field"
                    placeholder="Enter your business name"
                    required
                />
            </div>
        </div>
    );

    // Step 2: Business Email
    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Email</h3>
                <p className="text-gray-600">We'll use this to contact your business</p>
            </div>
            
            <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email
                </label>
                <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className="auth-input-field"
                    placeholder="your@business.com"
                    required
                />
            </div>
        </div>
    );

    // Step 3: Full Name and Phone Number
    const renderStep3 = () => (
        <div className="space-y-4">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="auth-input-field"
                    placeholder="Enter your full name"
                    required
                />
            </div>
            
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="auth-input-field"
                    placeholder="+1 (555) 000-0000"
                    required
                />
            </div>
        </div>
    );

    // Step 4: Password and Confirm Password
    const renderStep4 = () => (
        <div className="space-y-4">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Password</h3>
                <p className="text-gray-600">Secure your account with a strong password</p>
            </div>
            
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="auth-input-field"
                    placeholder="Create a secure password"
                    required
                />
            </div>
            
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="auth-input-field"
                    placeholder="Confirm your password"
                    required
                />
            </div>
        </div>
    );

    // Progress bar component
    const ProgressBar = () => (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
                <span className="text-sm font-medium text-gray-700">{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {flow === "signUp" ? "Create Your Business Account" : "Sign In to Your Account"}
                </h2>
                <p className="text-gray-600">
                    {flow === "signUp"
                        ? "Register your business to get started"
                        : "Enter your business email and password"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {flow === "signUp" ? (
                    <>
                        <ProgressBar />
                        
                        {/* Render the current step */}
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                        
                        {/* Navigation buttons */}
                        <div className="flex justify-between mt-8">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            
                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="ml-auto px-6 py-3 rounded bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="ml-auto px-6 py-3 rounded auth-button"
                                    disabled={loading || formData.password !== formData.confirmPassword}
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            )}
                        </div>
                        
                        {/* Password confirmation error */}
                        {step === 4 && formData.password !== formData.confirmPassword && (
                            <div className="text-red-500 text-sm mt-2">
                                Passwords do not match
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div>
                            <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                Business Email
                            </label>
                            <input
                                type="email"
                                id="businessEmail"
                                name="businessEmail"
                                className="auth-input-field"
                                placeholder="your@business.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="auth-input-field"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : flow === "signUp"
                                    ? "Create Account"
                                    : "Sign In"}
                        </button>
                    </>
                )}
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => {
                        setFlow(flow === "signUp" ? "signIn" : "signUp");
                        setStep(1); // Reset step when switching flows
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    {flow === "signUp"
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"}
                </button>
            </div>
        </div>
    );
}