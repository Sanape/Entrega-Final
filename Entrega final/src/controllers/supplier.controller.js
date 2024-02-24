import SupplierService from '../services/Supplier.service.js';
import { customResponse } from '../utils/utils.js';

async function addProductToSupplier(req, res, next) {
  try {
    await SupplierService.addProductToSupplier(req.body);

    return customResponse(res, 200, 'Product added to supplier successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteProductFromSupplier(req, res, next) {
  try {
    const { sid, pid } = req.params;

    await SupplierService.deleteProductFromSupplier(pid, sid);

    return customResponse(res, 200, 'Product removed from supplier');
  } catch (error) {
    next(error);
  }
}

async function createSupplier(req, res, next) {
  try {
    await SupplierService.create(req.body);

    return customResponse(res, 201, 'Supplier created successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteSupplier(req, res, next) {
  try {
    const { sid } = req.params;

    await SupplierService.deleteById(sid);

    return customResponse(res, 200, 'Supplier deleted successfully');
  } catch (error) {
    next(error);
  }
}

async function updateSupplier(req, res, next) {
  try {
    const { sid } = req.params;

    await SupplierService.updateById(sid, req.body);

    return customResponse(res, 200, 'Supplier updated successfully');
  } catch (error) {
    next(error);
  }
}

export {
  addProductToSupplier,
  createSupplier,
  deleteSupplier,
  deleteProductFromSupplier,
  updateSupplier,
};
