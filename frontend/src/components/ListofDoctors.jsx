import React, { useState, useEffect } from "react";
import { Star, MapPin, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiReq from "@/lib/apiReq";
import d1 from "@/assets/doctor.jpg";

const ListOfDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleDoctors, setVisibleDoctors] = useState(8);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const res = await apiReq.get("/doctor");
        setDoctors(res.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const loadMoreDoctors = () => {
    setVisibleDoctors((prev) => prev + 4);
  };

  return (
    <section className="w-full py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Our Top Rated Doctors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Book appointments with highly qualified specialists who provide
            exceptional care
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse bg-white dark:bg-gray-800"
              >
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {doctors.slice(0, visibleDoctors).map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 group"
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={doctor.imageUrl || d1}
                      alt={doctor.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full flex items-center text-xs font-medium">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                      {doctor.avgRating || 0} 
                    </div>
                    <div className="absolute top-3 left-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                      Available Today
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {doctor.fullName}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {doctor.category?.name || "General Physician"}
                    </p>

                    {doctor.hospitalIds?.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {doctor.hospitalIds[0]?.name || "City Hospital"}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleDoctors < doctors.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMoreDoctors}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Load More Doctors
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center rounded-xl shadow-sm py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                No doctors available
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                We couldn't find any doctors at the moment
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/doctors")}
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            View All Doctors
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ListOfDoctors;
