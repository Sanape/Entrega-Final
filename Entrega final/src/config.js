import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT,
  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  ENV_MODE: process.env.ENV_MODE,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  SQL_DB_URI: process.env.SQL_DB_URI,
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  CLOUDNAME: process.env.CLOUDNAME,
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
  MAIL_USER: process.env.MAIL_USER,
};
