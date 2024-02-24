import { Product } from "./product.js";
import { DataTypes } from "sequelize";
import { Database } from "../config/database.connection.js";
import { deleteFileInCloud } from "../middlewares/uploadFiles.middleware.js";

const instanceDatabase = Database.getInstanceDatabase();

export const Developer = await instanceDatabase.define("developer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  developer_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  url_logo_developer: {
    type: DataTypes.STRING,
    defaultValue:
      "https://res.cloudinary.com/dixntuyk8/image/upload/v1701903327/image_not_found.webp",
  },
  logo_developer_public_id: {
    type: DataTypes.STRING,
    defaultValue: "image_not_found",
  },
});

Developer.beforeBulkDestroy(async (developer, options) => {
  const foundDeveloper = await Developer.findByPk(+developer.where.id);

  if (foundDeveloper.logo_developer_public_id != "image_not_found") {
    await deleteFileInCloud(foundDeveloper.logo_developer_public_id);
  }
});
