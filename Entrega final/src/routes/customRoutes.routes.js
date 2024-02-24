import express from 'express';
import logger from '../utils/winston.config.js';

const router = express.Router();

router.get('/loggerTest', (req, res) => {
  logger.debug('Debugging');
  logger.http('Http consulting');
  logger.info('Informing');
  logger.warning('Warning');
  logger.error('Error happening');
  logger.fatal('Dying');
  res.send('Testing logger');
});

export default router;
