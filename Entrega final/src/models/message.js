import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";
import { User } from "./user.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Message = await instanceDatabase.define("message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


