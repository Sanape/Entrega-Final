import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Document = await instanceDatabase.define("document", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
