import express from 'express';

import {
  addProductToCategory,
  createCategory,
  deleteCategory,
  deleteProductFromCategory,
  getCategories,
  updateCategory,
} from '../controllers/category.controller.js';

import { body_must_contain_attributes } from '../middlewares/validationData.middleware.js';

import { isAuthenticated } from '../middlewares/auth.middleware.js';

import isAdmin from '../middlewares/checkRole.middleware.js';

const router = express.Router();

router.get('/', getCategories);

router.post(
  '/',
  isAuthenticated,
  isAdmin,
  body_must_contain_attributes(['category_name']),
  createCategory
);

router.post(
  '/product',
  isAuthenticated,
  isAdmin,
  body_must_contain_attributes(['productId', 'categoryId']),
  addProductToCategory
);

router.delete(
  '/:ctid/product/:pid',
  isAuthenticated,
  isAdmin,
  deleteProductFromCategory
);

router.delete('/:ctid', isAuthenticated, isAdmin, deleteCategory);

router.put('/:ctid', isAuthenticated, isAdmin, updateCategory);

export default router;
