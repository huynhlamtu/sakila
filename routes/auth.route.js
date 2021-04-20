const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const router = express.Router();

router.post("/", async (req, res) => {
  const user = await userModel.singleByUsername(req.body.username);

  if (user == null) {
    return res.json({
      authenticated: false,
    });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      authenticated: false,
    });
  }

  const payload = {
    userId: user.id,
  };

  const opts = {
    expiresIn: 60,
  };
  const accessToken = jwt.sign(payload, "SECRET_KEY", opts);
  const refreshToken = "";

  return res.json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
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
