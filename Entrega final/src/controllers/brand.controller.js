import brandService from '../services/Brand.service.js';
import { customResponse } from '../utils/utils.js';
import { Op } from 'sequelize';

async function getBrands(req, res, next) {
  try {
    const { keyword } = req.query;

    let searchCriteria;

    if (keyword) {
      searchCriteria = {
        where: {
          name: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      };
    }

    const result = await brandService.getAll(searchCriteria);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function createBrand(req, res, next) {
  try {
    await brandService.create(req.body);

    return customResponse(res, 201, 'Brand created successfully');
  } catch (error) {
    next(error);
  }
}

async function updateBrand(req, res, next) {
  try {
    const { bid } = req.params;

    await brandService.updateById(bid, req.body);

    return customResponse(res, 200, 'Brand updated successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteBrand(req, res, next) {
  try {
    const { bid } = req.params;

    await brandService.deleteById(bid);

    return customResponse(res, 200, 'Brand deleted successfully');
  } catch (error) {
    next(error);
  }
}

// Function to add a product to a brand (if applicable)
async function addProductToBrand(req, res, next) {
  try {
    await brandService.addProductToBrand(req.body);

    return customResponse(res, 200, 'Product added to brand successfully');
  } catch (error) {
    next(error);
  }
}

// Function to remove a product from a brand (if applicable)
async function deleteProductFromBrand(req, res, next) {
  try {
    const { bid, pid } = req.params;

    await brandService.deleteProductFromBrand(pid, bid);

    return customResponse(res, 200, 'Product removed from brand successfully');
  } catch (error) {
    next(error);
  }
}

export {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  addProductToBrand,
  deleteProductFromBrand,
};
