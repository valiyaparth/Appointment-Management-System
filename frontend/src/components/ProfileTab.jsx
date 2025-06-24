import {
  User,
  Mail,
  Stethoscope,
  GraduationCap,
  BookOpen,
  Clock,
} from "lucide-react";
import { Edit } from "lucide-react";

const ProfileTab = ({
  isDoctor,
  editMode,
  toggleEditMode,
  handleSave,
  userData,
  tempData,
  handleInputChange,
  handleHospitalChange,
  isUpdating,
  hospitals = [],
  categories = [],
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isDoctor ? "Doctor Profile" : "User Profile"}
        </h2>
        {editMode ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={toggleEditMode}
              disabled={isUpdating}
              className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Edit className="mr-2" size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <h3 className="font-medium mb-4 flex items-center">
            <User className="mr-2" size={18} /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={tempData.fullName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              ) : (
                <p className="p-2">{userData.fullName || "Not specified"}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                Date of Birth
              </label>
              {editMode ? (
                <input
                  type="date"
                  name="dateofbirth"
                  value={tempData.dateofbirth || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              ) : (
                <p className="p-2">{userData.dateofbirth || "Not specified"}</p>
              )}
            </div>
            {isDoctor && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                    Category
                  </label>
                    <p className="p-2">
                      {categories.find((c) => c.id === userData.category)
                        ?.name || "Not specified"}
                    </p>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                    Hospital
                  </label>
                    <p className="p-2">
                      {hospitals
                        .filter((h) => userData.hospitals?.includes(h.id))
                        .map((h) => h.name)
                        .join(", ") || "Not specified"}
                    </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
          <h3 className="font-medium mb-4 flex items-center">
            <Mail className="mr-2" size={18} /> Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={tempData.email || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              ) : (
                <p className="p-2">{userData.email || "Not specified"}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                Phone
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={tempData.phoneNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              ) : (
                <p className="p-2">{userData.phoneNumber || "Not specified"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details - Only for Doctors */}
        {isDoctor && (
          <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-700">
            <h3 className="font-medium mb-4 flex items-center">
              <Stethoscope className="mr-2" size={18} /> Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300 flex items-center">
                  <GraduationCap className="mr-1" size={16} /> Degree
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="degree"
                    value={tempData.degree || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <p className="p-2">{userData.degree || "Not specified"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300 flex items-center">
                  <BookOpen className="mr-1" size={16} /> Experience (years)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    name="experience"
                    value={tempData.experience || 0}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <p className="p-2">
                    {userData.experience || "Not specified"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300 flex items-center">
                  <Clock className="mr-1" size={16} /> Avg. Time Per Patient
                  (mins)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    name="avgTime"
                    value={tempData.avgTime || 0}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <p className="p-2">{userData.avgTime || "Not specified"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  Description
                </label>
                {editMode ? (
                  <textarea
                    name="description"
                    value={tempData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 rounded border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <p className="p-2 whitespace-pre-line">
                    {userData.description || "No description available"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
