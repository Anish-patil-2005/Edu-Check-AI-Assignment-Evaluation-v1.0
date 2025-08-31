import React, { useEffect, useState } from "react";
import { listAssignments } from "../../services/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await listAssignments(); // ✅ Wait for API response
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return <p className="p-6">Loading assignments...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments Detail</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Sr.No.</th>
              <th className="p-3 text-left">Assignment Id</th>
              <th className="p-3 text-left">Assignment Name</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Sample File</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <tr
                  key={assignment.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="p-3">{`A${index + 1}`}</td>
                  <td className="p-3">{assignment._id}</td>
                  <td className="p-3">{assignment.title}</td>
                  <td className="p-3">
                    {assignment.dueDate
                      ? new Date(assignment.dueDate)
                          .toISOString()
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("-")
                      : "-"}
                  </td>

                  <td className="p-3">{assignment.description}</td>
                  <td className="p-3">
                    {assignment.sampleFile ? (
                      <a
                        href={assignment.sampleFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View / Download
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No assignments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignments;
