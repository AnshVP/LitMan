const expr = require("express");
const router = expr.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const { default: mongoose } = require("mongoose");
const axios = require("axios");

const JWT_SECRET = "heyansh";

router.get("/", fetchuser, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  console.log(keyword);

  const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
  res.send(users);
});
// creating user
router.post(
  "/createuser",
  [
    body("name", "Username must have atleast 3 characters").isLength({
      min: 3,
    }),
    body("email", "Invalid Email").isEmail(),
    body("password", "Password must have atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.find({
        $or: [
          { email: req.body.email.toLowerCase() },
          { name: req.body.name.toLowerCase() },
        ],
      });

      if (user.length !== 0) {
        success = false;
        return res.status(400).json({
          success,
          msg: "User with this email or name already exists",
        });
      }

      const salt = await bcryptjs.genSalt(10);
      const secPass = await bcryptjs.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name.toLowerCase(),
        password: secPass,
        email: req.body.email.toLowerCase(),
        role: req.body.role
      });

      var user_data = {
        username: user.name,
        secret: user._id,
        email: user.email,
        first_name: user.name
      };

      var config = {
        method: "post",
        url: "https://api.chatengine.io/users/",
        headers: {
          "PRIVATE-KEY": "a1936ee1-059e-45ec-8da9-fa213a6e1984",
        },
        data: user_data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Internal Server Error occured!!");
    }
  }
);

// login
router.post(
  "/login",
  [
    body("name", "Invalid User").exists(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      const { name, password } = req.body;
      let user = await User.findOne({ name: name });
      if (!user) {
        success = false;
        return res.status(400).json({ success, msg: "Wrong Credentials!!" });
      }

      let comparePassword = await bcryptjs.compare(password, user.password);
      if (!comparePassword) {
        success = false;
        return res.status(400).json({ success, msg: "Wrong Credentials!!" });
      }

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Internal Server Error occured!!");
    }
  }
);

// Getdata
router.get("/getdata", fetchuser, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id)
      .select("-password")
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Internal Server Error occured!!");
  }
});

module.exports = router;
