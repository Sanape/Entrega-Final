import { Product } from '../../models/product.js';
import BaseDao from './Base.dao.js';
import { Category } from '../../models/category.js';
import { Op } from 'sequelize';
import { errors } from '../../utils/errorDictionary.js';
import { Brand } from '../../models/brand.js';

class ProductDao extends BaseDao {
  constructor() {
    super(Product);
  }

  getSearchCriteria(filter, filterValue) {
    if (filter && !filterValue) {
      throw new errors.FILTER_NOT_PROVIDED();
    }

    switch (filter) {
      case 'keyword':
        return {
          where: {
            title: { [Op.iLike]: `%${filterValue}%` },
          },
        };

      case 'category':
        return {
          include: [
            {
              model: Category,
              where: {
                id: +filterValue,
              },
            },
          ],
        };

      case 'brand':
        return {
          include: [
            {
              model: Brand,
              where: {
                id: +filterValue,
              },
            },
          ],
        };

      case 'price':
        filterValue = JSON.parse(filterValue);
        return {
          where: {
            price: {
              [Op.and]: {
                [Op.lte]: +filterValue.majorPrice,
                [Op.gte]: +filterValue.minorPrice,
              },
            },
          },
        };

      case 'discount':
        filterValue = JSON.parse(filterValue);
        return {
          where: {
            discount: {
              [Op.and]: {
                [Op.lte]: +filterValue.majorDiscount,
                [Op.gte]: +filterValue.minorDiscount,
              },
            },
          },
        };
      //TODO:Switch to a more complex criteria made by a calculation of the average of all ratings
      case 'popularity':
        filterValue = JSON.parse(filterValue);
        return {
          where: {
            updatedAt: {
              [Op.and]: {
                [Op.lte]: filterValue.endDate,
                [Op.gte]: filterValue.startDate,
              },
            },
          },
        };

      case 'recent':
        filterValue = JSON.parse(filterValue);
        return {
          where: {
            createdAt: {
              [Op.and]: {
                [Op.lte]: filterValue.endDate,
                [Op.gte]: filterValue.startDate,
              },
            },
          },
        };

      default:
        return {};
    }
  }

  async getProducts(filter, filterValue, limit, page, sort, order) {
    try {
      let searchCriteria = {
        ...this.getSearchCriteria(filter, filterValue),
        offset: (page - 1) * limit,
        limit: limit,
      };

      if (sort && order) {
        searchCriteria = { ...searchCriteria, order: [[sort, order]] };
      }

      const foundObjects = await this.model.findAndCountAll(searchCriteria);

      return foundObjects;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductDao();
