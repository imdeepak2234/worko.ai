import express from "express";
import {
  registerController,
  loginController,
  testController,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/authcontroller.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// routing

// REGISTER || METHOD POST
router.post("/register", registerController);

// login||post
router.post("/login", loginController);

// test routes
router.get("/test", requireSignIn, testController);

router.get("/", requireSignIn, getUsers);
router.get("/:userId", requireSignIn, getUserById);
router.post("/", requireSignIn, createUser);
router.put("/", requireSignIn, updateUser);
router.patch("/", requireSignIn, patchUser);
router.delete("/", requireSignIn, deleteUser);

export default router;
