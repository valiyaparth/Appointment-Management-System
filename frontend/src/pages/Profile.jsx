import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ProfileSidebar from "../components/ProfileSidebar.jsx";
import ProfileTab from "../components/ProfileTab.jsx";
import AppointmentsTab from "../components/AppointmentsTab.jsx";
import SettingsTab from "../components/SettingsTab.jsx";
import apiReq from "@/lib/apiReq.js";
import toast from "react-hot-toast";

const Profile = () => {
  const { user: authUser } = useAuth();
  const role = authUser?.role?.toLowerCase();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = authUser.id;
  const doctorId = authUser.doctorId;
  
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateofbirth: "",
    ...(role === "doctor"
      ? {
          experience: 0,
          degree: "",
          description: "",
          avgTime: 0,
          category: "",
          hospitals: [],
        }
      : {}),
  });

  const [tempData, setTempData] = useState({ ...userData });

  // Fetch doctor data and hospitals
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "doctor") {
          const [doctorRes, hospitalsRes, categoriesRes] = await Promise.all([
            apiReq.get(`/doctor/${authUser.doctorId}`),
            apiReq.get(`/hospital/doctor/${authUser.doctorId}`),
            apiReq.get("/category"),
          ]);

          const doctorData = doctorRes.data;
          const hospitalsData = hospitalsRes.data;
          const categoriesData = categoriesRes.data;

          setHospitals(hospitalsData);
          setCategories(categoriesData);

          const hospitalIds = hospitalsData.map((h) => h.id);

          const updatedUserData = {
            fullName: doctorData.fullName || "",
            email: doctorData.email || "",
            phoneNumber: doctorData.phoneNumber || "",
            dateofbirth: doctorData.dateOfBirth || "",
            experience: doctorData.experience || 0,
            degree: doctorData.degree || "",
            description: doctorData.description || "",
            avgTime: doctorData.avgTimePerPatient || 0,
            category: doctorData.categoryId || "",
            hospitals: hospitalIds,
          };

          setUserData(updatedUserData);
          setTempData(updatedUserData);

          if (doctorData.imageUrl) {
            setImagePreview(doctorData.imageUrl);
          }
        } else {
          // Patient data
          const updatedUserData = {
            fullName: authUser?.fullName || "",
            email: authUser?.email || "",
            phoneNumber: authUser?.phoneNumber || "",
            dateofbirth: authUser?.dateOfBirth || "",
          };
          setUserData(updatedUserData);
          setTempData(updatedUserData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authUser, role]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleEditMode = () => {
    if (editMode) {
      setTempData(userData);
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (["experience", "avgTime"].includes(name)) {
      setTempData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value) || 0,
      }));
    }
    // Handle date field
    else if (name === "dateofbirth") {
      setTempData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Handle all other fields
    else {
      setTempData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleHospitalChange = (e) => {
    const selectedHospitals = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setTempData((prev) => ({
      ...prev,
      hospitals: selectedHospitals,
    }));
  };

  const handleSave = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (role === "doctor") {
        const doctorData = {
          fullName: tempData.fullName,
          email: tempData.email,
          phoneNumber: tempData.phoneNumber,
          dateOfBirth: tempData.dateofbirth,
          experience: tempData.experience,
          degree: tempData.degree,
          description: tempData.description,
          avgTimePerPatient: tempData.avgTime,
          ApplicationUserId: authUser.id,
        };
        console.log(doctorData)
        await apiReq.put(`/Doctor/${authUser.doctorId}`, doctorData);
      } else {
        const patientData = {
          fullName: tempData.fullName,
          email: tempData.email,
          phoneNumber: tempData.phoneNumber,
          dateOfBirth: tempData.dateofbirth,
        };
        await apiReq.put("/applicationuser/updateuser", patientData);
      }

      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);
        const imageResponse = await apiReq.post(
          `/upload/profile/${authUser.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (imageResponse.data.imageUrl) {
          setImagePreview(imageResponse.data.imageUrl);
        }
      }

      // Refresh data after update
      if (role === "doctor") {
        const [doctorRes, hospitalsRes] = await Promise.all([
          apiReq.get(`/doctor/${authUser.doctorId}`),
          apiReq.get(`/hospital/doctor/${authUser.doctorId}`),
        ]);
        setHospitals(hospitalsRes.data);
        setUserData((prev) => ({ ...prev, ...doctorRes.data }));
      } else {
        setUserData(tempData);
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const isDoctor = role === "doctor";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
        <ProfileHeader isDoctor={isDoctor} name={userData.fullName} />

        <div className="flex flex-col md:flex-row">
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            imagePreview={imagePreview || authUser?.imageUrl}
            editMode={editMode}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            userData={userData}
            role={role}
          />

          <div className="flex-1 p-6">
            {activeTab === "profile" && (
              <ProfileTab
                isDoctor={isDoctor}
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                handleSave={handleSave}
                userData={userData}
                tempData={tempData}
                handleInputChange={handleInputChange}
                handleHospitalChange={handleHospitalChange}
                isUpdating={isUpdating}
                hospitals={hospitals}
                categories={categories}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentsTab
                isDoctor={isDoctor}
                id={isDoctor ? doctorId : userId}
                navigate={navigate}
              />
            )}

            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
