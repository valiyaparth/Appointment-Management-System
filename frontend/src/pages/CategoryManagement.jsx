import apiReq from "@/lib/apiReq";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch existing hospital categories on mount
  useEffect(() => {
    const fetchHospitalCategories = async () => {
      try {
        setIsLoading(true);
        const res = await apiReq.get(`/category/hospital/${user.hospitalId}`);
        setCategories(res.data);
      } catch (error) {
        setError("Failed to load categories");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalCategories();
  }, [user.hospitalId]);

  // Search categories when searchTerm changes
  useEffect(() => {
    const searchCategories = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await apiReq.get(`/category/${searchTerm}`);
        setSearchResults(res.data);
      } catch (error) {
        setError("Failed to search categories");
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchCategories();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const addCategoryToHospital = async (category) => {
    try {
      setIsLoading(true);
      const data = {
        HospitalId: user.hospitalId,
        CategoryId: category.id,
      };

      await apiReq.post("category/add-category", data);

      // Add the new category to the list
      setCategories((prev) => [
        ...prev,
        {
          id: category.id,
          name: category.name,
          doctorCount: 0, // Initial count
        },
      ]);

      // Reset search
      setSearchTerm("");
      setSelectedCategory(null);
      setSearchResults([]);
    } catch (error) {
      setError("Failed to add category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRemove = (categoryId) => {
    setCategoryToDelete(categoryId);
  };

  const removeCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsLoading(true);
      await apiReq.delete(
        `/category/remove-category/?hospitalId=${user.hospitalId}&categoryId=${categoryToDelete}`
      );
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete)
      );
      setError(null);
      toast.success("Category removed");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove category");
      toast.error("Failed to remove category");
    } finally {
      setIsLoading(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Manage Hospital Categories
      </h2>

      {/* Search and Add Category */}
      <div className="mb-8 relative">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search and add medical categories..."
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {selectedCategory && (
            <button
              onClick={() => addCategoryToHospital(selectedCategory)}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
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
                  Adding...
                </span>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Add {selectedCategory.name}
                </>
              )}
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            {searchResults.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCategory?.id === category.id
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  {selectedCategory?.id === category.id && (
                    <span className="text-blue-600 dark:text-blue-400">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
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
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Categories List */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Current Hospital Categories
        </h3>

        {isLoading && categories.length === 0 ? (
          <div className="flex justify-center p-8">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
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
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No categories added yet
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Doctors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {category.doctorCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => confirmRemove(category.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Removal</h3>
            <p className="mb-6">
              Are you sure you want to remove this category from your hospital?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => removeCategory()}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Removing..." : "Confirm Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
