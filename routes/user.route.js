const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const router = express.Router();

router.post("/", async (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  const ids = await userModel.add(user);
  user.id = ids[0];
  delete user.password;
  
  res.status(201).json(user);
});

router.get("/", async function (req, res) {
  const list = await customerModel.all();
  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const customer = await customerModel.single(id);
  if (customer === null) {
    return res.status(204).end();
  }

  res.json(customer);
});

module.exports = router;
