import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import toast from "react-hot-toast";
import apiReq from "@/lib/apiReq";

const SettingsTab = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      "OldPassword":currentPassword,
      "NewPassword":newPassword
    }
    // console.log(data);
    setIsUpdating(true);
    try {
      setIsUpdating(false);
      const res = apiReq.post("/auth/change-password" , data);
      setSuccess(true);
      setConfirmPassword("");
      setNewPassword("");
      setCurrentPassword("");
      toast.success(res.data||" Passwprd Updated");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "failde to change password")
      setSuccess(false)
    } finally{
      setSuccess(false)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="flex items-center mb-8">
        <Shield className="text-blue-500 mr-3 h-8 w-8" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Account Security
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
        <div className="p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 mr-4">
              <Lock className="text-blue-500 dark:text-blue-400 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Password Settings
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 max-w-lg">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter (optional) */}
              <div className="pt-2">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      newPassword.length > 0
                        ? newPassword.length < 4
                          ? "bg-red-500"
                          : newPassword.length < 8
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : ""
                    }`}
                    style={{
                      width: `${Math.min(
                        (newPassword.length / 8) * 100,
                        100
                      )}%`,
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`w-full flex justify-center items-center px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                    isUpdating
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isUpdating ? (
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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center text-green-700 dark:text-green-300 animate-fade-in">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Password updated successfully!</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default SettingsTab;
