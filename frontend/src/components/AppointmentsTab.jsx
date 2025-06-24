import React, { useState, useEffect, useCallback } from "react";
import { Calendar, ClipboardList, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";
import ReviewModal from "./ReviewModal";

// Setup moment localizer
moment.locale("en");
const localizer = momentLocalizer(moment);

const AppointmentsCalendar = ({ isDoctor, navigate = () => {}, id }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Status mapping
  const statusMap = {
    0: { name: "Booked", color: "#3b82f6" },
    1: { name: "Completed", color: "#10b981" },
    2: { name: "Cancelled", color: "#ef4444" },
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = isDoctor
          ? `/appointment/doctor/${id}`
          : `/appointment/patient/${id}`;

        const response = await apiReq.get(endpoint);

        // Transform appointments for calendar
        const formattedAppointments = response.data.map((appointment) => ({
          id: appointment.id,
          title: isDoctor
            ? `Patient: ${appointment.applicationUserName}`
            : `Dr. ${appointment.doctorName}`,
          start: new Date(`${appointment.date}T${appointment.timeSlot}`),
          end: moment(`${appointment.date}T${appointment.timeSlot}`)
            .add(30, "minutes") // Assuming 30 min appointments
            .toDate(),
          status: appointment.status,
          hospital: appointment.hospital?.name || "N/A",
          type: appointment.type || "Consultation",
          allDay: false,
          resource: appointment,
        }));

        setAppointments(formattedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointments();
    }
  }, [id, isDoctor]);

  // Event component customization
  const EventComponent = ({ event }) => {
    return (
      <div className="p-1">
        <div className="text-sm font-medium truncate">{event.title}</div>
        <div className="text-xs">
          {moment(event.start).format("h:mm A")} -{" "}
          {moment(event.end).format("h:mm A")}
        </div>
        <div className="flex items-center mt-1">
          <span
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: statusMap[event.status]?.color }}
          ></span>
          <span className="text-xs">{statusMap[event.status]?.name}</span>
        </div>
      </div>
    );
  };

  // Toolbar customization
  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => onNavigate("TODAY")}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate("NEXT")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowRight size={18} />
          </button>
          <span className="text-lg font-medium ml-2">{label}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(Views.MONTH)}
            className={`px-3 py-1 text-sm rounded-md ${
              view === Views.MONTH
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onView(Views.WEEK)}
            className={`px-3 py-1 text-sm rounded-md ${
              view === Views.WEEK
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onView(Views.DAY)}
            className={`px-3 py-1 text-sm rounded-md ${
              view === Views.DAY
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onView(Views.AGENDA)}
            className={`px-3 py-1 text-sm rounded-md ${
              view === Views.AGENDA
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  // Handle appointment selection
  const handleSelectEvent = useCallback((event) => {
    setSelectedAppointment(event.resource);
  }, []);

  // Handle add review
  const handleAddReview = (newReview) => {
    // In a real app, you would call your API here
    const review = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: "Current User",
      patientImage: "user-avatar.jpg",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString(),
      replies: [],
    };
    // Update the appointment in state
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment.id ? { ...app, hasReview: true } : app
      )
    );
    setIsModalOpen(false);
    toast.success("Review submitted successfully!");
  };

  // Appointment details modal
  const AppointmentDetailsModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <button
            onClick={() => setSelectedAppointment(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Appointment Details
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date & Time
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {new Date(selectedAppointment.date).toLocaleDateString()} at{" "}
                {selectedAppointment.timeSlot}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {isDoctor ? "Patient" : "Doctor"}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {isDoctor
                  ? selectedAppointment.applicationUserName
                  : `Dr. ${selectedAppointment.doctorName}`}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Hospital
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {selectedAppointment.hospital?.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  statusMap[selectedAppointment.status]?.color ||
                  "bg-gray-200 text-gray-800"
                }`}
              >
                {statusMap[selectedAppointment.status]?.name || "Unknown"}
              </span>
            </div>

            {selectedAppointment.type && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Type
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedAppointment.type}
                </p>
              </div>
            )}

            <div className="pt-4 flex space-x-3">
              {isDoctor ? (
                selectedAppointment.status === 0 && (
                  <button
                    onClick={() => {
                      // Implement complete functionality
                      toast.success("Appointment marked as completed");
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Mark Complete
                  </button>
                )
              ) : (
                <>
                  {selectedAppointment.status === 0 && (
                    <button
                      onClick={() => {
                        // Implement cancel functionality
                        toast.success("Appointment cancelled");
                        setSelectedAppointment(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  )}
                  {selectedAppointment.status === 1 &&
                    !selectedAppointment.hasReview && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Add Review
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-red-700 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isDoctor ? "Appointment Schedule" : "My Appointments"}
        </h2>
        {!isDoctor && (
          <button
            onClick={() => navigate("/hospitals")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Calendar className="mr-2" size={16} /> Book New
          </button>
        )}
      </div>

      <div className="flex-grow">
        <BigCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "70vh" }}
          components={{
            event: EventComponent,
            toolbar: CustomToolbar,
          }}
          onSelectEvent={handleSelectEvent}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: statusMap[event.status]?.color || "#e5e7eb",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
            },
          })}
        />
      </div>

      {selectedAppointment && <AppointmentDetailsModal />}
      <ReviewModal
        isOpen={isModalOpen}
        id={selectedAppointment?.id}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReview}
      />
    </div>
  );
};

export default AppointmentsCalendar;
