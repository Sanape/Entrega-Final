import { User } from "../../models/user.js";
import BaseDao from "./Base.dao.js";
import { Op } from "sequelize";
import { errors } from "../../utils/errorDictionary.js";

class UserDao extends BaseDao {
  constructor() {
    super(User);
  }

  getSearchCriteria(filter, filterValue) {
    if (filter && !filterValue) {
      throw new errors.FILTER_NOT_PROVIDED();
    }

    switch (filter) {
      case "keyword":
        return {
          where: {
            [Op.or]: {
              first_name: { [Op.iLike]: `%${filterValue}%` },
              last_name: { [Op.iLike]: `%${filterValue}%` },
              email: { [Op.iLike]: `%${filterValue}%` },
            },
          },
        };

      case "role":
        return {
          where: {
            role: filterValue,
          },
        };

      default:
        return {};
    }
  }

  async getUsers(filter, filterValue, limit, page, sort, order) {
    try {
      let searchCriteria = {
        ...this.getSearchCriteria(filter, filterValue),
        offset: (page - 1) * limit,
        limit: limit,
      };

      if (sort && order) {
        searchCriteria = { ...searchCriteria, order: [[sort, order]] };
      }

      const foundObjects = await this.model.findAndCountAll(searchCriteria);

      return foundObjects;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserDao();
