import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(5);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedAge, setEditedAge] = useState("");
  const [editedSalary, setEditedSalary] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    salary: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deletingTeacherId, setDeletingTeacherId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:5000/teachers");
      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle editing a teacher
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setEditedFirstName(teacher.FirstName);
    setEditedLastName(teacher.LastName);
    setEditedAge(teacher.Age);
    setEditedSalary(teacher.Salary);
    setEditModalIsOpen(true); // Open edit modal
  };

  // Function to handle saving the edited teacher
  const handleSaveEdit = async () => {
    if (editingTeacher) {
      const updatedAge = parseInt(editedAge);
      // แปลงค่า Salary เป็นตัวเลขทศนิยม
      const updatedSalary = parseFloat(editedSalary);
      const updatedTeacher = {
        ...editingTeacher,
        FirstName: editedFirstName,
        LastName: editedLastName,
        Age: updatedAge, // ใช้ค่าที่แปลงแล้ว
        Salary: updatedSalary,
      };

      try {
        const response = await fetch(
          `http://localhost:5000/teachers/${updatedTeacher.ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTeacher),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update teacher");
        }

        const updatedTeacherData = await response.json();
        const updatedTeachers = teachers.map((teacher) =>
          teacher.ID === updatedTeacherData.ID ? updatedTeacherData : teacher
        );
        setTeachers(updatedTeachers);
        setEditingTeacher(null);
        setEditedFirstName("");
        setEditedLastName("");
        setEditedAge("");
        setEditedSalary("");
        setEditModalIsOpen(false); // Close edit modal
        toast.success("Successfully updated teacher");
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to handle deleting a teacher
  const handleDelete = async () => {
    try {
      const response = await fetch(
       
        `http://localhost:5000/teachers/${deletingTeacherId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }
      const updatedTeachers = teachers.filter(
        (teacher) => teacher.ID !== deletingTeacherId
      );
      setTeachers(updatedTeachers);
      setDeleteModalIsOpen(false); // Close delete modal
      toast.success("Successfully deleted teacher");
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle changes in the input fields for adding a new teacher
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacherData({ ...newTeacherData, [name]: value });
  };

  // Function to handle submitting the form for adding a new teacher
  const handleSubmit = async (e) => {
    e.preventDefault();

    // แปลงค่า age เป็นตัวเลขจำนวนเต็ม
    const newAge = parseInt(newTeacherData.age);
    // แปลงค่า salary เป็นตัวเลขทศนิยม
    const newSalary = parseFloat(newTeacherData.salary);

    try {
      const response = await fetch("http://localhost:5000/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ใช้ค่าที่แปลงแล้ว
          firstName: newTeacherData.firstName,
          lastName: newTeacherData.lastName,
          age: newAge,
          salary: newSalary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add teacher");
      }

      const teacherData = await response.json();
      setTeachers([...teachers, teacherData]);
      setNewTeacherData({ firstName: "", lastName: "", age: "", salary: "" });
      setModalIsOpen(false); // Close add modal
      toast.success("Successfully added new teacher");
    } catch (error) {
      console.error(error);
    }
  };

  // Function to open the add teacher modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Function to close the add teacher modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Teacher List
      </h1>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg w-4/5 mx-auto">
        <br />
        <div className="flex justify-evenly">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={openModal}
          >
            Add Teacher
          </button>
        </div>
        <br />
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTeachers.map((teacher) => (
              <tr key={teacher.ID} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.FirstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.LastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.Age}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.Salary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setDeletingTeacherId(teacher.ID);
                      setDeleteModalIsOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Teacher"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter first name"
              value={newTeacherData.firstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter last name"
              value={newTeacherData.lastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="age" className="text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter age"
              value={newTeacherData.age}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="salary"
              className="text-sm font-medium text-gray-700"
            >
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              placeholder="Enter salary"
              value={newTeacherData.salary}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
        contentLabel="Edit Teacher"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Teacher</h2>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="edit-firstName"
              name="edit-firstName"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="edit-lastName"
              name="edit-lastName"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-age"
              className="text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="edit-age"
              name="edit-age"
              value={editedAge}
              onChange={(e) => setEditedAge(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-salary"
              className="text-sm font-medium text-gray-700"
            >
              Salary
            </label>
            <input
              type="number"
              id="edit-salary"
              name="edit-salary"
              value={editedSalary}
              onChange={(e) => setEditedSalary(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setEditModalIsOpen(false);
              setEditedFirstName("");
              setEditedLastName("");
              setEditedAge("");
              setEditedSalary("");
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        contentLabel="Confirm Delete Teacher"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Confirm Delete Teacher</h2>
        <p>Are you sure you want to delete this teacher?</p>
        <div className="flex justify-center mt-4">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleDelete}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setDeleteModalIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <div className="mt-4">
        <ul className="flex justify-center">
          {Array.from({
            length: Math.ceil(teachers.length / teachersPerPage),
          }).map((_, index) => (
            <li key={index}>
              <button
                className="bg-blue-500 hover:bg-blue-800 text-gray-800 font-semibold py-2 px-4 mx-1 rounded"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Teachers;