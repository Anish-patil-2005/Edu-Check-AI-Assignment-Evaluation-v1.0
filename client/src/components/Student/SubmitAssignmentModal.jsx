import React, { useState } from "react";
import { submitAssignment } from "../../services/api";

const SubmitAssignmentModal = ({ assignment, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    try {
      const res = await submitAssignment({ assignmentId: assignment._id, file });

      if (res.status === "accepted") {
       
        onSuccess(assignment._id, res); // update parent
      } else {
        alert(`❌ Submission rejected: ${res.reason}`);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-4">{assignment.title}</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4 w-full" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignmentModal;
