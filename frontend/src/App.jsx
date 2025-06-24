import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import HomePage from "./pages/homePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import SignUp from "./pages/signup";
import { Mail, Phone } from "lucide-react";
import AllDoctors from "./pages/AllDoctors";
import Appointment from "./pages/Appointment";
import AllHospital from "./pages/AllHospital";
import Profile from "./pages/Profile";
import SuperAdminDashBoard from "./pages/SuperAdminDashBoard";
import AdminDashBoard from "./pages/AdminDashBoard";
import { useAuth } from "@/context/AuthContext.jsx";
import EmailConfirm from "./pages/EmailConfirm";
import GuestRoute from "./routes/GutesRoute";
import { useEffect } from "react";

const App = () => {
  const { user } = useAuth();
  const userRole = user?.role;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content container with padding to account for navbar */}
      <main className={`flex-1 w-full pt-16`}>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUp />
              </GuestRoute>
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<AllDoctors />} />
          <Route
            path="/book-appointment/:id?"
            element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            }
          />
          <Route path="/hospitals" element={<AllHospital />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/hospitals"
            element={
              <ProtectedRoute requiredRole="SuperAdmin">
                <SuperAdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/admin"
            element={
              <ProtectedRoute requiredRole="HospitalAdmin">
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/confirm-email" element={<EmailConfirm />} />
          <Route
            path="*"
            element={
              <div className="text-2xl flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] font-bold">
                Page Not Found
                <div className="mt-4">
                  <a href="/" className="text-blue-500 text-sm hover:underline">
                    Go to Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer Section */}
      <footer className=" border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                AMS
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                COMPANY
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Privacy policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                GET IN TOUCH
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    +1-212-456-7890
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    abcd@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
            <p>
              Copyright © {new Date().getFullYear()} abc - All Right Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
