import { DataTypes } from 'sequelize';
import { Database } from '../config/database.connection.js';

const instanceDatabase = Database.getInstanceDatabase();

export const Supplier = await instanceDatabase.define('supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  //update in a future to handle many days/dates
  day_of_delivery: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
