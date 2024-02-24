import CategoryDao from '../dao/DBSystem/Category.dao.js';
import { errors } from '../utils/errorDictionary.js';
import BaseService from './Base.service.js';
import ProductService from './Product.service.js';

class CategoryService extends BaseService {
  constructor() {
    super(CategoryDao);
  }

  async addProductToCategory(object) {
    try {
      const foundCategory = await this.getById(object.categoryId);
      const foundProduct = await ProductService.getById(object.productId);

      if (await foundCategory.hasProduct(foundProduct)) {
        throw new errors.PRODUCT_ALREADY_BELONG_CATEGORY(
          foundCategory.category_name
        );
      }

      await foundCategory.addProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCategory(productId, categoryId) {
    try {
      const foundCategory = await this.getById(categoryId);
      const foundProduct = await ProductService.getById(productId);

      if (!(await foundCategory.hasProduct(foundProduct))) {
        throw new errors.PRODUCT_NOT_BELONG_CATEGORY(
          foundCategory.category_name
        );
      }

      await foundCategory.removeProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();
