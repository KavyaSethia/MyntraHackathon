const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const { route } = require("./auth");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");

// Route
router.get("/allposts", requireLogin, (req, res) => {
    POST.find()
        .populate("postedBy", "_id name Photo")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
})

router.post("/createPost", requireLogin, (req, res) => {
    const { body, pic, tags, myntraLinks } = req.body;

    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    const post = new POST({
        body,
        photo: pic,
        tags,
        myntraLinks, // Ensure myntraLinks are included in the post creation
        postedBy: req.user
    });

    post.save()
        .then((result) => {
            res.json({ post: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to create post" });
        });
});

router.get("/myposts", requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(myposts => {
            res.json(myposts)
        })
})

router.put("/like", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id }
  }, { new: true })
    .populate("postedBy", "_id name Photo")
    .exec((err, result) => {
      if (err) {
        console.log("Error updating post with like:", err);
        return res.status(422).json({ error: err });
      }

      USER.findByIdAndUpdate(req.user._id, {
        $push: { catches: req.body.postId }
      }, { new: true })
        .then(userResult => res.json(result))
        .catch(err => {
          console.log("Error updating user with like:", err);
          res.status(422).json({ error: err });
        });
    });
});

// Unlike a post
router.put("/unlike", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(req.body.postId, {
    $pull: { likes: req.user._id }
  }, { new: true })
    .populate("postedBy", "_id name Photo")
    .exec((err, result) => {
      if (err) {
        console.log("Error updating post with unlike:", err);
        return res.status(422).json({ error: err });
      }

      USER.findByIdAndUpdate(req.user._id, {
        $pull: { catches: req.body.postId }
      }, { new: true })
        .then(userResult => res.json(result))
        .catch(err => {
          console.log("Error updating user with unlike:", err);
          res.status(422).json({ error: err });
        });
    });
});

router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        comment: req.body.text,
        postedBy: req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name Photo")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

// Api to delete post
router.delete("/deletePost/:postId", requireLogin, (req, res) => {
    POST.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }

            if (post.postedBy._id.toString() == req.user._id.toString()) {

                post.remove()
                    .then(result => {
                        return res.json({ message: "Successfully deleted" })
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
})

// to show following post
router.get("/myfollwingpost", requireLogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name Photo")
        .populate("comments.postedBy", "_id name Photo")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => { console.log(err) })
})


//swipe
router.put("/swipe", requireLogin, async (req, res) => {
  const { postId, action } = req.body;
  
  try {
    const post = await POST.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.totalviews += 1;
    
    if (action === "catch") {
      post.catches += 1;
      await post.save();

      await USER.findByIdAndUpdate(req.user._id, {
        $addToSet: { catches: postId }
      }, { new: true });
    } else if (action === "drop") {
      await post.save();
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    res.json({ message: "Swipe action recorded successfully", post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router