import express from 'express';
import {
  addProductToSupplier,
  createSupplier,
  deleteSupplier,
  deleteProductFromSupplier,
  updateSupplier,
} from '../controllers/SupplierController.js';

const router = express.Router();

router.get('/', isAuthenticated, isAdmin, getAll);
router.post('/', createSupplier);
router.post('/product', addProductToSupplier);
router.delete('/:sid/product/:pid', deleteProductFromSupplier);
router.delete('/:sid', deleteSupplier);
router.put('/:sid', updateSupplier);

export default router;
