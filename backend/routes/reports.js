const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Report = require("../models/Report");
const { body, validationResult } = require("express-validator");

router.get("/fetchallreports", fetchuser, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("postedBy", "_id name profilePic")
      .populate("severity", "name")
      .populate("comments.userId", "name");
    res.json(reports);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/fetchmyreports", fetchuser, async (req, res) => {
  try {
    const reports = await Report.find({ postedBy: req.user.id })
      .populate("postedBy", "_id name profilePic")
      .populate("severity", "name")
      .populate("comments.userId", "name");
    res.json(reports);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/createreport",
  fetchuser,
  [
    body("description", "Description may not be empty").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const { photo, description, location, postedOn, status } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const report = new Report({
        location,
        description,
        photo,
        postedOn,
        status,
        postedBy: req.user.id,
      });
      const savedReport = await report.save();
      res.json(savedReport);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.put("/severity", fetchuser, async (req, res) => {
  const { reportId } = req.body;
  try {
    let report = await Report.find({ _id: reportId, likes: req.user.id });
    if (report.length === 0) {
      report = await Report.findByIdAndUpdate(
        reportId,
        { $push: { severity: req.user.id } },
        { new: true }
      );
      return res.json(report);
    } else {
      report = await Report.findByIdAndUpdate(
        reportId,
        { $pull: { severity: req.user.id } },
        { new: true }
      );
      return res.json(report);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/addcomment", fetchuser, async (req, res) => {
  const { reportId, comment } = req.body;
  try {
    let report = await Report.findByIdAndUpdate(
      reportId,
      { $push: { comments: { userId: req.user.id, comment: comment } } },
      { new: true }
    );
    console.log(report);
    res.json(report);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/deletereport/:id", fetchuser, async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (report.postedBy.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    report = await Report.findByIdAndDelete(req.params.id);
    res.json({ Success: "Report has been deleted", report: report });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
