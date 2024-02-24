import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import config from '../config.js';

const __filename = dirname(fileURLToPath(import.meta.url));
const __dirname = dirname(join(__filename), '..');

async function matchPasswords(passwordToCompare, originalPassword) {
  const result = await bcrypt.compare(passwordToCompare, originalPassword);

  return result;
}

async function generateToken(data) {
  const token = await jwt.sign(data, config.JWT_SECRET, {
    expiresIn: '7d',
  });

  return token;
}

async function customResponse(res, status, message) {
  return res.status(status).json({ message: message });
}

function createUniqueToken() {
  const uniqueToken = uuidv4();

  return uniqueToken;
}

async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASSWORD,
    },
  });

  options.from = config.MAIL_USER;
  await transporter.sendMail(options);
}

export {
  __dirname,
  generateToken,
  customResponse,
  matchPasswords,
  createUniqueToken,
  sendEmail,
};
