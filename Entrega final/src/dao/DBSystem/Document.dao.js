import BaseDao from "./Base.dao.js";
import { Document } from "../../models/document.js";

class DocumentDao extends BaseDao {
  constructor() {
    super(Document);
  }
}

export default new DocumentDao();
