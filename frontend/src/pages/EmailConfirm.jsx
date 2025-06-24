import { useState, useEffect } from "react";
import apiReq from "@/lib/apiReq";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiCheckCircle, FiArrowRight } from "react-icons/fi";

const EmailConfirm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const encodedToken = params.get("token");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Verify, 2: Set Password
  const navigate = useNavigate();

  // Auto-verify email if token exists
  // useEffect(() => {
  //   if (token && userId && !emailVerified) {
  //     handleSubmit();
  //   }
  // }, [token, userId]);

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Needs one uppercase letter";
    if (!/[a-z]/.test(password)) return "Needs one lowercase letter";
    if (!/[0-9]/.test(password)) return "Needs one number";
    if (!/[^A-Za-z0-9]/.test(password)) return "Needs one special character";
    return "";
  };

  const token = decodeURIComponent(encodedToken || "");
  const handleSubmit = async () => {
    setIsLoading(true);
    const data = { userId: userId, token };

    try {
      // console.log(token);
      const res = await apiReq.post("/auth/confirm-email", data);
      toast.success("Email verified successfully!");
      setEmailVerified(true);
      setVerificationSuccess(true);
      // console.log(res);
      setFormData((prev) => ({ ...prev, email: res.data || "" }));
      setTimeout(() => setStep(2), 1500);
    } catch (error) {
      toast.error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handlePasswordSubmit = async () => {
    if (passwordError) return toast.error(passwordError);

    setIsLoading(true);
    try {
      // console.log(formData)
      await apiReq.post("/auth/set-password", formData);
      toast.success("Password set successfully!");
      setShowModal(false);
      setTimeout(() => {
        navigate('/login')
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Verification Card */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMail className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click the button below to confirm your email address
              </p>

              <button
                onClick={handleSubmit}
                disabled={isLoading || verificationSuccess}
                className={`w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                  verificationSuccess
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                    : isLoading
                    ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                }`}
              >
                {verificationSuccess ? (
                  <>
                    <FiCheckCircle className="text-xl" />
                    <span>Verified!</span>
                  </>
                ) : isLoading ? (
                  "Verifying..."
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Password Setup Card */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 animate-fade-in">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiLock className="text-blue-600 dark:text-blue-400 text-2xl" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1">
                    <FiCheckCircle className="text-white text-sm" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                Set Your Password
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                Create a secure password for your account
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-200"
                    />
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full p-3 pl-10 bg-gray-50 dark:bg-gray-700 border ${
                        passwordError
                          ? "border-red-300 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-600"
                      } rounded-lg text-gray-800 dark:text-gray-200`}
                      placeholder="••••••••"
                    />
                    <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePasswordSubmit}
                    disabled={isLoading || passwordError}
                    className={`w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                      isLoading
                        ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                    }`}
                  >
                    {isLoading ? (
                      "Setting Password..."
                    ) : (
                      <>
                        <span>Continue</span>
                        <FiArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirm;
