import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import './HomeT.css';

const initialDb = [
  {
    name: 'Smiling woman1',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  },
  {
    name: 'Smiling woman2',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  },
  {
    name: 'Smiling woman3',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  },
  {
    name: 'Smiling woman4',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  },
  {
    name: 'Smiling woman5',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  },
  {
    name: 'Smiling woman6',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  },
  {
    name: 'Smiling woman7',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
  }
];

function Home() {
  const [db, setDb] = useState(initialDb);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef()),
    [db.length]
  );

  const canSwipe = currentIndex < db.length && currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
    
    setDb((prevDb) => prevDb.filter((_, i) => i !== idx));
    if (currentIndex === db.length - 1) {
        setCurrentIndex(-1) ;// Set index to -1 when all cards are swiped
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

  return (
    <div className="Home">
      <div className="Competitions">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Myntra_logo.png" alt="Myntra Logo" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Myntra_logo.png" alt="Myntra Logo" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Myntra_logo.png" alt="Myntra Logo" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Myntra_logo.png" alt="Myntra Logo" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Myntra_logo.png" alt="Myntra Logo" />
      </div>
      <div className="cardContainer">
        {!showCards ? (
          <button onClick={handleGetStarted} className="getStartedButton">
            Get Started
          </button>
        ) : (
          <>
            {currentIndex >= 0 && db[currentIndex] ? (
              <TinderCard
                ref={childRefs[currentIndex]}
                className="swipe"
                key={db[currentIndex].name}
                onSwipe={(dir) => swiped(dir, db[currentIndex].name, currentIndex)}
                onCardLeftScreen={() => outOfFrame(db[currentIndex].name, currentIndex)}
              >
                <div className="card">
                  <div className="ProfilePic">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956" alt="Profile" />
                    <h3>{db[currentIndex].name}</h3>
                    <button>Follow</button>
                  </div>
                  <div className="cardImage">
                    <img src={db[currentIndex].url} alt={db[currentIndex].name} />
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
          You swiped {lastDirection}
        </h2>
      )}
    </div>
  );
}

export default Home;
