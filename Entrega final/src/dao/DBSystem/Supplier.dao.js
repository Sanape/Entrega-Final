import Supplier from '../../models/supplier.js';
import BaseDao from './Base.dao.js';
import { Op } from 'sequelize';

class SupplierDao extends BaseDao {
  constructor() {
    super(Supplier);
  }

  async getSupplierWithProductInStock(productId) {
    try {
      const suppliers = await this.model.findAll({
        include: [
          {
            model: Product,
            where: {
              id: productId,
              stock: { [Op.gt]: 0 },
            },
          },
        ],
      });

      return suppliers;
    } catch (error) {
      throw error;
    }
  }

  // async getSupplierWithDeliveryDates(id) {
  //   try {
  //     const supplier = await this.model.findByPk(id, {
  //       include: [{
  //         model: DeliveryDates, // Assuming DeliveryDates is the model for delivery dates
  //         as: 'deliveryDates',
  //       }],
  //     });

  //     return supplier;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default new SupplierDao();
