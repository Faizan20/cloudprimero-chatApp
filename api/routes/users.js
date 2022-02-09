const User = require("../models/User");
const { authenticateToken } = require("../helpers/auth")
const router = require("express").Router();
const bcrypt = require("bcrypt");

//get a user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.find();
    res.status(200).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
