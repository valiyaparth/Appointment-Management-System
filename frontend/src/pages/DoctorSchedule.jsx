import apiReq from "@/lib/apiReq";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// Helper function to convert day numbers to names
const getDayName = (dayNumber) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayNumber % 7]; // Ensure we don't go out of bounds
};

// Helper function to convert day names to numbers
const getDayNumber = (dayName) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days.indexOf(dayName);
};

const DoctorSchedule = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [filterSpecialty, setFilterSpecialty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch doctor schedules on component mount
  useEffect(() => {
    getDoctorSchedule();
  }, []);

  const getDoctorSchedule = async () => {
    try {
      setIsLoading(true);
      const res = await apiReq.get(`/doctor/get-schedule/${user.hospitalId}`);

      // Transform API data to match our UI structure
      const transformedData = res.data.map((schedule) => ({
        id: schedule.doctorId,
        name: schedule.doctor.fullName,
        specialty: schedule.category.name,
        avatarColor: getRandomColorClass(),
        workingHours: {
          start: schedule.startTime?.substring(0, 5), // Extract HH:MM from HH:MM:SS
          end: schedule.endTime?.substring(0, 5),
        },
        workingDays: {
          monday: schedule.days.includes(1),
          tuesday: schedule.days.includes(2),
          wednesday: schedule.days.includes(3),
          thursday: schedule.days.includes(4),
          friday: schedule.days.includes(5),
          saturday: schedule.days.includes(6),
          sunday: schedule.days.includes(0),
        },
        rawData: schedule, // Keep original data for reference
      }));

      setDoctors(transformedData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctor schedules");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate random color classes for avatars
  const getRandomColorClass = () => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const updateDoctorSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !currentSchedule) return;

    try {
      setIsLoading(true);

      // Convert workingDays back to day numbers array
      const daysArray = [];
      if (currentSchedule.workingDays.monday) daysArray.push(1);
      if (currentSchedule.workingDays.tuesday) daysArray.push(2);
      if (currentSchedule.workingDays.wednesday) daysArray.push(3);
      if (currentSchedule.workingDays.thursday) daysArray.push(4);
      if (currentSchedule.workingDays.friday) daysArray.push(5);
      if (currentSchedule.workingDays.saturday) daysArray.push(6);
      if (currentSchedule.workingDays.sunday) daysArray.push(0);

      const data = {
        DoctorId: selectedDoctor,
        HospitalId: user.hospitalId,
        StartTime: `${currentSchedule.workingHours.start}:00`, // Add seconds
        EndTime: `${currentSchedule.workingHours.end}:00`, // Add seconds
        Days: daysArray,
      };
      console.log(data);
     const res= await apiReq.put("/doctor/update-schedule", data);
      console.log(res.data)
      // Update local state
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === selectedDoctor ? currentSchedule : doc))
      );

      toast.success("Schedule updated successfully");
      setSelectedDoctor(null);
      setCurrentSchedule(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update schedule");
    } finally {
      setIsLoading(false);
    }
  };

  // Set current schedule when selected doctor changes
  useEffect(() => {
    if (selectedDoctor) {
      const existingSchedule = doctors.find((d) => d.id === selectedDoctor);
      if (existingSchedule) {
        setCurrentSchedule({ ...existingSchedule });
        setIsEditing(true);
      }
    }
  }, [selectedDoctor, doctors]);

  const handleDayToggle = (day) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }));
  };

  const handleTimeChange = (field, value) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }));
  };

  const handleApplyWeekdays = (applyToWeekdays) => {
    setCurrentSchedule((prev) => {
      const newWorkingDays = { ...prev.workingDays };
      ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(
        (day) => {
          newWorkingDays[day] = applyToWeekdays;
        }
      );
      return {
        ...prev,
        workingDays: newWorkingDays,
      };
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      filterSpecialty === "All" || doctor.specialty === filterSpecialty;
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Doctor Selection and Schedule Editor */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Schedule Management
            </h2>

            {/* Doctor Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Select Doctor
              </h3>
              <select
                value={selectedDoctor || ""}
                onChange={(e) =>
                  setSelectedDoctor(e.target.value ? e.target.value : null)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              >
                <option value="">Select a doctor to edit schedule</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Editor */}
            {selectedDoctor && currentSchedule && (
              <div className="border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Edit Schedule for {currentSchedule.name}
                  </h3>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyWeekdays(true)}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 text-xs"
                      disabled={isLoading}
                    >
                      All Weekdays
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyWeekdays(false)}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 text-xs"
                      disabled={isLoading}
                    >
                      Clear Weekdays
                    </button>
                  </div>
                </div>

                <form onSubmit={updateDoctorSchedule}>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                      Working Hours
                    </h4>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={currentSchedule.workingHours.start}
                          onChange={(e) =>
                            handleTimeChange("start", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={currentSchedule.workingHours.end}
                          onChange={(e) =>
                            handleTimeChange("end", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                    Available Days
                  </h4>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {Object.entries(currentSchedule.workingDays).map(
                      ([day, isAvailable]) => (
                        <div
                          key={day}
                          onClick={() => !isLoading && handleDayToggle(day)}
                          className={`p-2 border rounded-md cursor-pointer text-center text-sm transition-colors ${
                            isAvailable
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          } ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <span className="capitalize">
                            {day.substring(0, 3)}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoctor(null);
                        setCurrentSchedule(null);
                      }}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Current Schedules */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Doctor Schedules
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {isLoading
                      ? "Loading..."
                      : `Showing ${filteredDoctors.length} of ${doctors.length} doctors`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <select
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                    disabled={isLoading}
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              {isLoading && filteredDoctors.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="flex justify-center">
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
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Loading schedules...
                  </p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    No schedules found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Try adjusting your search or filter
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDoctors.map((doctor) => {
                    const workingDays = Object.entries(doctor.workingDays)
                      .filter(([_, isAvailable]) => isAvailable)
                      .map(([day]) => day.substring(0, 3).toUpperCase());

                    return (
                      <li
                        key={doctor.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`flex-shrink-0 h-10 w-10 rounded-full ${doctor.avatarColor} flex items-center justify-center`}
                              >
                                <span className="font-medium">
                                  {getInitials(doctor.name)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {doctor.name}
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                    {doctor.specialty}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {doctor.workingHours.start} -{" "}
                                  {doctor.workingHours.end}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                                {workingDays.map((day) => (
                                  <span
                                    key={day}
                                    className="px-1.5 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => setSelectedDoctor(doctor.id)}
                                className="ml-4 text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                disabled={isLoading}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
