const expr = require("express");
const router = expr.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

//getallUser
router.get("/getallusers", fetchuser, async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .populate("followers", "_id name")
      .populate("followings", "_id name")
      .populate("requests", "_id name")
      .populate("requested", "_id name");

    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Internal Server Error occured!!");
  }
});

router.put("/editprofile", fetchuser, async (req, res) => {
  try {
    const { profilePic } = req.body;
    const profile = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePic: profilePic } },
      { new: true }
    );
    res.send(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Internal Server Error occured!!");
  }
});

module.exports = router;
