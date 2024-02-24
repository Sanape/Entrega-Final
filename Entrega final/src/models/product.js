import { DataTypes } from 'sequelize';
import { Database } from '../config/database.connection.js';
import { Developer } from './developer.js';
import { Category } from './category.js';
import { Cart } from './cart.js';
import { deleteFileInCloud } from '../middlewares/uploadFiles.middleware.js';
import { Rating } from './rating.js';
import { Supplier } from './supplier.js';
import { Brand } from './brand.js';

const instanceDatabase = Database.getInstanceDatabase();

export const Product = await instanceDatabase.define('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      max: 100,
      min: 0,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  url_front_page: {
    type: DataTypes.STRING,
    defaultValue:
      'https://res.cloudinary.com/dixntuyk8/image/upload/v1701903327/image_not_found.webp',
  },
  front_page_public_id: {
    type: DataTypes.STRING,
    defaultValue: 'image_not_found',
  },
  popularity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// perform actions before the deletion of records. In your case, it's used to delete associated files from the cloud before the product record is deleted from the database.
Product.beforeBulkDestroy(async (product, options) => {
  const foundProduct = await Product.findByPk(+product.where.id);

  if (foundProduct.front_page_public_id != 'image_not_found') {
    await deleteFileInCloud(foundProduct.front_page_public_id);
  }
});

//1-N
//This defines a one-to-many relationship between Product and Developer.
Product.belongsTo(Developer);
//This is the counterpart to Product.belongsTo(Developer) and indicates that a developer can have multiple products.
Developer.hasMany(Product);

Product.hasMany(Rating);
Rating.belongsTo(Product);

Brand.hasMany(Product);
Product.belongsTo(Brand);

//N-N
//This defines a many-to-many relationship between Product and Category through a junction table named belong.
Product.belongsToMany(Category, {
  through: 'belong',
});
Category.belongsToMany(Product, {
  through: 'belong',
});

Product.belongsToMany(Cart, {
  through: 'added',
});
Cart.belongsToMany(Product, {
  through: 'added',
});

Product.belongsToMany(Supplier, {
  through: 'product_supplier',
});
Supplier.belongsToMany(Product, {
  through: 'product_supplier',
});
