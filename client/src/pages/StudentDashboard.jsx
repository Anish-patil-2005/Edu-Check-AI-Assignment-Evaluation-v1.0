import React, { useState, useEffect } from "react";
import SubmitAssignmentModal from "../components/Student/SubmitAssignmentModal";
import { listAssignmentsForStudentsAPI, listStudentSubmissionsById,downloadAssignmentFile } from "../services/api";
import { toast } from "react-hot-toast"; // For user-friendly error messages


const StudentAssignments = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async (assignmentId, filename) => {
    try {
      toast.loading("Downloading file...");
      
      // 1. Call the service to get the file data (blob)
      const blob = await downloadAssignmentFile(assignmentId);

      // 2. The component handles the browser-specific part: triggering the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Download started!");

    } catch (error) {
      toast.dismiss();
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allAssignments, allSubmissions] = await Promise.all([
          listAssignmentsForStudentsAPI(),
          listStudentSubmissionsById(studentId),
        ]);

        setAssignments(allAssignments || []);
        setSubmissions((allSubmissions || []).filter(s => s.status === "accepted"));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [studentId]);

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSubmissionSuccess = (assignmentId, newSubmission) => {
    setSubmissions([...submissions, newSubmission]);
    setIsModalOpen(false);
    alert("Assignment submitted successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Assignments</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">S.No</th>
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Teacher</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Deadline</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Sample File</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => {
                const accepted = submissions.some(s => {
                  const subId = s.assignmentId?._id || s.assignmentId;
                  return subId === assignment._id;
                });

                return (
                  <tr key={assignment._id} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm">{`A${index + 1}`}</td>
                    <td className="px-4 py-3 text-sm">{assignment._id }</td>
                    <td className="px-4 py-3 text-sm font-medium">{assignment.teacherId?.name || "Unknown"}</td>
                    <td className="px-4 py-3 text-sm">{assignment.title}</td>
                    <td className="px-4 py-3 text-sm">{assignment.description}</td>
                    <td className="px-4 py-3 text-sm">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      {assignment.sampleFilePath  ? (
                        <button
                        onClick={() => handleDownload(assignment._id, assignment.sampleFileOriginalName)}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                      >
                        View / Download
                      </button>
                    ) : (
                        <span className="text-gray-400 italic">No file</span>
                    )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        disabled={accepted}
                        onClick={() => handleSubmitClick(assignment)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                          accepted
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {accepted ? (
                          <>
                            <span>Submitted</span>
                            <span>✅</span>
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan={7}>
                  No assignments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedAssignment && (
        <SubmitAssignmentModal
          assignment={selectedAssignment}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  );
};

export default StudentAssignments;
