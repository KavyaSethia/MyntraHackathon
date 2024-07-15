import React, { useState, useEffect, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import './HomeT.css';
import icon from '../img/icon.png';

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const [followStatus, setFollowStatus] = useState({}); // To manage follow status for each user
  const currentIndexRef = useRef(currentIndex);

  // Fetch posts from the server
  useEffect(() => {
    fetch("http://localhost:5000/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPosts(result); // Assuming result is an array of posts

        // Initialize follow status for each user
        const initialFollowStatus = {};
        result.forEach((post) => {
          initialFollowStatus[post.postedBy._id] = post.postedBy.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          );
        });
        setFollowStatus(initialFollowStatus);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);

  const childRefs = useMemo(
    () =>
      Array(posts.length)
        .fill(0)
        .map(() => React.createRef()),
    [posts.length]
  );

  const canSwipe = currentIndex < posts.length && currentIndex >= 0;

  const swiped = (direction, post, index) => {
    
    const action = direction == "right" ? "catch" : "drop";
    setLastDirection(action);
    // Send swipe action to the server
    fetch("http://localhost:5000/swipe", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: post._id,
        action: action,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(`Post ${action}ed:`, result);
      })
      .catch((err) => {
        console.error(`Error ${action}ing post:`, err);
      });
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
    
    setPosts((prevPosts) => prevPosts.filter((_, i) => i !== idx));
    if (currentIndex === posts.length - 1) {
        setCurrentIndex(-1); // Set index to -1 when all cards are swiped
    } 
  };

  const swipe = async (dir) => {
    if (canSwipe) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleGetStarted = () => {
    setShowCards(true);
  };

  const followUser = (userId) => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [userId]: true,
        }));
      });
  };

  const unfollowUser = (userId) => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [userId]: false,
        }));
      });
  };

  return (
    <div className="Home">
      <div className="Competitions">
        <img src={icon} alt="Myntra Logo" />
        <img src={icon} alt="Myntra Logo" />
        <img src={icon} alt="Myntra Logo" />
        <img src={icon} alt="Myntra Logo" />
        <img src={icon} alt="Myntra Logo" />
        <img src={icon} alt="Myntra Logo" />
      </div>
      <div className="cardContainer">
        {!showCards ? (
          <button onClick={handleGetStarted} className="getStartedButton">
            Get Started
          </button>
        ) : (
          <>
            {currentIndex >= 0 && posts[currentIndex] ? (
              <TinderCard
                ref={childRefs[currentIndex]}
                className="swipe"
                key={posts[currentIndex]._id}
                onSwipe={(dir) => swiped(dir, posts[currentIndex], currentIndex)}
                onCardLeftScreen={() => outOfFrame(posts[currentIndex].body, currentIndex)}
              >
                
                  <div className="ProfilePic">
                    <img src={posts[currentIndex].postedBy.Photo} alt="Profile" />
                    <h3>{posts[currentIndex].postedBy.name}</h3>
                    <button
                      onClick={() => {
                        if (followStatus[posts[currentIndex].postedBy._id]) {
                          unfollowUser(posts[currentIndex].postedBy._id);
                        } else {
                          followUser(posts[currentIndex].postedBy._id);
                        }
                      }}
                    >
                      {followStatus[posts[currentIndex].postedBy._id] ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                  <div className="Card">
                    <div className="cardImage" >
                      <img style={{width: "auto",maxHeight: "400px",maxWidth:"350px"}} src={posts[currentIndex].photo} alt={posts[currentIndex].body} />
                    </div>
                  </div>
                
              </TinderCard>
            ) : (
              <h2>You have reached our last post!</h2>
            )}
          </>
        )}
      </div>
      <div className="buttonspace">
        <button className="mainButton" style={{ backgroundColor: !canSwipe ? '#c3c4d3' : null }} onClick={() => swipe('left')}>
          <span className="material-icons-outlined">swipe_left</span> Drop
        </button>
        <button className="mainButton" style={{ backgroundColor: '#007bff' }}>
          <span className="material-icons-outlined">checkroom</span> Get This Look
        </button>
        <button className="mainButton" style={{ backgroundColor: !canSwipe ? '#c3c4d3' : null }} onClick={() => swipe('right')}>
          <span className="material-icons-outlined">swipe_right</span> Catch
        </button>
      </div>
      {lastDirection && (
        
        <h2 key={lastDirection} className="infoText">
          It's a {lastDirection}
        </h2>
      )}
    </div>
  );
}

export default Home;
