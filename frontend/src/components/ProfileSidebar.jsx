import { User, Calendar, Lock } from "lucide-react";
import { Camera } from "lucide-react";

const ProfileSidebar = ({
  activeTab,
  setActiveTab,
  imagePreview,
  editMode,
  triggerFileInput,
  fileInputRef,
  handleImageUpload,
  userData,
  role,
}) => {
  return (
    <div className="w-full md:w-64 p-4 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center py-6 relative">
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={64} />
          )}
          {editMode && (
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all"
            >
              <Camera size={16} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </button>
          )}
        </div>
        <h2 className="text-xl font-semibold">{userData.fullName}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {role}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          DOB: {userData.dateofbirth || "Not specified"}
        </p>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
            activeTab === "profile"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <User className="mr-3" size={18} /> Profile
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
            activeTab === "appointments"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Calendar className="mr-3" size={18} /> Appointments
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
            activeTab === "settings"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Lock className="mr-3" size={18} /> Security
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
