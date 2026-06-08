import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
/* .layout-container {
  @apply min-h-screen lg:max-h-screen lg:flex bg-white dark:bg-slate-950 transition-colors duration-200;
}*/
const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="flex-1 overflow-y-scroll">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
