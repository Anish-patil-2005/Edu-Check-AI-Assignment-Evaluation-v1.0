import React, { useEffect, useState } from "react";
import { listAssignments, listStudentsSubmissions } from "../../services/api";

const AssignmentSubmissionsToggle = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [expanded, setExpanded] = useState({}); // track which assignment's table is shown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await listAssignments();
        setAssignments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // Toggle table visibility & fetch submissions if not fetched yet
  const toggleSubmissions = async (assignmentId) => {
    setExpanded(prev => ({ ...prev, [assignmentId]: !prev[assignmentId] }));

    if (!submissions[assignmentId]) {
      try {
        const data = await listStudentsSubmissions(assignmentId);
        setSubmissions(prev => ({ ...prev, [assignmentId]: data }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <p className="p-6">Loading assignments...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments & Submissions</h1>

      {assignments.map((a,index) => (
        <div key={a._id} className="mb-6 border rounded-lg shadow-md bg-white">
          {/* Assignment header with toggle button */}
          <div className="flex justify-between items-center p-4 bg-blue-100 hover:bg-blue-200 cursor-pointer">
            <span className="font-semibold">{`A${index + 1}`} | {a.title}</span>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => toggleSubmissions(a._id)}
            >
              {expanded[a._id] ? "Hide Submissions ▲" : "Show Submissions ▼"}
            </button>
          </div>

          {/* Submissions table */}
          {expanded[a._id] && (
            <div className="overflow-x-auto p-4">
              <table className="w-full border-collapse">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="p-2 text-left">Student Id</th>
                    <th className="p-2 text-left">Student Name</th>
                    <th className="p-2 text-left">Peer Similarity</th>
                    <th className="p-2 text-left">Teacher Similarity</th>
                    <th className="p-2 text-left">Grade</th>
                    <th className="p-2 text-left">Marks</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">File</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions[a._id] && submissions[a._id].length > 0 ? (
                    submissions[a._id].map(s => (
                      <tr key={s._id} className="border-b">
                        <td className="p-2">{s.studentId._id || s.studentId}</td>
                        <td className="p-2">{s.studentId.name || s.name}</td>
                        <td className="p-2">{s.peerSimilarity}%</td>
                        <td className="p-2">{s.teacherSimilarity}%</td>
                        <td className="p-2">{s.grade}</td>
                        <td className="p-2">{s.marks}</td>
                        <td className={`p-2 font-semibold ${s.status === "accepted" ? "text-green-600" : "text-red-600"}`}>{s.status}</td>
                        <td className="p-2">
                          {s.file ? (
                            <a href={s.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View / Download</a>
                          ) : (
                            <span className="text-gray-400 italic">No file</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center p-4 text-gray-500">
                        {submissions[a._id] ? "No submissions yet" : "Loading submissions..."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssignmentSubmissionsToggle;
