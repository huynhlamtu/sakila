const jwt = require("jsonwebtoken");

module.exports = (req, res, nex) => {
  const accessToken = req.headers["x-access-token"];
  if (accessToken) {
    const decoded = jwt.verify(accessToken, "SECRET_KEY");
  } else {
    return res.status(400).json({
      message: "Access token not found",
    });
  }
};
