import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const userEmail = localStorage.getItem("email");

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    console.log("Logout successful");
    // Update login status
    setIsLoggedIn(false);
    // Redirect to login page after logout
    window.location.href = "/login";
    window.location.href = "/Register";
  };

  useEffect(() => {
    // Check login status on component mount
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  return (
    <>
      <div>
        <nav className="bg-blue-500 ">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white glow-dark">
                School
              </span>
            </Link>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <a
                href="/"
                className="text-sm text-white dark:text-gray-200 hover:underline"
              >
                {userEmail}
              </a>
              {isLoggedIn ? (
                <a
                  href="#"
                  className=" text-m text-white hover:underline"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              ) : (
                <>
                <Link
                  to="/login"
                  className="text-m text-white hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/Register"
                  className="text-m text-white hover:underline"
                >
                  Register
                </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <nav className="bg-opacity-50 bg-gray-50 dark:bg-gray-700">
          <div className="max-w-screen-xl px-4 py-3 mx-auto">
            <div className="flex items-center">
              <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                <li>
                  {/* <Link
                    to="/"
                    className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                  >
                    Home
                  </Link> */}
                </li>
                {isLoggedIn && (
                  <>
                    <li>
                      <Link
                        to="/User"
                        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                      >
                        User
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/student"
                        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                      >
                        Student
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/subject"
                        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                      >
                        Subject
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher"
                        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                      >
                        Teacher
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;