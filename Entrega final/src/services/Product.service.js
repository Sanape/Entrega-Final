import ProductDao from '../dao/DBSystem/Product.dao.js';
import BaseService from './Base.service.js';
import { deleteFileInCloud } from '../middlewares/uploadFiles.middleware.js';
import { Category } from '../models/category.js';
import { Developer } from '../models/developer.js';
import { errors } from '../utils/errorDictionary.js';
import config from '../config.js';

class ProductService extends BaseService {
  constructor() {
    super(ProductDao);
  }

  async updateById(id, object) {
    try {
      const foundObject = await this.getById(id);

      if (object.front_page_public_id) {
        await deleteFileInCloud(foundObject.front_page_public_id);
      }

      return super.updateById(id, object);
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const foundObject = await this.getByFilter({
        where: {
          id: id,
        },
        include: [
          {
            model: Category,
          },
          {
            model: Developer,
          },
        ],
      });

      if (!foundObject) {
        throw new errors.PRODUCT_NOT_FOUND();
      }

      return foundObject;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(
    filter = '',
    filterValue = '',
    limit = 5,
    page = 1,
    sort = '',
    order = ''
  ) {
    try {
      const products = await this.dao.getProducts(
        filter,
        filterValue,
        limit,
        page,
        sort,
        order
      );

      products.prevLink =
        page > 1
          ? config.URL_FRONTEND + `/api/products?page=${+page - 1}`
          : null;
      products.nextLink =
        page < products.count / limit
          ? config.URL_FRONTEND + `/api/products?page=${+page + 1}`
          : null;

      products.prevLink =
        sort && order && products.prevLink
          ? products.prevLink + `&sort=${sort}&order=${order}`
          : products.prevLink;

      products.nextLink =
        sort && order && products.nextLink
          ? products.nextLink + `&sort=${sort}&order=${order}`
          : products.nextLink;

      products.prevLink =
        limit && products.prevLink
          ? products.prevLink + `&limit=${limit}`
          : products.prevLink;

      products.nextLink =
        limit && products.nextLink
          ? products.nextLink + `&limit=${limit}`
          : products.nextLink;

      products.prevLink =
        filter && products.prevLink
          ? products.prevLink + `&filter=${filter}`
          : products.prevLink;

      products.nextLink =
        filter && products.nextLink
          ? products.nextLink + `&filter=${filter}`
          : products.nextLink;

      products.prevLink =
        filterValue && products.prevLink
          ? products.prevLink + `&filterValue=${filterValue}`
          : products.prevLink;

      products.nextLink =
        filterValue && products.nextLink
          ? products.nextLink + `&filterValue=${filterValue}`
          : products.nextLink;

      return products;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
