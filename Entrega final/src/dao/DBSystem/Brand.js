import { Brand } from '../../models/brand.js';
import BaseDao from './Base.dao.js';

class BrandDao extends BaseDao {
  constructor() {
    super(Brand);
  }
}

export default new BrandDao();
