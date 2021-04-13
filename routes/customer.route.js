const express = require("express");
const customerModel = require("../models/customer.model");

const router = express.Router();

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
