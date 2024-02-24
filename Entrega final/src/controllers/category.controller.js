import categoryService from '../services/Category.service.js';
import { customResponse } from '../utils/utils.js';
import { Op } from 'sequelize';

async function getCategories(req, res, next) {
  try {
    const { keyword } = req.query;

    let searchCriteria;

    if (keyword) {
      searchCriteria = {
        where: {
          category_name: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      };
    }

    const result = await categoryService.getAll(searchCriteria);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function addProductToCategory(req, res, next) {
  try {
    await categoryService.addProductToCategory(req.body);

    return customResponse(res, 200, 'Product categorized successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteProductFromCategory(req, res, next) {
  try {
    const { ctid, pid } = req.params;

    await categoryService.deleteProductFromCategory(pid, ctid);

    return customResponse(res, 200, 'Product not longer belongs to category');
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    await categoryService.create(req.body);

    return customResponse(res, 201, 'Category created successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { ctid } = req.params;

    await categoryService.deleteById(ctid);

    return customResponse(res, 200, 'Categories deleted successfully');
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { ctid } = req.params;

    await categoryService.updateById(ctid, req.body);

    return customResponse(res, 200, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
}

export {
  addProductToCategory,
  createCategory,
  deleteCategory,
  deleteProductFromCategory,
  getCategories,
  updateCategory,
};
