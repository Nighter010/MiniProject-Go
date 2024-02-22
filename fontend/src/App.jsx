import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar"; // Import the Navbar component

import Login from "./Components/Login";
import User from "./Components/User";
import Student from "./Components/Student";
import Subject from "./Components/Subject";
import Teacher from "./Components/Teacher";

import Register from "./Components/Register";


function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Handle login logic here...
    // After successful login, navigate to home page and reload
    navigate('/User', { replace: true });
    window.location.reload();
  };

  return (
    <>
      <Navbar /> {/* Render the Navbar component */}
      <Routes>

      <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/User" element={<User />} />
        <Route path="/student" element={<Student />} />
        <Route path="/subject" element={<Subject />} />
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
      
    </>
  );
}

export default App;