'use client';
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Menu, X, User, LogIn, LogOut } from "lucide-react";
import {useAuth} from "@/context/AuthContext.jsx";
import img from '@/assets/noavatar.jpeg'

const navItems = [
  { name: "Home", href: "/" },
  { name: "Doctors", href: "/doctors" },
  { name: "Hospitals", href: "/hospitals" },
];

export default function Navbar() {
  const {user,logout} = useAuth();
  const userRole = user?.role;
  const navigate=useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  // Mock authentication functions
  const handleLogout = () =>{
    logout();
  }
  const handleLogout2 = () => {
    setMenuOpen(false)
    logout();
    navigate("/");
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 backdrop-blur-md bg-white/80 dark:bg-black/50 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-foreground">
          <Link to="/" className="flex items-center gap-2">
            AMS
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center justify-center">
          {navItems.map(({ name, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={name}
                to={href}
                className={`text-sm transition-all relative group tracking-wide
                  ${
                    active
                      ? "text-blue-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span>{name}</span>
                <motion.span
                  layoutId={active ? "nav-underline" : undefined}
                  className={`absolute left-0 -bottom-1 h-[2px] w-full  scale-x-100 transition-transform origin-left`}
                />
              </Link>
            );
          })}
          {(() => {
            const active = isActive("/super-admin/hospitals");
            return (
              userRole == "SuperAdmin" && (
                <a
                  href="/super-admin/hospitals"
                  className={`text-sm transition-all relative group tracking-wide
                  ${
                    active
                      ? "text-blue-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Dashboard</span>
                  <motion.span
                    layoutId={active ? "nav-underline" : undefined}
                    className={`absolute left-0 -bottom-1 h-[2px] w-full  scale-x-100 transition-transform origin-left`}
                  />
                </a>
              )
            );
          })()}
          {(() => {
            const active = isActive("/hospital/admin");
            return (
              userRole == "HospitalAdmin" && (
                <a
                  href="/hospital/admin"
                  className={`text-sm transition-all relative group tracking-wide
                  ${
                    active
                      ? "text-blue-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Dashboard</span>
                  <motion.span
                    layoutId={active ? "nav-underline" : undefined}
                    className={`absolute left-0 -bottom-1 h-[2px] w-full  scale-x-100 transition-transform origin-left`}
                  />
                </a>
              )
            );
          })()}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* User Profile or Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-4">
              <a
                href="/profile"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center overflow-hidden justify-center">
                  <img src={user.imageUrl || img} alt={user.name} />
                </div>
                <span>{user.name}</span>
              </a>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("signup")}
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-background/30 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="absolute top-full mt-3 right-4 w-[calc(100%-2rem)] bg-background rounded-xl p-4 shadow-xl flex flex-col gap-4 md:hidden z-40"
            >
              {navItems.map(({ name, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={name}
                    to={href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all 
                      ${
                        active
                          ? "bg-blue-500/10 text-blue-500"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                  >
                    {name}
                  </Link>
                );
              })}
              {userRole === "SuperAdmin" && (
                <a
                  href="/super-admin/hospitals"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all 
                    ${
                      isActive("/super-admin/hospitals")
                        ? "bg-blue-500/10 text-blue-500"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                >
                  Dashboard
                </a>
              )}
              {userRole === "HospitalAdmin" && (
                <a
                  href="/hospital/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all 
                    ${
                      isActive("/hospital/admin")
                        ? "bg-blue-500/10 text-blue-500"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                >
                  Dashboard
                </a>
              )}
              {/* Mobile Auth Buttons */}
              {user ? (
                <>
                  <a
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                  <button
                    onClick={handleLogout2}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-red-500 hover:bg-red-500/10 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-blue-500 hover:bg-blue-500/10"
                  >
                    <LogIn className="h-4 w-4" />
                    <Link to={"/login"}>Login</Link>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Link to={"/signup"}>Sign Up</Link>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}