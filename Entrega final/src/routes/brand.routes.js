import express from 'express';

import {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  addProductToBrand,
  deleteProductFromBrand,
} from '../controllers/brand.controller.js';

import { body_must_contain_attributes } from '../middlewares/validationData.middleware.js';

import { isAuthenticated } from '../middlewares/auth.middleware.js';

import isAdmin from '../middlewares/checkRole.middleware.js';

const router = express.Router();

router.get('/', getBrands);

router.post(
  '/',
  isAuthenticated,
  isAdmin,
  body_must_contain_attributes(['name', 'country', 'mail', 'phone']),
  createBrand
);

router.post(
  '/product',
  isAuthenticated,
  isAdmin,
  body_must_contain_attributes(['brandId', 'productId']),
  addProductToBrand
);

router.delete(
  '/:bid/product/:pid',
  isAuthenticated,
  isAdmin,
  deleteProductFromBrand
);

router.delete('/:bid', isAuthenticated, isAdmin, deleteBrand);

router.put('/:bid', isAuthenticated, isAdmin, updateBrand);

export default router;
