// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Layout from "./Layout/layout";
import Login from "./UserAuthentication/Login";
import SignUp from "./UserAuthentication/SignUp";

import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import Assignments from "./pages/Teacher/Assignments";
import Submissions from "./pages/Teacher/Submissions";
import UploadForm from "./components/Teacher Components/UploadForm";

import StudentDashboard from "./pages/StudentDashboard";
// import StudentAssignments from "./pages/Student/Assignments";
import StudentSubmissions from "./pages/StudentSubmissions.jsx";

import ProtectedRoute from "./contexts/ProtectedRoute";
import MyProfile from "./components/Profile/MyProfile.jsx";
const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Main layout */}
        <Route element={<Layout />}>
          {/* Default redirect based on role */}
          <Route
            index
            element={
              user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />
            }
          />

          <Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["teacher", "student"]}>
      <MyProfile />
    </ProtectedRoute>
  }
/>


          {/* Teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Submissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <UploadForm />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/student/submissions"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentSubmissions />
              </ProtectedRoute>
            }
              
          />
        </Route>

       
      </Routes>
    </Router>
  );
};

export default App;
