import express from "express";

import passport from "passport";

import {
  body_must_contain_attributes,
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
} from "../middlewares/validationData.middleware.js";

import {
  getActualUser,
  login,
  logout,
  register,
} from "../controllers/session.controller.js";

import "../middlewares/google.strategy.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  //route:✓ anda:✓
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  //route:✓ anda:✓
  "/google/callback",
  passport.authenticate("google", {

    failureRedirect: process.env.URL_FRONTEND +"/login",
  })
  ,(req, res, next)=>{
    res.cookie("user", JSON.stringify(req.user))
    res.redirect(process.env.URL_FRONTEND)
  }
);

router.post(
  "/login",
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
  login
);

router.post(
  "/register",
  body_must_contain_attributes(["first_name", "last_name"]),
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
  register
);

router.delete("/", isAuthenticated, logout);

router.get("/current", isAuthenticated, getActualUser);

export default router;
