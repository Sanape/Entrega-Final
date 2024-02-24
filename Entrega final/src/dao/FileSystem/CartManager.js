import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async addCart(newCart) {
    try {
      const carts = await this.getCarts();

      newCart.id = carts.length ? carts[carts.length - 1].id + 1 : 1;

      carts.push(newCart);

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(carts))
        .then(() => {
          return "Cart added";
        })
        .catch((err) => {
          throw new Error("Cart could not be added");
        });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCartsFromFile() {
    try {
      if (!fs.existsSync(this.path)) {
        const carts = [];

        await fs.promises.writeFile(this.path, JSON.stringify(carts));

        return carts;
      }

      const carts = JSON.parse(await fs.promises.readFile(this.path));

      return carts;
    } catch (error) {
      throw error;
    }
  }

  async getCarts(limit) {
    try {
      const carts = await this.getCartsFromFile();

      return carts.slice(0, limit);
    } catch (error) {
      return error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();

      const foundCart = carts.find((cart) => cart.id === +id);

      if (foundCart) {
        return foundCart;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async addProductToCartById(idCart, idProduct) {
    try {
      const carts = await this.getCarts();

      let cart = { ...(await this.getCartById(idCart)) };

      const foundProductIndex = cart.products.findIndex(
        (product) => product.product === +idProduct
      );

      if (foundProductIndex === -1) {
        cart.products.push({
          product: +idProduct,
          quantity: 1,
        });
      } else {
        cart.products[foundProductIndex].quantity += 1;
      }

      const foundCartIndex = carts.findIndex((cart) => cart.id === +idCart);

      carts[foundCartIndex] = cart;

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(carts))
        .then(() => {
          return "Product added";
        })
        .catch((err) => {
          throw new Error("Product could not be added");
        });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const cartManager = new CartManager("carts.json");
