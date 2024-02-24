import { DataTypes } from 'sequelize';
import { Database } from '../config/database.connection.js';
import { deleteFileInCloud } from '../middlewares/uploadFiles.middleware.js';
import { Rating } from './rating.js';
import { Message } from './message.js';
import { Auth } from './auth.js';
import { Document } from './document.js';
import bcrypt from 'bcrypt';

const instanceDatabase = Database.getInstanceDatabase();

export const User = await instanceDatabase.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      const salt = bcrypt.genSaltSync(10);
      this.setDataValue('password', bcrypt.hashSync(value, salt));
    },
  },
  oauthuser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER'),
    defaultValue: 'USER',
  },
  url_profile_photo: {
    type: DataTypes.STRING,
    defaultValue:
      'https://res.cloudinary.com/dixntuyk8/image/upload/v1693830223/x1vdmydenrkd3luzvjv6.png',
  },
  profile_public_id: {
    type: DataTypes.STRING,
    defaultValue: 'x1vdmydenrkd3luzvjv6',
  },
  last_connection: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
  },
});

User.beforeBulkDestroy(async (user, options) => {
  const foundUser = await User.findByPk(+user.where.id);

  if (foundUser.profile_public_id != 'x1vdmydenrkd3luzvjv6') {
    await deleteFileInCloud(foundUser.profile_public_id);
  }
});

User.hasMany(Rating, {
  onDelete: 'CASCADE',
});

Rating.belongsTo(User);

User.hasOne(Auth, {
  onDelete: 'CASCADE',
});

Auth.belongsTo(User);

User.hasMany(Message, {
  onDelete: 'CASCADE',
});

Message.belongsTo(User);

User.hasMany(Document, {
  onDelete: 'CASCADE',
});

Document.belongsTo(User);
