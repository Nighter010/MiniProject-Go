import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "animate.css";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [currentPAge, setCurrentPAge] = useState(1);
  const [studentsPerPAge] = useState(5);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedAge, setEditedAge] = useState("");
  const [editedGrade, setEditedGrade] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    FirstName: "",
    LastName: "",
    Age: "",
    Grade: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastStudent = currentPAge * studentsPerPAge;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPAge;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pAgeNumber) => setCurrentPAge(pAgeNumber);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditedFirstName(student.FirstName);
    setEditedLastName(student.LastName);
    setEditedAge(student.Age);
    setEditedGrade(student.Grade);
    setEditModalIsOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingStudent) {
      const updatedStudent = {
        ...editingStudent,
        FirstName: editedFirstName,
        LastName: editedLastName,
        Age: parseInt(editedAge), // แปลงอายุเป็นชนิดข้อมูลจำนวนเต็ม
        Grade: editedGrade,
      };

      try {
        const response = await fetch(
          `http://localhost:5000/students/${updatedStudent.ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedStudent),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update student");
        }

        const updatedStudentData = await response.json();
        const updatedStudents = students.map((student) =>
          student.ID === updatedStudentData.ID ? updatedStudentData : student
        );
        setStudents(updatedStudents);
        setEditingStudent(null);
        setEditedFirstName("");
        setEditedLastName("");
        setEditedAge(""); // เคลียร์ค่าอายุหลังจากแก้ไขเสร็จสิ้น
        setEditedGrade("");
        setEditModalIsOpen(false);
        toast.success("Student data updated successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/students/${deletingStudentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      const updatedStudents = students.filter(
        (student) => student.ID !== deletingStudentId
      );
      setStudents(updatedStudents);
      setDeleteModalIsOpen(false);
      toast.success("Student data deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setNewStudentData({ ...newStudentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: newStudentData.FirstName,
          LastName: newStudentData.LastName,
          Age: parseInt(newStudentData.Age), // แปลงอายุเป็นชนิดข้อมูลจำนวนเต็ม
          Grade: newStudentData.Grade,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      const studentData = await response.json();
      setStudents([...students, studentData]);
      setNewStudentData({ FirstName: "", LastName: "", Age: "", Grade: "" });
      setModalIsOpen(false);
      toast.success("Student data added successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Student List
      </h1>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg w-4/5 mx-auto">
        <br />
        <div className="flex justify-evenly">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={openModal}
          >
            Add Student
          </button>
        </div><br />
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
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.map((student) => (
              <tr key={student.ID} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.FirstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.LastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.Age}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.Grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setDeletingStudentId(student.ID);
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
        contentLabel="Add Student"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="FirstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              placeholder="Enter first name"
              value={newStudentData.FirstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="LastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              placeholder="Enter last name"
              value={newStudentData.LastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="Age" className="text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="Age"
              name="Age"
              placeholder="Enter Age"
              value={newStudentData.Age}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="Grade"
              className="text-sm font-medium text-gray-700"
            >
              Grade
            </label>
            <input
              type="text"
              id="Grade"
              name="Grade"
              placeholder="Enter Grade"
              value={newStudentData.Grade}
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
        contentLabel="Edit Student"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Student</h2>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-FirstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="edit-FirstName"
              name="edit-FirstName"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-LastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="edit-LastName"
              name="edit-LastName"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-Age"
              className="text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="edit-Age"
              name="edit-Age"
              value={editedAge}
              onChange={(e) => setEditedAge(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-Grade"
              className="text-sm font-medium text-gray-700"
            >
              Grade
            </label>
            <input
              type="text"
              id="edit-Grade"
              name="edit-Grade"
              value={editedGrade}
              onChange={(e) => setEditedGrade(e.target.value)}
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
              setEditedGrade("");
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this student?</p>
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
            length: Math.ceil(students.length / studentsPerPAge),
          }).map((_, index) => (
            <li key={index}>
              <button
                className="bg-blue-100 hover:bg-blue-300 text-gray-800 font-semibold py-2 px-4 mx-1 rounded"
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

export default Student;