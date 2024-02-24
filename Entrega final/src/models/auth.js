import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";
import { User } from "./user.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Auth = await instanceDatabase.define("auth", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  resetPasswordTokenExpiration: {
    type: DataTypes.DATE,
  },
});


