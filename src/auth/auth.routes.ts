import { Router } from "express";
import { AuthController } from "./auth.controller.ts";
import { validate } from "../middleware/validate.middleware.ts";
import { loginSchema, signupSchema } from "./dto/auth.schema.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();
const authController = new AuthController();
router.post("/signup", validate({body: signupSchema}), authController.signup.bind(authController));
router.post("/login", validate({body: loginSchema}), authController.login.bind(authController));
router.get("/me", authMiddleware, authController.me.bind(authController));
export default router;