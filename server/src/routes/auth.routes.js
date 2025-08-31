import express from "express";
import { signup, signin, getUser } from "../controllers/auth.controllers.js";
import { isAuth } from "../middleware/auth.middlewares.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me",isAuth, getUser);
export default router;
