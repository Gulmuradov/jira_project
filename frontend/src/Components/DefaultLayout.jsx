import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../ApiConnection/axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import Navbar from "../views/Navbar/Navbar";
import Sidebar from "../views/Sidebar/Sidebar";
import TodaysChallenges from "../views/TodayChallenges/TodayChallenges";

export default function DefaultLayout() {
  const { token } = useStateContext();
  const [today, setToday] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEmailVerified, setIsEmailVerified] = useState(null);


  useEffect(() => {
    const fetchEmailVerificationStatus = async () => {
      try {
        const response = await axiosClient.get("/user/email-verified", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsEmailVerified(response.data);
      } catch (error) {
        console.error("Error fetching email verification status:", error);
        setIsEmailVerified(false); // Set as false by default if error occurs
      }
    };

    if (token) {
      fetchEmailVerificationStatus();
    }
  }, [token]);

  // Get today's date
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    setToday(formattedDate);
  }, []);

  // Fetch all tasks
  useEffect(() => {
    if (!token) return;

    axiosClient
      .get("tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        // console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  }, [token]);

  // Fetch tasks function
  const fetchTasks = () => {
    axiosClient
      .get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        // console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isEmailVerified === null) {
    return <p>Loading...</p>;
  } else if (!isEmailVerified) {
    return (
      <div>
        <p>Your email is not verified. Please verify your email.</p>
        {/* You can render a button or link to trigger the email verification process */}
      </div>
    );
  }

  return (
    <div className="layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <TodaysChallenges />
      </div>
    </div>
  );
}
