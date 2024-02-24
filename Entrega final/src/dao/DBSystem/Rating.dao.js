import BaseDao from "./Base.dao.js";
import {Rating} from "../../models/rating.js";


class RatingDao extends BaseDao {
  constructor() {
    super(Rating);
  }
}

export default new RatingDao();
