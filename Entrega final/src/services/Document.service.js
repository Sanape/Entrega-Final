import DocumentDao from "../dao/DBSystem/Document.dao.js";
import BaseService from "./Base.service.js";
import { errors } from "../utils/errorDictionary.js";

class DocumentService extends BaseService {
  constructor() {
    super(DocumentDao);
  }

  async create(object) {
    try {
      this.validateName(object.name);

      const documentFounded = await this.getByFilter({
        where: {
          name: object.name,
          userId: object.userId,
        },
      });

      if (documentFounded) {
        await this.updateById(documentFounded.id, object);
        return documentFounded;
      } else {
        const createdObject = await this.dao.create(object);
        return createdObject;
      }
    } catch (error) {
      throw error;
    }
  }

  validateName(name) {
    const validNames = [
      "Identificacion",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];

    console.log(name);

    if (!name || !validNames.includes(name)) {
      throw new errors.INVALID_DOCUMENT_NAME_ERROR();
    }
  }
}

export default new DocumentService();
