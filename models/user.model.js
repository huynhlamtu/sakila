const db = require("../utils/db");
const { USER_TBL } = require("../config/db.json");

module.exports = {
  all() {
    return db(USER_TBL);
  },

  async single(id) {
    const users = await db(USER_TBL).where("id", id);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async singleByUsername(username) {
    const users = await db(USER_TBL).where("username", username);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  add(user) {
    return db(USER_TBL).insert(user);
  },
};
