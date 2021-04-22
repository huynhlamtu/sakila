const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const router = express.Router();
const randomstring = require("randomstring");
const customerModel = require("../models/customer.model");

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
  const refreshToken = randomstring.generate(80);

  await userModel.patchRFToken(user.id, refreshToken);

  return res.json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
});

router.post("/refresh", async (req, res) => {
  const { accessToken, refreshToken } = req.body;

  const { userId } = jwt.verify(accessToken, "SECRET_KEY", {
    ignoreExpiration: true,
  });

  const ret = await userModel.isValidRFToken(userId, refreshToken);

  if (ret === true) {
    const newAccessToken = jwt.sign({ userId }, "SECRET_KEY", {
      expiresIn: 60 * 10,
    });

    return res.json({
      accessToken: newAccessToken,
    });
  }

  return res.status(400).json({
    message: "Refresh token is revoked!",
  });
});

router.get("/", async (req, res) => {
  const list = await customerModel.all();
  res.json(list);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id || 0;
  const customer = await customerModel.single(id);
  if (customer === null) {
    return res.status(204).end();
  }

  res.json(customer);
});

module.exports = router;
