import axios from 'axios'

export const API = axios.create({
    baseURL: "http://localhost:8080/api", // your backend base URL
});

//Login request

export const loginuser = async (data)=>{
    const res = await API.post("/auth/signin",data);
    return res.data;
};

export const signUp =async(data)=>{
    const res = await API.post("/auth/signup",data);
    return res.data;
}



// ✅ Add interceptor to always include token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createAssignment = async (formData) => {
  try {
    const res = await API.post("/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating assignment:", err.response?.data || err.message);
    throw err;
  }
};


export const listAssignments = async ()=>{
  try {
    //
    const res = await API.get('/assignments');
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching all assignment:", err.response?.data || err.message);
    throw err;
  }
};

// api.js
export const listStudentsSubmissions = async (assignmentId) => {
  try {
    const res = await API.get(`/assignments/${assignmentId}/submissions`);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching submissions:", err.response?.data || err.message);
    throw err;
  }
};




export const getTotalAssignments = async () => {
  const res = await API.get("/assignments"); // fetch all assignments of this teacher
  return res.data.length;
};

export const getTotalSubmissions = async () => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await API.get("/submissions/total", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = res.data || [];
    return data.reduce((acc, curr) => acc + (curr.totalSubmissions || 0), 0);
  } catch (err) {
    console.error("Error fetching total submissions:", err);
    return 0;
  }
};


// Fetch assignments for students
export const listAssignmentsForStudentsAPI = async () => {
  const res = await API.get("/submissions/student");
  return res.data; // should return array of assignments
};

// Fetch submissions by this student
export const listStudentSubmissionsById = async (studentId) => {
  const res = await API.get(`/submissions/student/${studentId}`);
  return res.data; // should include status field
};

// Submit an assignment
export const submitAssignment = async ({ assignmentId, file }) => {
  const formData = new FormData();
  formData.append("submissionFile", file);
  formData.append("assignmentId", assignmentId);

  const res = await API.post("/submissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const downloadAssignmentFile = async (assignmentId) => {
  const response = await API.get(
    `/assignments/${assignmentId}/sample-file`,
    {
      // We tell the server we expect a file in return
      responseType: 'blob',
    }
  );
  // This returns the raw file data
  return response.data;
};


export const downloadStudentSubmission = async (submissionId) => {
  const response = await API.get(
    `/submissions/${submissionId}/file`,
    {
      // We tell the server we expect a file in return
      responseType: 'blob',
    }
  );
  return response.data; // This returns the raw file data
};

