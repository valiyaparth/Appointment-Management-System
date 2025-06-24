import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  Check,
  ChevronRight,
  User,
  Shield,
  Building,
  Loader,
} from "lucide-react";
import apiReq from "@/lib/apiReq";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ReviewListComponent from "@/components/ReviewListComponent ";

const Appointment = () => {
  const { id: doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState({
    doctor: true,
    hospitals: true,
    schedule: true,
    booking: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [availability, setAvailability] = useState([]);
  
  const [timeSlots, setTimeSlots] = useState([]);
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, reviews: true }));
      const res = await apiReq.get(
        `/doctor/get-reviews/doctor?doctorId=${doctorId}`
      );
      setReviews(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading((prev) => ({ ...prev, reviews: false }));
    }
  };

  useEffect(() => {
    getReviews();
  }, [doctorId]);

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      const data = {
        ReviewId: reviewId,
        Message: replyText,
        ReplyBy: user.role === "Doctor" ? 1 : 2, // 1 for Doctor, 2 for Hospital Admin
      };

      const response = await apiReq.post(`/appointment/add-reply`, data);

      if (response.data) {
        toast.success("Reply submitted successfully");
        // Refresh reviews after successful reply
        await getReviews();
      }
    } catch (error) {
      toast.error("Failed to submit reply");
      console.error(error);
    }
  };

  const handleReplyUpdate = async (reviewId, replyId, replyText) => {
    try {
      const data = {
        ReviewId: reviewId,
        ReplyId: replyId,
        Message: replyText,
      };

      const response = await apiReq.put(`/appointment/update-reply`, data);

      if (response.data) {
        toast.success("Reply updated successfully");
        // Refresh reviews after successful update
        await getReviews();
      }
    } catch (error) {
      toast.error("Failed to update reply");
      console.error(error);
    }
  };

  const handleReplyDelete = async (reviewId, replyId) => {
    try {
      const response = await apiReq.delete(`/appointment/delete-reply`, {
        data: {
          ReviewId: reviewId,
          ReplyId: replyId,
        },
      });

      if (response.data) {
        toast.success("Reply deleted successfully");
        // Refresh reviews after successful deletion
        await getReviews();
      }
    } catch (error) {
      toast.error("Failed to delete reply");
      console.error(error);
    }
  };

  // Fetch doctor's schedule
  const getDoctorSchedule = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, schedule: true }));
      const res = await apiReq.get(
        `/doctor/get-schedule-by-doctor/${doctorId}`
      );
      setSchedule(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to load doctor's schedule");
      return [];
    } finally {
      setIsLoading((prev) => ({ ...prev, schedule: false }));
    }
  };

  // Fetch time slots for a specific hospital and date
  const getTimeSlotsPerDay = async (hospitalId, date) => {
    try {
      setIsLoading((prev) => ({ ...prev, schedule: true }));
      const res = await apiReq.get(
        `/doctor/timeslots?hospitalId=${hospitalId}&doctorId=${doctorId}&date=${date}`
      );
      setTimeSlots(res.data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Failed to load available time slots");
      setTimeSlots([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, schedule: false }));
    }
  };

  // Book appointment
  const bookAppointment = async (date, timeSlot, hospitalId) => {
    try {
      setIsLoading((prev) => ({ ...prev, booking: true }));
      const data = {
        Date: date,
        TimeSlot: timeSlot,
        applicationUserId: user.id,
        doctorId: doctorId,
        hospitalId: hospitalId,
      };

      const res = await apiReq.post(`/appointment`, data);
      return res.data;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, booking: false }));
    }
  };

  // Handle hospital selection
  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDay(null);
    setSelectedSlot(null);
    setTimeSlots([]);

    // If there's a default day selected, fetch slots for that day
    if (availability.length > 0) {
      const firstAvailableDay = availability.find(
        (day) => hospital.slots[day.day]
      );
      if (firstAvailableDay) {
        const date = firstAvailableDay.isoDate;
        getTimeSlotsPerDay(hospital.id, date);
        setSelectedDay(`${firstAvailableDay.day}, ${firstAvailableDay.date}`);
      }
    }
  };

  // Handle day selection
  const handleDaySelect = (day, date, isoDate) => {
    setSelectedDay(`${day}, ${date}`);
    setSelectedSlot(null);
    if (selectedHospital) {
      getTimeSlotsPerDay(selectedHospital.id, isoDate);
    }
  };

  // Get available slots for the selected day
  const getAvailableSlotsForDay = () => {
    if (!selectedDay || !timeSlots.length) return [];

    return timeSlots.map((slot) => {
      const [hours, minutes] = slot.startTime.split(":");
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      return {
        display: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isBooked: slot.isBooked,
        apiFormat: slot.startTime,
      };
    });
  };

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedHospital || !selectedDay) return;

    try {
      const [day, date] = selectedDay.split(", ");
      const selectedDayData = availability.find(
        (d) => `${d.day}, ${d.date}` === selectedDay
      );

      if (!selectedDayData) {
        throw new Error("Selected day not found");
      }

      // Find the selected slot in the timeSlots array
      const selectedSlotData = timeSlots.find((slot) => {
        const [hours, minutes] = slot.startTime.split(":");
        const time = new Date();
        time.setHours(parseInt(hours, 10));
        time.setMinutes(parseInt(minutes, 10));
        const formattedTime = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return formattedTime === selectedSlot && !slot.isBooked;
      });

      if (!selectedSlotData) {
        throw new Error("Selected slot not available");
      }

      await bookAppointment(
        selectedDayData.isoDate,
        selectedSlotData.startTime,
        selectedHospital.id
      );

      setBookingConfirmed(true);
      setShowSuccess(true);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  // Generate time slots between start and end time
  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      slots.push(currentTime);
      // Add duration to current time
      const [hours, minutes] = currentTime.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10) + duration);
      currentTime = `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}:00`;
    }

    return slots;
  };

  // Format time for display
  const formatTimeForDisplay = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fetch doctor information and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading({
          doctor: true,
          hospitals: true,
          schedule: true,
          booking: false,
        });

        const doctorRes = await apiReq.get(`/doctor/${doctorId}`);
        setDoctor(doctorRes.data);

        // Fetch hospitals in parallel with schedule
        const [hospitalsData, scheduleData] = await Promise.all([
          Promise.all(
            doctorRes.data.hospitalIds.map(async (hospitalId) => {
              const res = await apiReq.get(`/hospital/${hospitalId}`);
              return res.data;
            })
          ),
          getDoctorSchedule(),
        ]);

        // Process schedule data to create availability
        const daysMap = {
          1: "Mon",
          2: "Tue",
          3: "Wed",
          4: "Thu",
          5: "Fri",
          6: "Sat",
          0: "Sun",
        };

        const today = new Date();
        const availabilityData = [];

        // Create next 7 days availability
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dayOfWeek = date.getDay();
          const dayName = daysMap[dayOfWeek];

          availabilityData.push({
            day: dayName,
            date: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            dateObj: date,
            dayNumber: dayOfWeek,
            isoDate: date.toISOString().split("T")[0],
          });
        }

        setAvailability(availabilityData);

        // Process hospital schedules
        const hospitalsWithSlots = hospitalsData.map((hospital) => {
          const hospitalSchedules = scheduleData.filter(
            (s) => s.hospitalId === hospital.id
          );
          const slots = {};

          hospitalSchedules.forEach((schedule) => {
            schedule.days.forEach((dayNumber) => {
              const dayName = daysMap[dayNumber];
              if (!slots[dayName]) {
                slots[dayName] = [];
              }

              const timeSlots = generateTimeSlots(
                schedule.startTime,
                schedule.endTime,
                doctorRes.data.avgTimePerPatient
              );

              slots[dayName] = timeSlots.map((time) => ({
                display: formatTimeForDisplay(time),
                apiFormat: time,
              }));
            });
          });

          return {
            ...hospital,
            slots,
          };
        });

        setHospitals(hospitalsWithSlots);

        // Set initial selections
        if (hospitalsWithSlots.length > 0) {
          const firstHospital = hospitalsWithSlots[0];
          const firstAvailableDay = availabilityData.find(
            (day) => firstHospital.slots[day.day]
          );

          if (firstAvailableDay) {
            handleHospitalSelect(firstHospital);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load doctor information");
        navigate("/doctors");
      } finally {
        setIsLoading({
          doctor: false,
          hospitals: false,
          schedule: false,
          booking: false,
        });
      }
    };

    fetchData();
  }, [doctorId, navigate]);

  if (isLoading.doctor) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-black">
        <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p>Loading doctor information...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Doctor Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please select a valid doctor to book an appointment.
        </p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-black">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Appointment Booked!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your appointment with {doctor.fullName} is confirmed
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-left max-w-md mx-auto border border-blue-100 dark:border-blue-800">
            <div className="flex items-start mb-3">
              <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  Date & Time
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedDay}, {selectedSlot}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-lg mr-3">
                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  Location
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedHospital.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedHospital.address}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="flex-1 max-w-xs bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white dark:bg-black">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:text-blue-800 dark:hover:text-blue-300 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Doctors
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Doctor Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-100 dark:border-gray-800 flex-shrink-0">
              <img
                src={
                  doctor.imageUrl ||
                  "https://i.pinimg.com/736x/8c/f3/f4/8cf3f4563713bbd6481f11a43cc24643.jpg"
                }
                alt={doctor.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://i.pinimg.com/736x/8c/f3/f4/8cf3f4563713bbd6481f11a43cc24643.jpg";
                }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {doctor.fullName}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {doctor.degree}
              </p>

              <div className="flex flex-wrap items-center mt-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  <User className="w-4 h-4 text-blue-400 mr-1" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-blue-400 mr-1" />
                  <span>{doctor.category?.name || "General Physician"}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Consultation Fee
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Standard appointment
                    </p>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    $50
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            About Dr. {doctor.fullName.split(" ")[1]}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {doctor.description || "No description available"}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Specialty
              </p>
              <p className="font-medium dark:text-white">
                {doctor.category?.name || "General Physician"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Contact
              </p>
              <p className="font-medium dark:text-white">
                {doctor.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Book an Appointment
          </h2>

          {isLoading.hospitals || isLoading.schedule ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-500 mr-2" />
              <span>Loading availability information...</span>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hospitals available for this doctor</p>
            </div>
          ) : (
            <>
              {/* Hospital Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Hospital
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hospitals.map((hospital) => (
                    <button
                      key={hospital.id}
                      onClick={() => handleHospitalSelect(hospital)}
                      className={`p-4 rounded-lg border text-left transition ${
                        selectedHospital?.id === hospital.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                      }`}
                    >
                      <div className="flex items-start">
                        <Building className="w-5 h-5 mt-0.5 mr-3 text-blue-500 dark:text-blue-400" />
                        <div>
                          <p className="font-medium dark:text-white">
                            {hospital.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {hospital.address}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedHospital && (
                <>
                  {/* Date Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Date
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {availability
                        .filter(({ day }) => selectedHospital.slots?.[day])
                        .map(({ day, date, isoDate }) => (
                          <button
                            key={`${day}-${date}`}
                            onClick={() => handleDaySelect(day, date, isoDate)}
                            className={`flex flex-col items-center min-w-[90px] py-3 px-2 rounded-lg border transition ${
                              selectedDay?.includes(day)
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                            }`}
                          >
                            <span className="font-medium dark:text-white">
                              {day}
                            </span>
                            <span className="text-sm dark:text-gray-300">
                              {date}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {selectedDay && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Available Time Slots
                      </h3>
                      {isLoading.schedule ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                          <span>Loading time slots...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {getAvailableSlotsForDay().map((slot) => (
                            <button
                              key={slot.display}
                              onClick={() =>
                                !slot.isBooked && setSelectedSlot(slot.display)
                              }
                              disabled={slot.isBooked}
                              className={`py-3 px-4 rounded-lg border text-center transition ${
                                selectedSlot === slot.display
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                  : slot.isBooked
                                  ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              }`}
                            >
                              <span
                                className={slot.isBooked ? "line-through" : ""}
                              >
                                {slot.display}
                              </span>
                              {slot.isBooked && (
                                <span className="text-xs block text-red-500 dark:text-red-400">
                                  Booked
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 flex items-start border border-gray-200 dark:border-gray-700">
                <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your appointment details will be confirmed by the doctor's
                  office. You'll receive a confirmation email with all the
                  details.
                </p>
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={
                  !selectedSlot || !selectedHospital || isLoading.booking
                }
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition flex items-center justify-center ${
                  selectedSlot && selectedHospital
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                }`}
              >
                {isLoading.booking ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin text-white mr-2" />
                    Processing...
                  </>
                ) : selectedSlot ? (
                  <>
                    Confirm Appointment at {selectedHospital.name}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  "Complete your booking details"
                )}
              </button>
              {/* <div className="bg-red-600 w-full h-5"> add and see doct</div> */}
              <ReviewListComponent
                reviews={reviews.map((review) => ({
                  id: review.id,
                  patientName: review.userFullName,
                  patientImage: "https://randomuser.me/api/portraits/men/1.jpg", // Default image or from API if available
                  rating: review.rating,
                  date: new Date(review.createdAt).toLocaleDateString(),
                  comment: review.comment,
                  replies: [
                    ...(review.doctorReply
                      ? [
                          {
                            id: `doctor-${review.id}`,
                            doctorId: doctorId,
                            doctorName: review.doctorName,
                            doctorImage:
                              doctor?.imageUrl ||
                              "https://randomuser.me/api/portraits/men/10.jpg",
                            date: new Date().toLocaleDateString(), // You might want to add createdAt for replies
                            text: review.doctorReply,
                          },
                        ]
                      : []),
                    ...(review.hospitalReply
                      ? [
                          {
                            id: `hospital-${review.id}`,
                            adminId: "admin-id", // You might need to get this from the API
                            adminName: review.hospitalName,
                            adminImage:
                              "https://randomuser.me/api/portraits/women/10.jpg",
                            date: new Date().toLocaleDateString(), // You might want to add createdAt for replies
                            text: review.hospitalReply,
                          },
                        ]
                      : []),
                  ],
                }))}
                onReplySubmit={handleReplySubmit}
                onReplyUpdate={handleReplyUpdate}
                onReplyDelete={handleReplyDelete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Appointment;
