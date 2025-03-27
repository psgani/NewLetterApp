// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   googleId: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   profilePic: { type: String },
// });

// module.exports = mongoose.model("User", UserSchema);


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },
  letters: [
    {
      title: String,
      fileId: String, // Google Drive file ID
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
