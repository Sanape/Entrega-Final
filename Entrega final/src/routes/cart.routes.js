import express from "express";

import {
  addProductToCart,
  deleteProductFromCart,
  getCartOfActiveUser,
  buyCart,
  getHistoryBuysOfCurrentUser,
  getCartById,
  productAddedToCart
} from "../controllers/cart.controller.js";

import { body_must_contain_attributes } from "../middlewares/validationData.middleware.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(//route:✓ anda:✓
  "/",
  isAuthenticated,
  body_must_contain_attributes(["productId", "cartId"]),
  addProductToCart
);

router.delete("/:cid/product/:pid", isAuthenticated, deleteProductFromCart);//route:✓  anda:✓

router.get("/", isAuthenticated, getCartOfActiveUser);//route:✓ anda:✓

router.get("/history", isAuthenticated, getHistoryBuysOfCurrentUser);//route:✓ anda:✓

router.get("/:cid", isAuthenticated, getCartById);//route:✓ anda:✓

router.put("/:cid/buy", isAuthenticated, buyCart);//route:✓ anda:✓ incluir enviar mail ticket o algo asi

router.get("/:cid/product/:pid", isAuthenticated, productAddedToCart);

export default router;
