import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import apiReq from "@/lib/apiReq";
import { toFormData } from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const phoneRegex = /^[0-9]{10}$/;
  
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number (10 digits required)";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors");
      return;
    }

    const loadingToast = toast.loading("Creating account...");
    try {
      setIsSubmitting(true);

      const apiData = {
        FullName: formData.fullName,
        Email: formData.email,
        PhoneNumber: formData.phoneNumber,
        DateOfBirth: formData.dateOfBirth,
      };

      const res = await apiReq.post("/auth/register", apiData);
      // console.log(res.data);
      toast.success("Registration sucessfull! Check Your Email", {
        id: loadingToast,
        duration: 5000,
      });
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 409) {
        toast.error(error.response.data, {
          id: loadingToast,
        });
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      } else {
        toast.error("An error occurred. Please try again.", {
          id: loadingToast,
        });
        
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="mx-3  flex flex-col justify-center pb-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isMounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Create your account
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isMounted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white/80 rounded-2xl dark:bg-gray-800/80 backdrop-blur-lg py-8 px-4 shadow-lg   sm:px-10 border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isMounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.fullName
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-gray-200 transition-all duration-200`}
                />
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isMounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-gray-200 transition-all duration-200`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isMounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.phoneNumber
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-gray-200 transition-all duration-200`}
                />
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.phoneNumber}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Date of Birth */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isMounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date of Birth
              </label>
              <div className="mt-1">
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.dateOfBirth
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-gray-200 transition-all duration-200`}
                />
                {errors.dateOfBirth && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.dateOfBirth}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-300 ${
                  isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-300"
              >
                Sign in
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
