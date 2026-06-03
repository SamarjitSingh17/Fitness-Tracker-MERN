import {
  ActivityIcon,
  HomeIcon,
  MoonIcon,
  PersonStanding,
  SunIcon,
  UserIcon,
  UtensilsIcon,
} from "lucide-react";
import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/food", label: "Food", icon: UtensilsIcon },
    { path: "/activity", label: "Activity", icon: ActivityIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ];
  const { theme, themeToggle } = useContext(ThemeContext);

  return (
    <>
      <nav className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900/10 border-r  border-slate-100 dark:border-slate-800 gap-2 p-6 transition-colors duration-200">
        {/* logo */}
        <div className="flex gap-3 items-center justify-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <PersonStanding className="w-7 text-white" />
          </div>
          <p className="text-2xl font-semibold text-slate-700 dark:text-white">
            FitTracker
          </p>
        </div>
        {/* navlinks */}
        <div className="flex flex-col gap-2 sm:gap-4">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 px-4 py-2.5  transition-all duration-200 ${isActive ? "bg-emerald-50 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 font-medium border-l-3" : ""}`
              }
              key={item.label}
              to={item.path}
            >
              <item.icon className="w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        {/* theme toggler */}
        <div className="mt-auto pt-6 border-t border-slate-400 dark:border-slate-800">
          <button
            onClick={themeToggle}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {theme === "light" ? (
              <MoonIcon className="w-5" />
            ) : (
              <SunIcon className="w-5" />
            )}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
