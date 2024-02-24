import SupplierDao from '../dao/Supplier.dao.js';
import { errors } from '../utils/errorDictionary.js';
import BaseService from './Base.service.js';
import ProductService from './Product.service.js';

class SupplierService extends BaseService {
  constructor() {
    super(SupplierDao);
  }

  async addProductToSupplier(object) {
    try {
      const foundSupplier = await this.getById(object.supplierId);
      const foundProduct = await ProductService.getById(object.productId);

      if (await foundSupplier.hasProduct(foundProduct)) {
        throw new errors.PRODUCT_ALREADY_BELONG_SUPPLIER(foundSupplier.name);
      }

      await foundSupplier.addProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromSupplier(productId, supplierId) {
    try {
      const foundSupplier = await this.getById(supplierId);
      const foundProduct = await ProductService.getById(productId);

      if (!(await foundSupplier.hasProduct(foundProduct))) {
        throw new errors.PRODUCT_NOT_BELONG_SUPPLIER(foundSupplier.name);
      }

      await foundSupplier.removeProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }

  async getSuppliersWithProductInStock(productId) {
    try {
      const suppliers = await this.dao.getSupplierWithProductInStock(productId);
      return suppliers;
    } catch (error) {
      throw error;
    }
  }
}

export default new SupplierService();
