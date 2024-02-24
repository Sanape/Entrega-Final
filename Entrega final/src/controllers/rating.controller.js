import ratingService from '../services/Rating.service.js';
import { customResponse } from '../utils/utils.js';
import logger from '../utils/winston.config.js';

async function rate(req, res, next) {
  try {
    const uid = req.user.id;

    req.body = { ...req.body, userId: uid };

    await ratingService.create(req.body);

    return customResponse(res, 201, 'Rating sent');
  } catch (error) {
    next(error);
  }
}

async function getRatingOfCurrentUser(req, res, next) {
  try {
    const uid = req.user.id;

    const result = await ratingService.getByFilter({
      where: {
        userId: uid,
      },
    });

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

async function getRecentRatings(req, res, next) {
  try {
    const result = await ratingService.getRecentRatings();

    return customResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
}

export { rate, getRecentRatings, getRatingOfCurrentUser };
