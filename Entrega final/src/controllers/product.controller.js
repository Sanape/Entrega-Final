import productService from '../services/Product.service.js';
import { customResponse } from '../utils/utils.js';

async function getProducts(req, res, next) {
  try {
    const { filter, filterValue, limit, page, sort, order } = req.query;

    const result = await productService.getProducts(
      filter,
      filterValue,
      limit,
      page,
      sort,
      order
    );

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { pid } = req.params;

    const result = await productService.getById(pid);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function addProduct(req, res, next) {
  try {
    await productService.create(req.body);

    return customResponse(res, 201, 'Product added successfully');
  } catch (error) {
    next(error);
  }
}

async function updateProductById(req, res, next) {
  try {
    const { pid } = req.params;

    if (req.file) {
      req.body = {
        ...req.body,
        ...{
          url_front_page: req.file.url,
          front_page_public_id: req.file.publicId,
        },
      };
    }

    await productService.updateById(pid, req.body);

    return customResponse(res, 200, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteProductById(req, res, next) {
  try {
    const { pid } = req.params;

    await productService.deleteById(pid);

    return customResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
}

export {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
};
