import React, { useState } from "react";
import logo from "../img/logo.png";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(""); // State for gender
  const [selectedStyles, setSelectedStyles] = useState([]); // State for selected styles

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const handleSubmit = () => {
    // Validation checks
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    }
    if (!passRegex.test(password)) {
      notifyA("Password must contain at least 8 characters, including at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character");
      return;
    }
    if (selectedStyles.length > 3) {
      notifyA("You can select up to 3 styles");
      return;
    }

    // Prepare data to send to backend
    const userData = {
      name,
      email,
      userName,
      password,
      gender,
      styles: selectedStyles
    };

    // Example: Send userData to backend endpoint (adjust URL as per your backend setup)
    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        notifyA(data.error);
      } else {
        notifyB(data.message);
        navigate("/signin");
      }
    })
    .catch(err => {
      console.log(err);
      notifyA("Failed to sign up");
    });
  };

  const handleStyleSelection = (style) => {
    // Check if style already selected
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style)); // Deselect style
    } else if (selectedStyles.length < 3) {
      setSelectedStyles([...selectedStyles, style]); // Select style if less than 3 selected
    } else {
      notifyA("You can select up to 3 styles");
    }
  };

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="" />
          <p className="loginPara">
            Sign up to get fashion inspiration <br /> and stylish updates.
          </p>
          <div>
            <input type="email" name="email" id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <input type="text" name="name" id="name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <input type="text" name="username" id="username" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="gender-select">
            <label style={{margin:"5px"}}>Gender:</label>
            <div className="circular-checkboxes">
              <label className="circular-checkbox">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="checkmark"></span>
                Male
              </label>
              <label className="circular-checkbox">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="checkmark"></span>
                Female
              </label>
              <label className="circular-checkbox">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="checkmark"></span>
                Other
              </label>
            </div>
          </div>
          <div className="style-select">
            <label style={{marginBottom:"10px"}}>What's your Style? (Pick up to 3 styles)</label>
            <div className="style-options">
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Bohemian")} onChange={() => handleStyleSelection("Bohemian")} />
                <span>Bohemian</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Casual Chic")} onChange={() => handleStyleSelection("Casual Chic")} />
                <span>Casual </span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Classic")} onChange={() => handleStyleSelection("Classic")} />
                <span>Classic</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Streetwear")} onChange={() => handleStyleSelection("Streetwear")} />
                <span>Streetwear</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Romantic")} onChange={() => handleStyleSelection("Romantic")} />
                <span>Romantic</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Vintage")} onChange={() => handleStyleSelection("Vintage")} />
                <span>Vintage</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Formal")} onChange={() => handleStyleSelection("Formal")} />
                <span>Formal</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Athleisure")} onChange={() => handleStyleSelection("Athleisure")} />
                <span>Athleisure</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Minimalist")} onChange={() => handleStyleSelection("Minimalist")} />
                <span>Minimalist</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Gothic")} onChange={() => handleStyleSelection("Gothic")} />
                <span>Gothic</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("SwimWear")} onChange={() => handleStyleSelection("SwimWear")} />
                <span>SwimWear</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Retro")} onChange={() => handleStyleSelection("Retro")} />
                <span>Retro</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Techwear")} onChange={() => handleStyleSelection("Techwear")} />
                <span>Techwear</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("Hipster")} onChange={() => handleStyleSelection("Hipster")} />
                <span>Hipster</span>
              </label>
              <label>
                <input type="checkbox" checked={selectedStyles.includes("MensWear")} onChange={() => handleStyleSelection("MensWear")} />
                <span>MensWear</span>
              </label>
            </div>
          </div>
          <p className="loginPara" style={{ fontSize: "12px", margin: "3px 0px" }}>
            By signing up, you agree to out Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input type="submit" id="submit-btn" value="Sign Up" onClick={handleSubmit} />
        </div>
        <div className="form2">
          Already have an account ?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
