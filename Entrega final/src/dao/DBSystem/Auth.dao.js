import BaseDao from './Base.dao.js';
import { Auth } from '../../models/auth.js';

class AuthDao extends BaseDao {
  constructor() {
    super(Auth);
  }
}

export default new AuthDao();
