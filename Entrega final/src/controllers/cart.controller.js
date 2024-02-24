import cartService from '../services/Cart.service.js';
import { customResponse } from '../utils/utils.js';
import { Product } from '../models/product.js';

async function addProductToCart(req, res, next) {
  try {
    await cartService.addProductToCart(req.body);

    return customResponse(res, 201, 'Product added to cart');
  } catch (error) {
    next(error);
  }
}

async function getCartById(req, res, next) {
  try {
    const { cid } = req.params;

    const result = await cartService.getById(cid);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function deleteProductFromCart(req, res, next) {
  try {
    const { cid, pid } = req.params;

    await cartService.deleteProductFromCart(pid, cid);

    return customResponse(res, 200, 'Product remove from cart');
  } catch (error) {
    next(error);
  }
}

async function getCartOfActiveUser(req, res, next) {
  try {
    const uid = req.user.id;

    const result = await cartService.getByFilter({
      where: {
        userId: uid,
        bought: false,
      },
      include: [
        {
          model: Product,
        },
      ],
    });

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function buyCart(req, res, next) {
  try {
    const uid = req.user.id;
    const { cid } = req.params;

    await cartService.buyCart(cid, uid);

    return customResponse(res, 200, 'Cart bought successfully!');
  } catch (error) {
    next(error);
  }
}

async function getHistoryBuysOfCurrentUser(req, res, next) {
  try {
    const uid = req.user.id;
    const { startDate, endDate } = req.query;

    const result = await cartService.getHistoryBuysOfCurrentUser(
      uid,
      startDate,
      endDate
    );

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function productAddedToCart(req, res, next) {
  try {
    const { cid, pid } = req.params;

    const result = await cartService.productAddedToCart(pid, cid);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}
export {
  addProductToCart,
  deleteProductFromCart,
  getCartOfActiveUser,
  buyCart,
  getHistoryBuysOfCurrentUser,
  getCartById,
  productAddedToCart,
};
