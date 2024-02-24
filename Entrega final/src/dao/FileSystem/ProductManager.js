import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(newProduct) {
    try {
      const products = await this.getProducts();

      const repeatedCode = products.find(
        (product) => product.code === newProduct.code
      );

      if (repeatedCode) {
        throw new Error("Invalid product due to repeated code");
      }

      newProduct.id = products.length
        ? products[products.length - 1].id + 1
        : 1;

      products.push(newProduct);

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(products))
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

  async getProductsFromFile() {
    try {
      if (!fs.existsSync(this.path)) {
        const products = [];

        await fs.promises.writeFile(this.path, JSON.stringify(products));

        return products;
      }

      const products = JSON.parse(await fs.promises.readFile(this.path));

      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(limit) {
    try {
      const products = await this.getProductsFromFile();

      return products.slice(0, limit);
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();

      const foundProduct = products.find((product) => product.id === +id);

      if (foundProduct) {
        return foundProduct;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id, newProductInfo) {
    try {
      if (
        newProductInfo.id ||
        newProductInfo.code ||
        newProductInfo.thumbnails
      ) {
        throw new Error("Cannot change product id, code or thumbnails");
      }

      let product = { ...(await this.getProductById(id)) };

      const products = await this.getProducts();

      let foundIndex = products.findIndex((_product) => _product.id === +id);

      products[foundIndex] = {
        ...product,
        ...newProductInfo,
      };

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(products))
        .then(() => {
          return "Product updated";
        })
        .catch((err) => {
          throw new Error("Product could not be updated");
        });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const products = await this.getProducts();

      await this.getProductById(id);

      const index = products.findIndex((_product) => _product.id === +id);

      products.splice(index, 1);

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(products))
        .then(() => {
          return "Product deleted";
        })
        .catch((err) => {
          throw new Error("Product could not be deleted");
        });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addImageToProductById(id, imagePath) {
    try {
      let product = { ...(await this.getProductById(id)) };

      const products = await this.getProducts();

      let foundIndex = products.findIndex((_product) => _product.id === +id);

      product.thumbnails.push({
        idPhoto: product.thumbnails.length ? product.thumbnails.length : 1,
        url: imagePath,
      });

      products[foundIndex] = {
        ...product,
      };

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(products))
        .then(() => {
          return "Image added";
        })
        .catch((err) => {
          throw new Error("Image could not be added");
        });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteImageOfProductById(idProduct, idImage) {
    try {
      let product = { ...(await this.getProductById(idProduct)) };

      const products = await this.getProducts();

      let foundIndex = products.findIndex(
        (_product) => _product.id === +idProduct
      );

      const imageIndex = product.thumbnails.findIndex(
        (image) => image.idPhoto === +idImage
      );

      product.thumbnails.splice(imageIndex, 1);

      products[foundIndex] = {
        ...product,
      };

      const result = await fs.promises
        .writeFile(this.path, JSON.stringify(products))
        .then(() => {
          return "Image deleted";
        })
        .catch((err) => {
          throw new Error("Image could not be deleted");
        });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const productManager = new ProductManager("products.json");
