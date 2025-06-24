import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import apiReq from "@/lib/apiReq";

const AllHospital = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedHospital, setExpandedHospital] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hospitalCategories, setHospitalCategories] = useState({});
  const [doctorsCount, setDoctorsCount] = useState({});

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch hospitals and categories in parallel
        const [hospitalsRes, categoriesRes] = await Promise.all([
          apiReq.get("/Hospital"),
          apiReq.get("/category"),
        ]);

        setHospitals(hospitalsRes.data);
        setCategories(categoriesRes.data);

        // Fetch categories and doctors count for each hospital
        const hospitalCategoriesData = {};
        const doctorsCountData = {};

        await Promise.all(
          hospitalsRes.data.map(async (hospital) => {
            try {
              // Get categories for this hospital
              const categoriesRes = await apiReq.get(
                `/category/hospital/${hospital.id}`
              );
              hospitalCategoriesData[hospital.id] = categoriesRes.data;

              // Get doctors count for this hospital
              const doctorsRes = await apiReq.get(
                `/doctor/hospital/${hospital.id}`
              );
              doctorsCountData[hospital.id] = doctorsRes.data.length;
            } catch (error) {
              console.error(
                `Error fetching data for hospital ${hospital.id}:`,
                error
              );
              hospitalCategoriesData[hospital.id] = [];
              doctorsCountData[hospital.id] = 0;
            }
          })
        );

        setHospitalCategories(hospitalCategoriesData);
        setDoctorsCount(doctorsCountData);

        // Check URL for initial category filter
        const params = new URLSearchParams(location.search);
        const categoryId = params.get("category");
        if (categoryId) {
          const category = categoriesRes.data.find((c) => c.id === categoryId);
          if (category) setSelectedCategory(category);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // Filter hospitals based on search query and selected category
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase());

    // If category is selected, check if hospital has that category
    const matchesCategory =
      !selectedCategory ||
      hospitalCategories[hospital.id]?.some(
        (c) => c.id === selectedCategory.id
      );

    return matchesSearch && matchesCategory;
  });

  // Toggle hospital expansion
  const toggleHospital = (hospitalId) => {
    setExpandedHospital(expandedHospital === hospitalId ? null : hospitalId);
  };

  // Select category filter
  const selectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryFilter(false);
    const params = new URLSearchParams(location.search);
    params.set("category", category.id);
    navigate({ search: params.toString() }, { replace: true });
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    const params = new URLSearchParams(location.search);
    params.delete("category");
    navigate({ search: params.toString() }, { replace: true });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    clearCategoryFilter();
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Find Hospitals Near You
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our network of trusted healthcare providers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search hospitals by name or location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative w-full md:w-64">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300 truncate">
                      {selectedCategory?.name || "Filter by Specialty"}
                    </span>
                  </div>
                  {showCategoryFilter ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0" />
                  )}
                </button>

                {showCategoryFilter && (
                  <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      {selectedCategory && (
                        <button
                          onClick={clearCategoryFilter}
                          className="w-full text-left px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear specialty filter
                        </button>
                      )}
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => selectCategory(category)}
                          className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                            selectedCategory?.id === category.id
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active filters */}
            {(searchQuery || selectedCategory) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active filters:
                </span>
                {searchQuery && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm">
                    <span className="mr-1">Search: "{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {selectedCategory && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm">
                    <span className="mr-1">
                      Specialty: {selectedCategory.name}
                    </span>
                    <button
                      onClick={clearCategoryFilter}
                      className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {filteredHospitals.length}{" "}
            {filteredHospitals.length === 1 ? "Hospital" : "Hospitals"} Found
            {selectedCategory && ` in ${selectedCategory.name}`}
          </h2>
        </div>

        {/* Hospital Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-12 h-12"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:border-blue-100 dark:hover:border-gray-600 ${
                  expandedHospital === hospital.id
                    ? "ring-2 ring-blue-500 dark:ring-blue-600"
                    : ""
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {hospital.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {hospital.address}
                      </p>

                      {/* Hospital Categories */}
                      {hospitalCategories[hospital.id]?.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {hospitalCategories[hospital.id]
                              .slice(
                                0,
                                expandedHospital === hospital.id ? undefined : 2
                              )
                              .map((category) => (
                                <span
                                  key={category.id}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    selectedCategory?.id === category.id
                                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                  }`}
                                >
                                  {category.name}
                                </span>
                              ))}
                            {hospitalCategories[hospital.id].length > 2 && (
                              <button
                                onClick={() => toggleHospital(hospital.id)}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                {expandedHospital === hospital.id ? (
                                  <>
                                    Show less{" "}
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                  </>
                                ) : (
                                  <>
                                    +
                                    {hospitalCategories[hospital.id].length - 2}{" "}
                                    more{" "}
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Hospital Contact Info - shown when expanded */}
                      {expandedHospital === hospital.id && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            <a
                              href={`tel:${hospital.phoneNumber}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {hospital.phoneNumber}
                            </a>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            <a
                              href={`mailto:${hospital.email}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400 truncate"
                            >
                              {hospital.email}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {doctorsCount[hospital.id] || 0} doctors available
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/doctors/?hospital=${hospital.id}`)
                      }
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      View Doctors
                      <ChevronRight className="ml-1.5 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mt-5 text-lg font-semibold text-gray-700 dark:text-white">
                No hospitals found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filters"
                  : "There are currently no hospitals available"}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm hover:shadow-md"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllHospital;
