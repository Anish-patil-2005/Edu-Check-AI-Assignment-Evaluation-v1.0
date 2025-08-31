import React, { useState } from "react";
import { createAssignment } from "../../services/api";

const UploadForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [samplefile, setSamplefile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    if (samplefile) {
      formData.append("samplefile", samplefile);
    }

    try {
      const res = await createAssignment(formData);
      setMessage("✅ Assignment created successfully!");
      console.log("Created Assignment:", res.assignment);

      setTimeout(() => {
        setMessage("");
        onClose(); // auto close modal
      }, 1500);
    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
        setMessage(`❌ Failed: ${err.response.data.message}`);
      } else {
        console.error("Error:", err.message);
        setMessage("❌ Failed to create assignment");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          placeholder="Enter assignment description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Sample File (optional)
        </label>
        <input
          type="file"
          onChange={(e) => setSamplefile(e.target.files[0])}
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200"
      >
        Create Assignment
      </button>

      {/* Status Message */}
      {message && (
        <p
          className={`mt-2 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default UploadForm;
