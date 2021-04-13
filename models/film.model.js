const db = require("../utils/db");
const { FILM_TBL } = require("../config/db.json");

module.exports = {
  all() {
    return db(FILM_TBL);
  },

  async single(id) {
    const films = await db(FILM_TBL).where("film_id", id);
    if (films.length === 0) {
      return null;
    }

    return films[0];
  },

  add(film) {
    return db(FILM_TBL).insert(film);
  },
};
