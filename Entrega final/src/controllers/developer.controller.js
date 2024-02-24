import { Op } from 'sequelize';
import developerService from '../services/Developer.service.js';
import { customResponse } from '../utils/utils.js';

async function getDevelopers(req, res, next) {
  try {
    const { keyword } = req.query;

    let searchCriteria;

    if (keyword) {
      searchCriteria = {
        where: {
          developer_name: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      };
    }

    const result = await developerService.getAll(searchCriteria);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function getDeveloper(req, res, next) {
  try {
    const { did } = req.params;

    const result = await developerService.getById(did);

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function updateDeveloper(req, res, next) {
  try {
    const { did } = req.params;

    if (req.file) {
      req.body = {
        ...req.body,
        ...{
          url_logo_developer: req.file.url,
          logo_developer_public_id: req.file.publicId,
        },
      };
    }

    await developerService.updateById(did, req.body);

    return customResponse(res, 200, 'Developer updated successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteDeveloper(req, res, next) {
  try {
    const { did } = req.params;

    await developerService.deleteById(did); //cuidado con la cascada

    return customResponse(res, 200, 'Developer deleted successfully');
  } catch (error) {
    next(error);
  }
}

async function createDeveloper(req, res, next) {
  try {
    await developerService.create(req.body);

    return customResponse(res, 200, 'Developer created successfully');
  } catch (error) {
    next(error);
  }
}

export {
  getDevelopers,
  getDeveloper,
  createDeveloper,
  deleteDeveloper,
  updateDeveloper,
};
