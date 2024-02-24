import BaseService from "./Base.service.js";
import ProductService from "./Product.service.js";
import CartDao from "../dao/DBSystem/Cart.dao.js";
import { createUniqueToken } from "../utils/utils.js";
import UserService from "./User.service.js";
import { Op } from "sequelize";
import { Product } from "../models/product.js";
import { sendEmail } from "../utils/utils.js";
import { errors } from "../utils/errorDictionary.js";

class CartService extends BaseService {
  constructor() {
    super(CartDao);
  }

  async create(object) {
    try {
      const foundUser = await UserService.getById(object.userId);

      if (!foundUser) {
        throw new errors.USER_NOT_FOUND();
      }

      object = {
        ...object,
        purchaser: foundUser.email,
        code: createUniqueToken(),
      };

      return await super.create(object);
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const foundObject = await this.dao.getByFilter({
        where: {
          id: id,
        },
        include: [
          {
            model: Product,
          },
        ],
      });

      return foundObject;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(object) {
    try {
      const foundCart = await this.getById(object.cartId);
      const foundProduct = await ProductService.getById(object.productId);

      if (foundCart.bought) {
        throw new errors.PRODUCT_CANNOT_ADD_TO_BOUGHT_CART();
      }

      if (await foundCart.hasProduct(foundProduct)) {
        throw new errors.PRODUCT_ALREADY_ADDED_TO_CART();
      }

      foundCart.amount = +foundCart.amount;

      foundCart.amount =
        +foundProduct.price * (1 - +foundProduct.discount / 100);

      await foundCart.save();

      await foundCart.addProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(productId, cartId) {
    try {
      const foundCart = await this.getById(cartId);
      const foundProduct = await ProductService.getById(productId);

      if (foundCart.bought) {
        throw new errors.PRODUCT_CANNOT_REMOVE_FROM_BOUGHT_CART();
      }

      if (!(await foundCart.hasProduct(foundProduct))) {
        throw new errors.PRODUCT_NOT_ADDED_TO_CART();
      }

      await foundCart.removeProduct(foundProduct);
    } catch (error) {
      throw error;
    }
  }

  async buyCart(cartId, userId) {
    try {
      const foundObject = await this.getByFilter({
        where: {
          id: cartId,
          userId: userId,
        },
        include: [
          {
            model: Product,
          },
        ],
      });

      if (!foundObject) {
        throw new errors.CART_NOT_FOUND();
      }

      if (foundObject.bought) {
        throw new errors.CART_ALREADY_BOUGHT();
      }

      if (foundObject.products.length === 0) {
        throw new errors.EMPTY_CART();
      }

      foundObject.amount = 0;

      for (const product of foundObject.products) {
        foundObject.amount += +product.price * (1 - +product.discount / 100);

        product.popularity++;

        await product.save();
      }

      foundObject.bought = true;

      await foundObject.save();

      await this.create({ userId: userId });

      const foundUser = await UserService.getById(userId);

      const productsTemplate = foundObject.products
        .map(
          (
            product
          ) => `<li style="display:flex;justify-content:center;align-items:center;width:100%;margin-top:20px">
      <img src="${product.url_front_page}" width="100px"/>
      <div style="margin-left:20px;">
      <p>Title: ${product.title}</p>
      <p>Price: ${product.price}</p>
      <p>Discount: ${product.discount}</p>
      <p>Final price: ${+product.price * (1 - +product.discount / 100)}</p>
      </div>
    </li>`
        )
        .join(" ");

      const emailBody = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">

        <h2>Purchase confirmation</h2>

        <p>¡Thanks for trusting us!</p>

        <hr>

        <h3>Purchase Details:</h3>

        <p><strong>Products:</strong></p>
        <ul style="width:100%">
      ${productsTemplate}
        </ul>
        <p><strong>Unique code:</strong> ${foundObject.code}</p>
        <p><strong>Total:</strong> $${foundObject.amount}</p>

        <hr>

        <h3>Client information:</h3>

        <p><strong>Name:</strong> ${foundUser.first_name} ${foundUser.last_name}</p>
        <p><strong>Email:</strong> ${foundObject.purchaser}</p>

    </div>
      `;

      sendEmail({
        to: foundObject.purchaser,
        subject: "Purchase confirmation",
        html: emailBody,
      });
    } catch (error) {
      throw error;
    }
  }

  async getHistoryBuysOfCurrentUser(userId, startDate, endDate) {
    try {
      const query = {
        where: {
          userId: userId,
          bought: true,
        },
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Product,
          },
        ],
      };

      if (startDate && endDate) {
        query.where = {
          ...query.where,
          updatedAt: {
            [Op.and]: {
              [Op.lte]: endDate,
              [Op.gte]: startDate,
            },
          },
        };
      }

      const foundHistory = await this.getAll(query);

      return foundHistory;
    } catch (error) {
      throw error;
    }
  }

  async productAddedToCart(productId, cartID) {
    try {
      const foundCart = await this.getById(+cartID);
      const foundProduct = await ProductService.getById(+productId);

      const result = await foundCart.hasProduct(foundProduct);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new CartService();
