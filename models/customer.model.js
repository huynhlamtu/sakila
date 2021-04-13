const db = require("../utils/db");
const { CUSTOMER_TBL } = require("../config/db.json");

module.exports = {
  all() {
    return db(CUSTOMER_TBL);
  },

  async single(id) {
    const customers = await db(CUSTOMER_TBL).where("customer_id", id);
    if (customers.length === 0) {
      return null;
    }

    return customers[0];
  },

  add(customer) {
    return db(CUSTOMER_TBL).insert(customer);
  },
};
