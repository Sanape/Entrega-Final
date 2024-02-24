import express from "express";

import { body_must_contain_attributes } from "../middlewares/validationData.middleware.js";

import {
  rate,
  getRecentRatings,
  getRatingOfCurrentUser,
} from "../controllers/rating.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  body_must_contain_attributes(["rating"]),
  isAuthenticated,
  rate
); //route:✓ anda:✓

router.get("/recent", getRecentRatings); //route:✓ anda:✓

router.get("/", isAuthenticated, getRatingOfCurrentUser); //route:✓ anda:✓

export default router;
