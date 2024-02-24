import { Product } from "./product.js";
import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Category = await instanceDatabase.define("category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});

