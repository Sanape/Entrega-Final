import express from "express";

import {
  getDevelopers,
  getDeveloper,
  createDeveloper,
  deleteDeveloper,
  updateDeveloper,
} from "../controllers/developer.controller.js";

import {
  body_must_contain_attributes,
  body_must_not_contain_attributes,
} from "../middlewares/validationData.middleware.js";

import {
  multerUploads,
  processFile,
} from "../middlewares/uploadFiles.middleware.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import isAdmin from "../middlewares/checkRole.middleware.js";

const router = express.Router();

router.get("/", getDevelopers); //route:✓ anda:✓

router.get("/:did", getDeveloper); //route:✓ anda:✓

router.post(
  //route:✓ anda:✓
  "/",
  isAuthenticated,
  isAdmin,
  body_must_contain_attributes(["developer_name"]),
  createDeveloper
);

router.put(
  //route:✓ anda:✓
  "/:did",
  isAuthenticated,
  isAdmin,
  body_must_not_contain_attributes([
    "url_logo_developer",
    "logo_developer_public_id",
  ]),
  multerUploads,
  processFile,
  updateDeveloper
);

router.delete("/:did", isAuthenticated, isAdmin, deleteDeveloper); //route:✓ anda:✓

export default router;
