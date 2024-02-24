import BrandDao from '../dao/Brand.dao.js';
import { errors } from '../utils/errorDictionary.js';
import BaseService from './Base.service.js';
import ProductService from './Product.service.js';

class BrandService extends BaseService {
  constructor() {
    super(BrandDao);
  }

  async addProductToBrand(object) {
    try {
      const foundBrand = await this.getById(object.brandId);
      const foundProduct = await ProductService.getById(object.productId);

      if (await foundBrand.hasProduct(foundProduct)) {
        throw new errors.PRODUCT_ALREADY_BELONG_BRAND(foundBrand.name);
      }

      await foundBrand.addProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromBrand(productId, brandId) {
    try {
      const foundBrand = await this.getById(brandId);
      const foundProduct = await ProductService.getById(productId);

      if (!(await foundBrand.hasProduct(foundProduct))) {
        throw new errors.PRODUCT_NOT_BELONG_BRAND(foundBrand.name);
      }

      await foundBrand.removeProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }
}

export default new BrandService();
