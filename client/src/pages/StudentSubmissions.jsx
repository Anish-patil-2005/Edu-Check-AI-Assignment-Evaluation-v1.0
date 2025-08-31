import React, { useEffect, useState, useContext } from "react";
import { listStudentSubmissionsById } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

const StudentSubmissions = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await listStudentSubmissionsById(user._id);
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchSubmissions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500 text-lg">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        📚 My Submissions
      </h2>

      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
            <th className="px-6 py-3 border-b">Assignment ID</th>
            <th className="px-6 py-3 border-b">Title</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b">Submitted On</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length > 0 ? (
            submissions.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 border-b font-mono text-gray-600">
                  {sub.assignmentId?._id}
                </td>
                <td className="px-6 py-4 border-b font-medium text-gray-800">
                  {sub.assignmentId?.title}
                </td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sub.status === "accepted"
                        ? "bg-green-600 text-white"
                        : sub.status === "rejected"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 border-b text-gray-600">
                  {new Date(sub.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-6 text-center text-gray-500 italic"
              >
                No submissions found 📭
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentSubmissions;
