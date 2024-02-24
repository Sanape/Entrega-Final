import { Cart } from '../../models/cart.js';
import BaseDao from './Base.dao.js';

class CartDao extends BaseDao {
  constructor() {
    super(Cart);
  }
}

export default new CartDao();
