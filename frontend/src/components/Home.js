import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }

    // Fetching all posts
    fetch("http://localhost:5000/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        // Handle error or notify user
      });
  }, [navigate]);

  // Toggle comment visibility
  const toggleComment = (posts) => {
    setShow((prevShow) => !prevShow);
    setItem(posts);
  };

  // Like a post
  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) =>
          prevData.map((post) => (post._id === result._id ? result : post))
        );
      })
      .catch((err) => {
        console.error("Error liking post:", err);
        // Handle error or notify user
      });
  };

  // Unlike a post
  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) =>
          prevData.map((post) => (post._id === result._id ? result : post))
        );
      })
      .catch((err) => {
        console.error("Error unliking post:", err);
        // Handle error or notify user
      });
  };

  // Make a comment on a post
  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) =>
          prevData.map((post) => (post._id === result._id ? result : post))
        );
        setComment("");
        notifyB("Comment posted");
      })
      .catch((err) => {
        console.error("Error making comment:", err);
        // Handle error or notify user
      });
  };

  return (
    <div className="home">
      {/* Render each post */}
      {data.map((post) => (
        <div className="card" key={post._id}>
          {/* Card header */}
          <div className="card-header">
            <div className="card-pic">
              <img
                src={post.postedBy.Photo || picLink}
                alt=""
              />
            </div>
            <h5>
              <Link to={`/profile/${post.postedBy._id}`}>
                {post.postedBy.name}
              </Link>
            </h5>
          </div>

          {/* Card image */}
          <div className="card-image">
            <img src={post.photo} alt="" />
          </div>

          {/* Card content */}
          <div className="card-content">
            {/* Like/unlike button */}
            <span
              className={`material-symbols-outlined ${
                post.likes.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                )
                  ? "material-symbols-outlined-red"
                  : ""
              }`}
              onClick={() =>
                post.likes.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                )
                  ? unlikePost(post._id)
                  : likePost(post._id)
              }
            >
              favorite
            </span>
            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
            <p
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => toggleComment(post)}
            >
              View all comments
            </p>
          </div>

          {/* Add comment section */}
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment"
              onClick={() => makeComment(comment, post._id)}
            >
              Post
            </button>
          </div>
        </div>
      ))}

      {/* Show comment section */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* Card header */}
              <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>

              {/* Comment section */}
              <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                {item.comments.map((comment) => (
                  <p className="comm" key={comment._id}>
                    <span className="commenter" style={{ fontWeight: "bolder" }}>
                      {comment.postedBy.name}
                    </span>{" "}
                    <span className="commentText">{comment.comment}</span>
                  </p>
                ))}
              </div>

              {/* Card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* Add comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="comment" onClick={() => {
                  makeComment(comment, item._id);
                  toggleComment();
                }}>
                  Post
                </button>
              </div>
            </div>
          </div>
          <div className="close-comment" onClick={() => toggleComment()}>
            <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
          </div>
        </div>
      )}
    </div>
  );
}
