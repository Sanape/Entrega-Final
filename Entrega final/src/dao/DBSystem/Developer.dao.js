import {Developer} from "../../models/developer.js";
import BaseDao from "./Base.dao.js";

class DeveloperDao extends BaseDao {
  constructor() {
    super(Developer);
  }
}

export default new DeveloperDao();
