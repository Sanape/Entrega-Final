import express from "express";

import {
  deleteCurrentUser,
  updateCurrentUser,
  forgotPassword,
  resetPassword,
  changeRole,
  getAllUsers,
  uploadDocument,
  deleteInactiveUsers,
  getUser,
  deleteUser
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import isAdmin from "../middlewares/checkRole.middleware.js";

import {
  multerUploads,
  processFile,
} from "../middlewares/uploadFiles.middleware.js";

import { body_must_contain_attributes, body_must_not_contain_attributes, meetsWithEmailRequirements, meetsWithPasswordRequirements } from "../middlewares/validationData.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsers);

router.get("/:uid", isAuthenticated, isAdmin, getUser);

router.delete("/", isAuthenticated, deleteCurrentUser);

router.delete("/inactive", isAuthenticated, isAdmin, deleteInactiveUsers);

router.delete("/:uid", isAuthenticated, isAdmin, deleteUser);

router.put(
  "/",
  isAuthenticated,
  body_must_not_contain_attributes(["id", "email", "password", "oauthuser", "role"]),
  multerUploads,
  processFile,
  updateCurrentUser
);

router.put(
  "/admin/:uid",
  isAuthenticated,
  changeRole
);

router.post(
  "/forgotPassword",
  meetsWithEmailRequirements,
  forgotPassword
);

router.post(
  "/resetPassword/:token",
  meetsWithPasswordRequirements,
  resetPassword
);

router.post(
  "/documents",
  isAuthenticated,
  multerUploads,
  processFile,
  uploadDocument
);

export default router;
