import React, { use, useEffect } from "react";
// Packages
import { Outlet } from "react-router-dom";
// Components
import Sidebar from "./sidebar";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { getUserById } from "../features/authSlice";

// features

const Layout = () => {
  const dispatch = useDispatch();

  const getUser = async () => {
    const response = await dispatch(getUserById());
    console.log('====================================');
    console.log(response);
    console.log('====================================');
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-full ml-16 md:ml-56">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
