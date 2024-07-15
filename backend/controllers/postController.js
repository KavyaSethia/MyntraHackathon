const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const requireLogin = require("../middleware/requireLogin");

router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic, tags, myntraLinks } = req.body;

  // Log received data
  console.log("Received Data:");
  console.log("Body:", body);
  console.log("Pic:", pic);
  console.log("Tags:", tags);
  console.log("Myntra Links:", myntraLinks);

  if (!body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  req.user.password = undefined; // removing password from the user object

  const post = new POST({
    body,
    photo: pic,
    tags,
    myntraLinks,
    postedBy: req.user,
  });

  // Log the post object before saving
  console.log("Post Object to be Saved:", post);

  post.save()
    .then(result => {
      console.log("Post Saved:", result); // Log the saved post
      res.json({ post: result });
    })
    .catch(err => {
      console.log("Error Saving Post:", err);
    });
});

module.exports = router;
