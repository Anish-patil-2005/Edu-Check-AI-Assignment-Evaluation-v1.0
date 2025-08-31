import jwt from "jsonwebtoken";

// ✅ Check if user is logged in
export const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Allow only students
export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied, Students only" });
  }
  next();
};

// ✅ Allow only teachers
export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied, Teachers only" });
  }
  next();
};
