import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState([]);
  const navigate = useNavigate()

  // Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)


  useEffect(() => {

    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo) {
      setUser(userInfo);
    }

    // saving post to mongodb
    if (url) {

      fetch("http://localhost:5000/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          body,
          pic: url,
          tags: tagList
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            notifyA(data.error)
          } else {
            notifyB("Successfully Posted")
            navigate("/")
          }
        })
        .catch(err => console.log(err))
    }

  }, [url])


  // posting image to cloudinary
  const postDetails = () => {

    console.log(body, image)
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name", "cantacloud2")
    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.log(err))
    console.log(url)

  }


  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };


   // Function to add tags
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tags.trim() !== "") {
      setTagList([...tagList, tags.trim()]);
      setTags(""); 
    }
  };

  // Function to remove tags
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tagList.filter(tag => tag !== tagToRemove);
    setTagList(updatedTags);
  };


  return (
    <div className="createPost">
      {/* //header */}
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        <button id="post-btn" onClick={() => { postDetails() }}>Share</button>
      </div>
      {/* image preview */}
      <div className="main-div">
        <img
          id="output"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            loadfile(event);
            setImage(event.target.files[0])
          }}
        />
      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src={user?.Photo || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"}
              alt=""
            />
          </div>
          <h5>{user?.name || "User"}</h5>
        </div>
        <textarea value={body} onChange={(e) => {
          setBody(e.target.value)
        }} type="text" placeholder="Write a caption...."></textarea>

        {/* Tags input */}
        <div className="tags-input">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (press Enter to add)"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTag(e);
              }
            }}
          />
          {/* Display tags */}
          <div className="tags-list">
            {tagList.map((tag, index) => (
              <div key={index} className="tag">
                <div className="tags-list-content"> {tag} </div>
                <button className="remove-tag" onClick={() => handleRemoveTag(tag)}>x</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
