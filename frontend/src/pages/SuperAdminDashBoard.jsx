import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";

const SuperAdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);

  const hospitalsPerPage = 8;

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await apiReq.get("/hospital");
        const hospitals = res.data;
        setHospitals(hospitals);
        setFilteredHospitals(hospitals);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };
    fetchHospitals();
  }, []);

  // Filter hospitals based on search term
  useEffect(() => {
    const filtered = hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setFilteredHospitals(filtered);
    setCurrentPage(1);
  }, [searchTerm, hospitals]);

  // Pagination logic
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = filteredHospitals.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );
  const totalPages = Math.ceil(filteredHospitals.length / hospitalsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CRUD operations
  // Add OR Update Hospital
  const handleSubmit = async (e, hospital) => {
    e.preventDefault();
    try {
      if (hospital.id) {
        // Update
        await apiReq.put(`/hospital/${hospital.id}`, hospital);
        toast.success("Hospital updated successfully");
      } else {
        // Add
        const res = await apiReq.post("/hospital", hospital);
        setHospitals((prev) => [res.data, ...prev]);
        setFilteredHospitals((prev) => [res.data, ...prev]);
        toast.success("Hospital added successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save hospital");
    }
  };

  // Open Add Modal
  const handleAddHospital = () => {
    setCurrentHospital(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEditHospital = (hospital) => {
    setCurrentHospital(hospital);
    setIsModalOpen(true);
  };

  const handleDeleteHospital = (id) => {
    setHospitalToDelete(id);
    setIsDeleteModalOpen(true);
  };
  // Delete Hospital
  const confirmDelete = async () => {
    if (hospitalToDelete) {
      try {
        await apiReq.delete(`/hospital/${hospitalToDelete}`);
        setHospitals(hospitals.filter((h) => h.id !== hospitalToDelete));
        setFilteredHospitals(
          filteredHospitals.filter((h) => h.id !== hospitalToDelete)
        );
        toast.success("Hospital deleted successfully");
      } catch (error) {
        console.error(error.message);

        toast.error("Failed to delete hospital");
      } finally {
        setIsDeleteModalOpen(false);
        setHospitalToDelete(null);
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Hospital Management
        </h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search hospitals..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value || "")}
            />
          </div>
          <button
            onClick={handleAddHospital}
            className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add
          </button>
        </div>

        {/* Hospital Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    phoneNumber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentHospitals.length > 0 ? (
                  currentHospitals.map((hospital) => (
                    <tr
                      key={hospital.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {hospital.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal max-w-xs">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {hospital.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {hospital.phoneNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {hospital.email}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditHospital(hospital)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hospital.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No hospitals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredHospitals.length > hospitalsPerPage && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstHospital + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastHospital, filteredHospitals.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredHospitals.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number
                              ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Hospital Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  {currentHospital ? "Edit Hospital" : "Add New Hospital"}
                </h2>
                <form
                  onSubmit={(e) =>
                    handleSubmit(e, {
                      id: currentHospital?.id || "",
                      name: e.currentTarget.elements.namedItem("name").value,
                      address:
                        e.currentTarget.elements.namedItem("address").value,
                      phoneNumber:
                        e.currentTarget.elements.namedItem("phoneNumber").value,
                      email: e.currentTarget.elements.namedItem("email").value,
                    })
                  }
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={currentHospital?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      defaultValue={currentHospital?.address || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        defaultValue={currentHospital?.phoneNumber || ""}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={currentHospital?.email || ""}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      {currentHospital ? "Update" : "Add"} Hospital
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  Confirm Deletion
                </h2>
                <p className="mb-6 dark:text-gray-300">
                  Are you sure you want to delete this hospital? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md text-sm font-medium hover:bg-red-700 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
