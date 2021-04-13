const express = require("express");
const paginate = require("./../utils/pagination");
const { FILM_TBL } = require("../config/db.json");
const filmModel = require("../models/film.model");

const router = express.Router();

router.get("/", async function (req, res) {
  // const list = await filmModel.all();
  // res.json(list);
  const current_page = +req.query.page || 1;
  const data = await paginate(current_page, FILM_TBL);
  res.json(data);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const film = await filmModel.single(id);
  if (film === null) {
    return res.status(204).end();
  }

  greeting(id);

  res.json(film);
});

const greeting = (id) => {
  console.log("Hello ", id);
};

const schema = require("../schemas/film.json");
router.post(
  "/",
  require("../middlewares/validate.mdw")(schema),
  async function (req, res) {
    const film = req.body;
    const ids = await filmModel.add(film);
    film.film_id = ids[0];
    res.status(201).json(film);
  }
);

router.delete("/:id", function (req, res) {});

module.exports = router;
