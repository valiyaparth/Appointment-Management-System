import React, { useState, useEffect } from "react";
import noavatar from "@/assets/noavatar.jpeg";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const DoctorManagement = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    experience: "",
    degree: "",
    categoryId: "",
    hospitalId: "",
  });

  useEffect(() => {
    getDoctorList();
    getHospitalCategories();
  }, []);

  const getDoctorList = async () => {
    try {
      setIsLoading(true);
      const res = await apiReq.get(`/doctor/hospital/${user.hospitalId}`);
      console.log(res.data);
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const getHospitalCategories = async () => {
    try {
      const res = await apiReq.get(`/category/hospital/${user.hospitalId}`);
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
    }
  };

  const addNewDoctor = async () => {
    try {
      setIsLoading(true);
      const doctorData = {
        ...newDoctor,
        hospitalId: user.hospitalId,
      };
      const res = await apiReq.post("/doctor", doctorData);

      setDoctors((prev) => [...prev, res.data]);

      toast.success("Doctor added successfully");
      // Reset form
      setNewDoctor({
        fullName: "",
        email: "",
        phoneNumber: "",
        experience: "",
        degree: "",
        categoryId: "",
        hospitalId: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    addNewDoctor();
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        setIsLoading(true);
        await apiReq.delete(
          `/doctor/remove-doctor/?hospitalId=${user.hospitalId}&doctorId=${doctorId}`
        );
        setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorId));
        toast.success("Doctor deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete doctor");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Manage Doctors
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {showAddForm ? "Cancel" : "Add New Doctor"}
        </button>
      </div>

      {/* Add Doctor Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddDoctor}
          className="mb-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
        >
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Add New Doctor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={newDoctor.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={newDoctor.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={newDoctor.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={newDoctor.experience}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Degree
              </label>
              <input
                type="text"
                name="degree"
                value={newDoctor.degree}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={newDoctor.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Doctor"}
            </button>
          </div>
        </form>
      )}

      {/* Doctors List */}
      <div className="overflow-x-auto">
        {isLoading && doctors.length === 0 ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No doctors found
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={doctor.avatar || noavatar}
                          className="rounded-full w-10 h-10"
                          alt={doctor.fullName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {doctor.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {categories.find((c) => c.id === doctor.categoryId)
                            ?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {doctor.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {doctor.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {doctor.degree}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {doctor.experience}{" "}
                      {doctor.experience === 1 ? "year" : "years"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;
