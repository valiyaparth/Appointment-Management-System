import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  User,
  Check,
  X,
  Clock,
  ChevronDown,
  Loader,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import apiReq from "@/lib/apiReq";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const AppointmentStats = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState({
    doctors: false,
    appointments: false,
    stats: false,
    export: false,
  });
  const { user } = useAuth();

  // Fetch doctors and initial data on component mount
  useEffect(() => {
    fetchDoctors();
    fetchAppointmentStats();
  }, []);

  // Fetch appointment stats when filters change
  useEffect(() => {
    fetchAppointmentStats();
  }, [selectedDate, selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, doctors: true }));
      const res = await apiReq.get(`/doctor/hospital/${user.hospitalId}`);
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
      setDoctors([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, doctors: false }));
    }
  };

  const fetchAppointmentStats = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, stats: true, appointments: true }));

      let url = `/appointment/hospital/date/?hospitalId=${user.hospitalId}&date=${selectedDate}`;
      if (selectedDoctor !== "all") {
        url = `/appointment/hospital/doctor/?hospitalId=${user.hospitalId}&doctorId=${selectedDoctor}&date=${selectedDate}`;
      }

      const res = await apiReq.get(url);

      // Transform API data to count statuses per doctor/date
      const appointments = res.data || [];
      const groupedData = {};

      appointments.forEach((appt) => {
        const key = selectedDoctor === "all" ? appt.doctorId : appt.date;
        if (!groupedData[key]) {
          groupedData[key] = {
            date: appt.date,
            doctorId: appt.doctorId,
            doctorName: appt.doctorName,
            completed: 0,
            cancelled: 0,
            booked: 0,
          };
        }

        // Count statuses
        if (appt.status === 0) groupedData[key].booked++;
        if (appt.status === 1) groupedData[key].completed++;
        if (appt.status === 2) groupedData[key].cancelled++;
      });

      const transformedData = Object.values(groupedData);
      setAppointmentsData(transformedData);
    } catch (error) {
      console.error("Error fetching appointment stats:", error);
      toast.error("Failed to load appointment statistics");
      setAppointmentsData([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, stats: false, appointments: false }));
    }
  };

  const exportToExcel = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, export: true }));
      const toastId = toast.loading("Preparing Excel export...");

      // Prepare summary data
      const summaryData = chartData.map((item) => ({
        Date: new Date(item.date).toLocaleDateString(),
        Doctor: item.doctorName,
        Completed: item.completed,
        Cancelled: item.cancelled,
        Booked: item.booked,
        Total: item.completed + item.cancelled + item.booked,
      }));

      // Add totals row
      summaryData.push({
        Date: "TOTAL",
        Doctor: "",
        Completed: totalCompleted,
        Cancelled: totalCancelled,
        Booked: totalBooked,
        Total: totalAppointments,
      });

      // Create worksheets
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      // Generate filename
      const doctorName =
        selectedDoctor === "all"
          ? "All Doctors"
          : doctors.find((d) => d.id === selectedDoctor)?.fullName || "Doctor";
      const filename = `Appointments_${selectedDate}_${doctorName.replace(
        / /g,
        "_"
      )}.xlsx`;

      // Export the file
      XLSX.writeFile(wb, filename);
      toast.success("Excel file downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to generate Excel file");
    } finally {
      setIsLoading((prev) => ({ ...prev, export: false }));
    }
  };

  // Prepare data for chart
  const chartData =
    appointmentsData.length > 0
      ? appointmentsData
      : selectedDoctor === "all"
      ? doctors.map((doctor) => ({
          date: selectedDate,
          doctorId: doctor.id,
          doctorName: doctor.fullName,
          completed: 0,
          cancelled: 0,
          booked: 0,
        }))
      : [
          {
            date: selectedDate,
            doctorId: selectedDoctor,
            doctorName:
              doctors.find((d) => d.id === selectedDoctor)?.fullName ||
              "Selected Doctor",
            completed: 0,
            cancelled: 0,
            booked: 0,
          },
        ];

  const totalCompleted = chartData.reduce(
    (sum, item) => sum + item.completed,
    0
  );
  const totalCancelled = chartData.reduce(
    (sum, item) => sum + item.cancelled,
    0
  );
  const totalBooked = chartData.reduce((sum, item) => sum + item.booked, 0);
  const totalAppointments = totalCompleted + totalCancelled + totalBooked;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Appointment Statistics
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            disabled={
              isLoading.export ||
              isLoading.appointments ||
              chartData.length === 0
            }
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            disabled={isLoading.doctors}
          >
            {isFiltersExpanded ? "Hide Filters" : "Show Filters"}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${
                isFiltersExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isFiltersExpanded && (
        <div className="p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                max={new Date().toISOString().split("T")[0]}
                disabled={isLoading.stats}
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User className="mr-2 h-4 w-4" />
                Doctor
              </label>
              {isLoading.doctors ? (
                <div className="flex items-center justify-center h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700">
                  <Loader className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              ) : (
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading.stats}
                >
                  <option value="all">All Doctors</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={
            <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
          }
          title="Completed"
          value={totalCompleted}
          isLoading={isLoading.stats}
          bgColor="bg-green-100 dark:bg-green-900"
        />

        <StatCard
          icon={<X className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />}
          title="Cancelled"
          value={totalCancelled}
          isLoading={isLoading.stats}
          bgColor="bg-yellow-100 dark:bg-yellow-900"
        />

        <StatCard
          icon={<Clock className="h-5 w-5 text-red-600 dark:text-red-300" />}
          title="Booked"
          value={totalBooked}
          isLoading={isLoading.stats}
          bgColor="bg-red-100 dark:bg-red-900"
        />

        <StatCard
          icon={
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          }
          title="Total"
          value={totalAppointments}
          isLoading={isLoading.stats}
          bgColor="bg-blue-100 dark:bg-blue-900"
        />
      </div>

      <div className="p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">
          Appointment Trends
        </h3>
        {isLoading.stats ? (
          <div className="h-80 flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading chart data...</span>
          </div>
        ) : (
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eee"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey={selectedDoctor === "all" ? "doctorName" : "date"}
                  tickFormatter={(value) =>
                    selectedDoctor === "all"
                      ? value
                      : new Date(value).toLocaleDateString()
                  }
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(value) =>
                    selectedDoctor === "all"
                      ? `Doctor: ${value}`
                      : `Date: ${new Date(value).toLocaleDateString()}`
                  }
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="#4ade80"
                  name="Completed"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="cancelled"
                  fill="#facc15"
                  name="Cancelled"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="booked"
                  fill="#f87171"
                  name="Booked"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">
          Appointment Details
        </h3>
        {isLoading.appointments ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">
              Loading appointment details...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  {selectedDoctor === "all" && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Doctor
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cancelled
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Booked
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {chartData.length > 0 ? (
                  chartData.map((item, index) => {
                    const total = item.completed + item.cancelled + item.booked;
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        {selectedDoctor === "all" && (
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.doctorName}
                          </td>
                        )}
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.completed}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.cancelled}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.booked}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {total}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={selectedDoctor === "all" ? 6 : 5}
                      className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300"
                    >
                      {isLoading.stats
                        ? "Loading..."
                        : "No appointments found for the selected criteria"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, isLoading, bgColor }) => (
  <div
    className={`p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
      isLoading ? "animate-pulse" : ""
    }`}
  >
    <div className="flex items-center">
      <div className={`p-2 rounded-full ${bgColor} mr-3`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {isLoading ? (
          <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {value}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default AppointmentStats;