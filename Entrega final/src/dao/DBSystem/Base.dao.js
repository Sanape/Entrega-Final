class BaseDao {
  constructor(model) {
    this.model = model;
  }

  async create(object) {
    try {
      const createdObject = await this.model.create(object);

      return createdObject;
    } catch (error) {
      throw error;
    }
  }

  async getAll(filter) {
    try {
      const foundObjects = await this.model.findAll(filter);

      return foundObjects;
    } catch (error) {
      throw error;
    }
  }

  async getByFilter(filter) {
    try {
      const foundObject = await this.model.findOne(filter);

      return foundObject;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const foundObject = await this.model.findByPk(id);

      return foundObject;
    } catch (error) {
      throw error;
    }
  }

  async updateById(id, object) {
    try {
      const updatedObject = await this.updateByFilter(object, {
        where: {
          id: id,
        },
      });

      return updatedObject;
    } catch (error) {
      throw error;
    }
  }

  async updateByFilter(object, filter) {
    try {
      const updatedObject = await this.model.update(object, filter);

      return updatedObject;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const deletedObject = await this.deleteByFilter({
        where: {
          id: id,
        },
        individualHooks: true,
      });

      return deletedObject;
    } catch (error) {
      throw error;
    }
  }

  async deleteByFilter(filter) {
    try {
      const deletedObject = await this.model.destroy(filter);

      return deletedObject;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseDao;
