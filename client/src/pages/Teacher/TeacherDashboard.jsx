/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import SubmissionProgress from "../../components/Teacher Components/ProgressTotalSubmission";
import UploadForm from "../../components/Teacher Components/UploadForm";
import { getTotalAssignments, getTotalSubmissions } from "../../services/api";

const TeacherDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  // Open/Close form
  const createAssignmentHandler = () => setIsFormOpen(true);
  const closeFormHandler = () => setIsFormOpen(false);

  // Fetch totals on mount
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const assignmentsCount = await getTotalAssignments();
        const submissionsCount = await getTotalSubmissions();

        setTotalAssignments(assignmentsCount);
        setTotalSubmissions(submissionsCount);
      } catch (err) {
        console.error("Error fetching dashboard totals:", err);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
        <button
          onClick={createAssignmentHandler}
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
        >
          Create Assignment +
        </button>
      </div>

      {/* Progress & Info Cards */}
      <div className="flex justify-around p-10 flex-wrap gap-6">
        
        

        {/* Total Assignments */}
        
        <div className="w-40 h-40 border-2 border-blue-400 flex flex-col items-center justify-center rounded-lg">
          <p className="text-2xl font-bold">{totalSubmissions}</p>
          <h3 className="text-base font-medium text-blue-700">Total Submissions</h3>
        </div>
        <div className="w-40 h-40 border-2 border-blue-400 flex flex-col items-center justify-center rounded-lg">
          <p className="text-2xl font-bold">{totalAssignments}</p>
          <h3 className="text-base font-medium text-blue-700">Total Assignments</h3>
        </div>
      </div>

      

      {/* Popup Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative">
            {/* Close Button */}
            <button
              onClick={closeFormHandler}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
            <UploadForm onClose={closeFormHandler} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
