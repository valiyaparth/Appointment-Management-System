import { User, Stethoscope } from "lucide-react";

const ProfileHeader = ({ isDoctor, name }) => {
  return (
    <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold flex items-center">
        {isDoctor ? (
          <Stethoscope className="mr-2" />
        ) : (
          <User className="mr-2" />
        )}
        {isDoctor ? "Doctor Profile" : "User Profile"}
      </h1>
    </div>
  );
};

export default ProfileHeader;
