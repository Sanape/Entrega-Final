import UserDao from '../dao/DBSystem/User.dao.js';
import BaseService from './Base.service.js';
import CartService from './Cart.service.js';
import AuthService from './Auth.service.js';
import { UserDto } from '../dto/User.dto.js';
import { deleteFileInCloud } from '../middlewares/uploadFiles.middleware.js';
import DocumentService from './Document.service.js';
import { Op } from 'sequelize';
import _ from 'lodash';
import config from '../config.js';

import {
  generateToken,
  matchPasswords,
  createUniqueToken,
  sendEmail,
} from '../utils/utils.js';

import { errors } from '../utils/errorDictionary.js';

class UserService extends BaseService {
  constructor() {
    super(UserDao);
  }

  async getById(id) {
    try {
      const foundObject = await super.getById(id);

      return new UserDto(
        foundObject.id,
        foundObject.first_name,
        foundObject.last_name,
        foundObject.email,
        foundObject.role,
        foundObject.url_profile_photo
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteInactiveUsers() {
    try {
      const twoDaysAgo = new Date();

      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const users = await this.dao.getAll({
        where: {
          last_connection: {
            [Op.lt]: twoDaysAgo,
          },
        },
      });

      users.forEach(async (user) => {
        await this.deleteById(user.id);

        const emailBody = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
          <h2>Your account has been deleted due inactivity</h2>
          <p>Your information has been lost and cannot be recover. If you want to use our services again you
          will have to create another account. Sorry for any inconvenience.</p>
        </div>
      `;

        sendEmail({
          to: user.email,
          subject: 'We have bad news for you :(',
          html: emailBody,
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll(
    filter = '',
    filterValue = '',
    limit = 5,
    page = 1,
    sort = '',
    order = ''
  ) {
    try {
      const users = await this.dao.getUsers(
        filter,
        filterValue,
        limit,
        page,
        sort,
        order
      );

      users.prevLink =
        page > 1 ? config.URL_FRONTEND + `/api/users?page=${+page - 1}` : null;
      users.nextLink =
        page < users.count / limit
          ? config.URL_FRONTEND + `/api/users?page=${+page + 1}`
          : null;

      users.prevLink =
        sort && order && users.prevLink
          ? users.prevLink + `&sort=${sort}&order=${order}`
          : users.prevLink;

      users.nextLink =
        sort && order && users.nextLink
          ? users.nextLink + `&sort=${sort}&order=${order}`
          : users.nextLink;

      users.prevLink =
        limit && users.prevLink
          ? users.prevLink + `&limit=${limit}`
          : users.prevLink;

      users.nextLink =
        limit && users.nextLink
          ? users.nextLink + `&limit=${limit}`
          : users.nextLink;

      users.prevLink =
        filter && users.prevLink
          ? users.prevLink + `&filter=${filter}`
          : users.prevLink;

      users.nextLink =
        filter && users.nextLink
          ? users.nextLink + `&filter=${filter}`
          : users.nextLink;

      users.prevLink =
        filterValue && users.prevLink
          ? users.prevLink + `&filterValue=${filterValue}`
          : users.prevLink;

      users.nextLink =
        filterValue && users.nextLink
          ? users.nextLink + `&filterValue=${filterValue}`
          : users.nextLink;

      users.rows = users.rows.map(
        (user) =>
          new UserDto(
            user.id,
            user.first_name,
            user.last_name,
            user.email,
            user.role,
            user.url_profile_photo
          )
      );

      return users;
    } catch (error) {
      throw error;
    }
  }

  async create(object) {
    try {
      const foundUser = await this.getByFilter({
        where: {
          email: object.email,
        },
      });

      this.validateUserAlreadyExists(foundUser);

      const createdUser = await super.create(object);

      await CartService.create({
        userId: createdUser.id,
      });

      const userDto = new UserDto(
        createdUser.id,
        createdUser.first_name,
        createdUser.last_name,
        createdUser.email,
        createdUser.role,
        createdUser.url_profile_photo
      );

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async validateUserAlreadyExists(foundUser) {
    if (foundUser) {
      throw new errors.USER_ALREADY_EXISTS();
    }
  }

  async updateById(id, object) {
    try {
      const foundUser = await this.getById(id);

      if (object.profile_public_id) {
        await deleteFileInCloud(foundUser.profile_public_id);
      }

      return super.updateById(id, object);
    } catch (error) {
      throw error;
    }
  }

  async login(object) {
    try {
      const foundUser = await this.getByFilter({
        where: {
          email: object.email,
        },
      });

      this.validateCredentials(foundUser, object.password);

      this.validateLoginMethod(foundUser);

      foundUser.last_connection = new Date();

      await foundUser.save();

      const userDto = new UserDto(
        foundUser.id,
        foundUser.first_name,
        foundUser.last_name,
        foundUser.email,
        foundUser.role,
        foundUser.url_profile_photo
      );

      const response = {
        token: await generateToken({ id: foundUser.id }),
        user: userDto,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  validateLoginMethod(user) {
    if (user.oauthuser) {
      throw new errors.BAD_LOGIN_METHOD();
    }
  }

  async validateCredentials(user, password) {
    if (!user || !(await matchPasswords(password, user.password))) {
      throw new errors.EMAIL_OR_PASSWORD_WRONG();
    }
  }

  async forgotPassword(email) {
    try {
      const foundUser = await this.getByFilter({
        where: {
          email: email,
        },
      });

      this.validateUserToChangePassword(foundUser);

      const resetPasswordToken = createUniqueToken();

      const actualTime = new Date().getTime();

      const plusOneHour = 1000 * 60 * 60;

      const resetPasswordTokenExpiration = new Date(actualTime + plusOneHour);

      this.deleteResetPasswordToken(foundUser.id);

      await AuthService.create({
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpiration: resetPasswordTokenExpiration,
        userId: foundUser.id,
      });

      const resetPasswordUrl = `${config.URL_FRONTEND}/resetPassword/${resetPasswordToken}`;

      const emailBody = `
        <h1>Reset password</h1>
        <p>To reset your password click the following link (<span style="color:red;">IMPORTANT</span>: You only have ten minutes until expiration): </p>
        <a href='${resetPasswordUrl}' rel='noreferrer' referrerpolicy='origin' clicktracking='off'>Change your password</a>
      `;

      sendEmail({
        to: email,
        subject: 'Password Reset Requested',
        html: emailBody,
      });
    } catch (error) {
      throw error;
    }
  }

  validateUserToChangePassword(user) {
    if (!user || user.oauthuser) {
      throw new errors.USER_NOT_FOUND();
    }
  }

  async deleteResetPasswordToken(user_id) {
    try {
      await AuthService.deleteByFilter({
        where: {
          userId: user_id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const foundToken = await AuthService.getByFilter({
        where: {
          resetPasswordToken: token,
        },
      });

      this.validateResetPasswordToken(foundToken);

      this.validateResetPasswordTokenExpiration(
        foundToken.resetPasswordTokenExpiration
      );

      await this.validateSamePassword(foundToken, newPassword);

      await this.updateById(foundToken.userId, { password: newPassword });

      await foundToken.destroy();
    } catch (error) {
      throw error;
    }
  }

  async validateSamePassword(token, password) {
    try {
      const foundUser = await this.getById(token.userId);

      if (foundUser && (await matchPasswords(password, foundUser.password))) {
        throw new errors.SAME_PASSWORD();
      }
    } catch (error) {
      throw error;
    }
  }

  validateResetPasswordTokenExpiration(expiration) {
    if (new Date() > expiration) {
      throw new errors.RESET_PASSWORD_TOKEN_EXPIRED();
    }
  }

  validateResetPasswordToken(token) {
    if (!token) {
      throw new errors.INVALID_RESET_PASSWORD_TOKEN();
    }
  }

  async deleteById(id) {
    try {
      await CartService.deleteByFilter({
        where: {
          userId: id,
        },
      });

      return await super.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  async changeRole(id, actualUser) {
    try {
      const foundUser = await this.getById(id);

      this.validateUserExists(foundUser);

      if (foundUser.role === 'USER' && actualUser.role != 'ADMIN') {
        await this.validateCorrectDocumentation(foundUser.id);
      }

      this.updateById(id, {
        role: foundUser.role === 'USER' ? 'ADMIN' : 'USER',
      });
    } catch (error) {
      throw error;
    }
  }

  async validateCorrectDocumentation(id) {
    const validNames = [
      'Identificacion',
      'Comprobante de domicilio',
      'Comprobante de estado de cuenta',
    ];

    const foundDocumentation = await DocumentService.getAll({
      where: {
        name: {
          [Op.in]: validNames,
        },
        userId: id,
      },
    });

    const documentsNames = foundDocumentation.map((document) => document.name);

    const intersectedNames = _.intersection(documentsNames, validNames);

    if (!_.isEqual(intersectedNames.sort(), validNames.sort())) {
      const missingDocuments = _.difference(validNames, documentsNames);

      throw new errors.MISSING_DOCUMENTATION_ERROR(missingDocuments);
    }
  }

  validateUserExists(user) {
    if (!user) {
      throw new errors.USER_NOT_FOUND();
    }
  }

  async uploadDocument(id, document) {
    try {
      document = { ...document, userId: id };
      await DocumentService.create(document);
    } catch (error) {
      await deleteFileInCloud(document.public_id);
      throw error;
    }
  }
}

export default new UserService();
