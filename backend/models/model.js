const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"] // Example enum for gender options
  },
  styles: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 3; // Ensure no more than 3 styles are selected
      },
      message: props => `${props.value} exceeds the limit of 3 styles`
    }
  },
  Photo: {
    type: String
  },
  followers: [{ type: ObjectId, ref: "USER" }],
  following: [{ type: ObjectId, ref: "USER" }],
  catches: [{ type: ObjectId, ref: "POST" }],
  badges: [{ type: String }]
});

mongoose.model("USER", userSchema);
