import React from 'react'
import { Link } from "react-router-dom";

function NavHide() {
  return (
    <div><nav className="bg-opacity-50 bg-gray-50 dark:bg-gray-700">
    <div className="max-w-screen-xl px-4 py-3 mx-auto">
      <div className="flex items-center">
        <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
         
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
          <li>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
      
      </div>
      </li>
        </ul>
      </div>
    </div>
  </nav></div>
  )
}

export default NavHide