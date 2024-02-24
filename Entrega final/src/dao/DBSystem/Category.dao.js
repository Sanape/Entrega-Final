import {Category} from "../../models/category.js";
import BaseDao from "./Base.dao.js";

class CategoryDao extends BaseDao {
  constructor() {
    super(Category);
  }
}

export default new CategoryDao();
