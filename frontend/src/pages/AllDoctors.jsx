import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Filter,
  Search,
  ChevronRight,
  Clock,
  Building,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import d1 from "@/assets/doctor.jpg";
import apiReq from "@/lib/apiReq";

const AllDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("All Specialties");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showHospitalFilter, setShowHospitalFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [expandedDoctors, setExpandedDoctors] = useState({});
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [hospitalsRes, doctorsRes, categoriesRes] = await Promise.all([
          apiReq.get("/Hospital"),
          apiReq.get("/doctor"),
          apiReq.get("/category"),
        ]);

        setHospitals(hospitalsRes.data);
        setDoctors(doctorsRes.data);
        setCategories(categoriesRes.data);

        // Check URL for initial filters
        const params = new URLSearchParams(location.search);
        const hospitalId = params.get("hospital");
        const categoryId = params.get("category");

        if (hospitalId) {
          const hospital = hospitalsRes.data.find((h) => h.id === hospitalId);
          if (hospital) setSelectedHospital(hospital);
        }

        if (categoryId) {
          const category = categoriesRes.data.find((c) => c.id === categoryId);
          if (category) setActiveFilter(category.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // Toggle hospital visibility for a doctor
  const toggleHospitalExpansion = (doctorId) => {
    setExpandedDoctors((prev) => ({
      ...prev,
      [doctorId]: !prev[doctorId],
    }));
  };

  // Search by doctor name
  const searchByDoctorName = async () => {
    try {
      setIsLoading(true);
      const res = await apiReq.get(`/doctor/name/${searchQuery}`);
      setDoctors(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        searchByDoctorName();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get hospital name by ID
  const getHospitalName = (id) => {
    const hospital = hospitals.find((h) => h.id === id);
    return hospital ? hospital.name : "Unknown Hospital";
  };

  // Get hospital address by ID
  const getHospitalAddress = (id) => {
    const hospital = hospitals.find((h) => h.id === id);
    return hospital ? hospital.address : "Address not available";
  };

  // Filter doctors based on current filters
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesFilter =
      activeFilter === "All Specialties" ||
      (doctor.category && doctor.category.name === activeFilter);

    const matchesSearch =
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.category &&
        doctor.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesHospital =
      !selectedHospital ||
      (doctor.hospitalIds && doctor.hospitalIds.includes(selectedHospital.id));

    return matchesFilter && matchesSearch && matchesHospital;
  });

  const clearHospitalFilter = () => {
    setSelectedHospital(null);
    const params = new URLSearchParams(location.search);
    params.delete("hospital");
    navigate({ search: params.toString() }, { replace: true });
  };

  const clearCategoryFilter = () => {
    setActiveFilter("All Specialties");
    const params = new URLSearchParams(location.search);
    params.delete("category");
    navigate({ search: params.toString() }, { replace: true });
  };

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setShowHospitalFilter(false);
    const params = new URLSearchParams(location.search);
    params.set("hospital", hospital.id);
    navigate({ search: params.toString() }, { replace: true });
  };

  const selectCategory = (category) => {
    setActiveFilter(category.name);
    setShowCategoryFilter(false);
    const params = new URLSearchParams(location.search);
    params.set("category", category.id);
    navigate({ search: params.toString() }, { replace: true });
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveFilter("All Specialties");
    setSelectedHospital(null);
    navigate({ search: "" }, { replace: true });
  };

  return (
    <section className=" py-6 md:py-10 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {selectedHospital
              ? `Doctors at ${selectedHospital.name}`
              : "Find Your Specialist"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            {selectedHospital
              ? "Browse doctors available at this hospital"
              : "Connect with top-rated doctors and book appointments instantly"}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search doctors or specialties..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
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

            {/* Filter Buttons - Desktop */}
            <div className="hidden md:flex gap-2">
              {/* Hospital Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowHospitalFilter(!showHospitalFilter)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    selectedHospital
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"
                      : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span>
                    {selectedHospital ? selectedHospital.name : "Hospital"}
                  </span>
                  {showHospitalFilter ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {showHospitalFilter && (
                  <div className="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {selectedHospital && (
                        <button
                          onClick={clearHospitalFilter}
                          className="w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md flex items-center gap-2 text-sm"
                        >
                          <X className="h-4 w-4" />
                          Clear hospital filter
                        </button>
                      )}
                      {hospitals.map((hospital) => (
                        <button
                          key={hospital.id}
                          onClick={() => selectHospital(hospital)}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm ${
                            selectedHospital?.id === hospital.id
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <div className="truncate">
                            <p className="font-medium truncate">
                              {hospital.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {hospital.address}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    activeFilter !== "All Specialties"
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"
                      : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{activeFilter}</span>
                  {showCategoryFilter ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {showCategoryFilter && (
                  <div className="absolute z-10 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="p-2 max-h-80 overflow-y-auto">
                      {activeFilter !== "All Specialties" && (
                        <button
                          onClick={clearCategoryFilter}
                          className="w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md flex items-center gap-2 text-sm"
                        >
                          <X className="h-4 w-4" />
                          Clear filter
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveFilter("All Specialties");
                          setShowCategoryFilter(false);
                          const params = new URLSearchParams(location.search);
                          params.delete("category");
                          navigate(
                            { search: params.toString() },
                            { replace: true }
                          );
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          activeFilter === "All Specialties"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        All Specialties
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => selectCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            activeFilter === category.name
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

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex items-center justify-center gap-2 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Filters Panel */}
          {isMobileFiltersOpen && (
            <div className="md:hidden mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">
                    Hospital
                  </h3>
                  <div className="space-y-2">
                    {selectedHospital && (
                      <button
                        onClick={clearHospitalFilter}
                        className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md text-sm"
                      >
                        <X className="h-4 w-4" />
                        Clear hospital filter
                      </button>
                    )}
                    <div className="max-h-48 overflow-y-auto">
                      {hospitals.map((hospital) => (
                        <button
                          key={hospital.id}
                          onClick={() => {
                            selectHospital(hospital);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm mb-1 ${
                            selectedHospital?.id === hospital.id
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{hospital.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {hospital.address}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">
                    Specialty
                  </h3>
                  <div className="space-y-2">
                    {activeFilter !== "All Specialties" && (
                      <button
                        onClick={clearCategoryFilter}
                        className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md text-sm"
                      >
                        <X className="h-4 w-4" />
                        Clear specialty filter
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActiveFilter("All Specialties");
                        const params = new URLSearchParams(location.search);
                        params.delete("category");
                        navigate(
                          { search: params.toString() },
                          { replace: true }
                        );
                        setIsMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        activeFilter === "All Specialties"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      All Specialties
                    </button>
                    <div className="max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            selectCategory(category);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${
                            activeFilter === category.name
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Found
            </h2>
            {(activeFilter !== "All Specialties" || selectedHospital) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activeFilter !== "All Specialties" &&
                  `Specialty: ${activeFilter}`}
                {activeFilter !== "All Specialties" &&
                  selectedHospital &&
                  " • "}
                {selectedHospital && `Hospital: ${selectedHospital.name}`}
              </p>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 mr-2" />
            <span>Next availability shown</span>
          </div>
        </div>

        {/* Doctors List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse bg-white dark:bg-gray-900"
              >
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="bg-gray-200 dark:bg-gray-800 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                  </div>
                  <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-100 dark:hover:border-gray-700 bg-white dark:bg-gray-900 group"
              >
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-50 dark:border-gray-800 flex-shrink-0">
                      <img
                        src={doctor.imageUrl || d1}
                        alt={doctor.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {doctor.fullName}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 font-medium truncate">
                            {doctor.category?.name || "General Physician"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {doctor.avgRating || 0} 
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {doctor.hospitalIds
                      ?.slice(
                        0,
                        expandedDoctors[doctor.id]
                          ? doctor.hospitalIds.length
                          : 1
                      )
                      .map((hospitalId, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                                <Building className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <span className="font-medium truncate">
                                  {getHospitalName(hospitalId)}
                                </span>
                              </div>

                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-6">
                                <MapPin className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span className="truncate">
                                  {getHospitalAddress(hospitalId)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {doctor.hospitalIds?.length > 1 && (
                      <button
                        onClick={() => toggleHospitalExpansion(doctor.id)}
                        className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center mt-2"
                      >
                        {expandedDoctors[doctor.id] ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show {doctor.hospitalIds.length - 1} more locations
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Available today
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all shadow-sm hover:shadow-md text-sm"
                    >
                      Book Now
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center rounded-xl shadow-sm py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600"
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
              <h3 className="mt-5 text-xl font-semibold text-gray-700 dark:text-white">
                No doctors found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try adjusting your search or filters
              </p>
              <div className="mt-6">
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View More Button */}
        {!isLoading && filteredDoctors.length > 0 && (
          <div className="mt-10 text-center">
            <button className="inline-flex items-center px-5 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm">
              Load More Doctors
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllDoctors;
