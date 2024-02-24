import productService from "../services/Product.service.js";
import messageService from "../services/Message.service.js";
import categoryService from "../services/Category.service.js";
import developerService from "../services/Developer.service.js";
import { User } from "../models/user.js";
import { errors } from "../utils/errorDictionary.js";

async function getAllProductsHandler(io, socket) {
  socket.on("getAllProducts", async () => {
    const products = await productService.getAll();
    io.sockets.emit("updatedProducts", products);
  });
}

async function getAllCategoriesHandler(io, socket) {
  socket.on("getAllCategories", async () => {
    const categories = await categoryService.getAll();
    io.sockets.emit("updatedCategories", categories);
  });
}

async function getAllDevelopersHandler(io, socket) {
  socket.on("getAllDevelopers", async () => {
    const developers = await developerService.getAll();
    io.sockets.emit("updatedDevelopers", developers);
  });
}

async function getRandomBuy(io, socket) {
  socket.on("productBuy", async (user, product) => {
    const bought = {
      fullname: user.firstName + " " + user.lastName,
      product: product,
    };

    io.sockets.emit("newBought", bought);
  });
}

async function messagesHandler(io, socket) {
  socket.on("messageSent", async (message, user) => {
    message = { ...message, userId: user.id };
    if (user) {
      await messageService.create(message);
      const messages = await messageService.getAll({
        include: {
          model: User,
        },
      });
      io.sockets.emit("newMessages", messages);
    } else {
      throw new errors.UNAUTHENTICATED();
    }
  });

  socket.on("getMessages", async () => {
    const messages = await messageService.getAll({
      include: {
        model: User,
      },
    });
    io.sockets.emit("newMessages", messages);
  });
}

export {
  getAllProductsHandler,
  messagesHandler,
  getRandomBuy,
  getAllCategoriesHandler,
  getAllDevelopersHandler,
};
