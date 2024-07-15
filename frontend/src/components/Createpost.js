import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState([]);
  const [myntraLink, setMyntraLink] = useState("");
  const [myntraLinks, setMyntraLinks] = useState([]);
  const [selectedTagOption, setSelectedTagOption] = useState("");
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo) {
      setUser(userInfo);
    }

    if (url) {
      console.log("Myntra Links before API call:", myntraLinks);
      fetch("http://localhost:5000/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
          tags: tagList,
          myntraLinks,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB("Successfully Posted");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url, myntraLinks, tagList, body]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");
    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tagList.filter((tag) => tag !== tagToRemove);
    setTagList(updatedTags);
  };

  const handleAddMyntraLink = (e) => {
    e.preventDefault();
    if (myntraLink.trim() !== "") {
      setMyntraLinks([...myntraLinks, myntraLink.trim()]);
      setMyntraLink("");
    }
  };

  const handleRemoveMyntraLink = (linkToRemove) => {
    const updatedLinks = myntraLinks.filter((link) => link !== linkToRemove);
    setMyntraLinks(updatedLinks);
  };

  const handleSelectTagOption = (e) => {
    setSelectedTagOption(e.target.value);
  };

  const handleAddSelectedTag = () => {
    if (selectedTagOption) {
      setTagList([...tagList, selectedTagOption]);
      setSelectedTagOption(""); // Clear selected option after adding
    }
  };

  return (
    <div className="UsedPage">
      <h3 style={{ margin: "15px auto" }}>Create New Post</h3>
      <div className="createPost">
        <div className="post-header">
          <div className="card-header">
            <div className="card-pic">
              <img 
                src={
                  user?.Photo ||
                  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                }
                alt=""
              />
            </div>
            <h5>{user?.name || "User"}</h5>
          </div>
          <button id="post-btn" onClick={() => postDetails()}>
            Share
          </button>
        </div>
        <div className="main-div">
          <img
            id="output"
            src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
            alt=""
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              loadfile(event);
              setImage(event.target.files[0]);
            }}
          />
        </div>
        <div className="details">
          <div className="captionTextBox">
          <h4 style={{textAlign:"left",margin:"5px" }}>Caption</h4>

            <textarea
              style={{height:"45px" }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              type="text"
              placeholder="Write a caption...."
            ></textarea>
          </div>

          <div className="links-input">
            <h4 style={{ marginTop: "10px",marginBottom:"5px", }}>Myntra Product Link</h4>
            <input
              type="text"
              value={myntraLink}
              onChange={(e) => setMyntraLink(e.target.value)}
              placeholder="Add Myntra product link (press Enter to add)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddMyntraLink(e);
                }
              }}
            />
            <div className="links-list">
              {myntraLinks.map((link, index) => (
                <div key={index} className="link">
                  <div className="links-list-content">{link}</div>
                  <button
                    className="remove-link"
                    onClick={() => handleRemoveMyntraLink(link)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="tags-input">
            <h4 style={{ marginTop: "10px",marginBottom:"5px", }}>Picture's Style</h4>

            <select
              value={selectedTagOption}
              onChange={handleSelectTagOption}
              className="tag-select"
            >
              <option value="">Select Photo's Style</option>
              <option value="Bohemian (Boho)">Bohemian (Boho)</option>
              <option value="Casual Chic">Casual Chic</option>
              <option value="Classic">Classic</option>
              <option value="Streetwear">Streetwear</option>
              <option value="Romantic">Romantic</option>
              <option value="Vintage">Vintage</option>
              <option value="Formal">Formal</option>
              <option value="Athleisure">Athleisure</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Gothic">Gothic</option>
              <option value="SwimWear">SwimWear</option>
              <option value="Retro">Retro</option>
              <option value="Techwear">Techwear</option>
              <option value="Hipster">Hipster</option>
              <option value="MensWear">MensWear</option>
              <option value="WomensWear">WomensWear</option>
              <option value="BabiesWear">BabiesWear</option>
            </select>
            <button className="add-selected-tag" onClick={handleAddSelectedTag}>
              Add Tag
            </button>
            <div className="tags-list">
              {tagList.map((tag, index) => (
                <div key={index} className="tag">
                  <div className="tags-list-content">{tag}</div>
                  <div className="tick">&#10004;</div>
                  <button
                    className="remove-tag"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
