import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));


import assignmentRoutes from "./routes/assignment.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import authRoutes from "./routes/auth.routes.js"

app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/auth", authRoutes);

// Routes
app.get('/', (req, res) => {
  res.send("MongoDB connected with Express backend ✅");
});

export default app;
