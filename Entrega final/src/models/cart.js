import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";
import { User } from "./user.js";
import { Product } from "./product.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Cart = await instanceDatabase.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bought: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  purchaser: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

Cart.belongsTo(User);

User.hasMany(Cart);


