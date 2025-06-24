import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Tags,
  Calendar,
  Clock,
  CalendarCheck,
} from "lucide-react";
import CategoryManagement from "./CategoryManagement";
import DoctorManagement from "./DoctorManagement.jsx";
import DoctorSchedule from "./DoctorSchedule.jsx";
import AppointmentStats from "./AppointmentStats.jsx";
import StatsCards from "./StatsCards.jsx";
import { useAuth } from "@/context/AuthContext";
import apiReq from "@/lib/apiReq";

const AdminDashboard = () => {
  const { user } = useAuth();
  // console.log(user);
  const [activeTab, setActiveTab] = useState("doctors");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalCategories: 0,
    todayAppointments: 0,
    pendingApprovals: 0,
  });
  
  const getTotalDoctors = async () => {
    try {
      const res = await apiReq.get(`/doctor/hospital/${user.hospitalId}`);
      console.log(res.data)
      setStats((prevStats) => ({
        ...prevStats,
        totalDoctors: res.data.length, // Fixed: removed parentheses from length
      }));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const getTotalCategories = async () =>{
    try {
      const res = await apiReq.get(`/category/hospital/${user.hospitalId}`);
      setStats((prevStats) => ({
        ...prevStats,
        totalCategories: res.data.length,
      }));
    } catch (error) {
      console.error("failed to fetch category", error);
    }
  }
  useEffect(() => {
    if (user) {
      getTotalDoctors();
      getTotalCategories();
      // Add other data fetching functions here
    }
  }, [user , user.hospitalId]);

  const tabs = [
    {
      id: "doctors",
      label: "Doctors",
      icon: <Stethoscope className="md:mr-2 h-4 w-4" />,
    },
    {
      id: "categories",
      label: "Categories",
      icon: <Tags className="md:mr-2 h-4 w-4" />,
    },
    {
      id: "schedules",
      label: "Schedules",
      icon: <Calendar className="md:mr-2 h-4 w-4" />,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: <CalendarCheck className="md:mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-200">
      <header className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Hospital Administration
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
          Manage your hospital resources and appointments
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatsCards
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={
            <Stethoscope className="text-blue-600 dark:text-blue-400 h-4 md:h-5 w-4 md:w-5" />
          }
          trend="up"
        />
        <StatsCards
          title="Categories"
          value={stats.totalCategories}
          icon={
            <Tags className="text-blue-600 dark:text-blue-400 h-4 md:h-5 w-4 md:w-5" />
          }
        />
        <StatsCards
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={
            <Calendar className="text-blue-600 dark:text-blue-400 h-4 md:h-5 w-4 md:w-5" />
          }
        />
        <StatsCards
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={
            <Clock className="text-blue-600 dark:text-blue-400 h-4 md:h-5 w-4 md:w-5" />
          }
          trend="down"
        />
      </div>

      {/* Navigation Tabs - Scrollable on mobile */}
      <div className="relative mb-6">
        <div className="flex overflow-x-auto scrollbar-hide pb-1 md:pb-0">
          <div className="flex border-b border-gray-200 dark:border-gray-700 min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start py-2 md:py-3 px-2 md:px-4 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon}
                <span className="ml-1 md:ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-6 transition-colors duration-200">
        {activeTab === "doctors" && <DoctorManagement />}
        {activeTab === "categories" && <CategoryManagement />}
        {activeTab === "schedules" && <DoctorSchedule />}
        {activeTab === "appointments" && <AppointmentStats />}
      </div>
    </div>
  );
};

export default AdminDashboard;
