import React from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
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
              href="/Login"
              className="text-sm text-white dark:text-gray-200 hover:underline"
            >
              Login
            </a>
            <a
              href="/Register"
              className="text-sm text-white dark:text-gray-200 hover:underline"
            >
              Register
            </a>
          </div>
        </div>
      </nav>
      
    </div>
  );
};

export default Navbar;
