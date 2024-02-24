import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";
import { User } from "./user.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Rating = await instanceDatabase.define("rating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      max: 5,
      min: 0,
    },
    defaultValue: 0,
  },
  comment: {
    type: DataTypes.STRING,
  },
});


