const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  server: String,
  nickname: String,
  userId: String,
  rating1v1: Number,
  rating2v2: Number,
  rating3v3: Number,
  rank: String,
  k1v1: Number,
  k2v2: Number,
  k3v3: Number,
  victories1v1: Number,
  defeats1v1: Number,
  winrate1v1: Number,
  victories2v2: Number,
  defeats2v2: Number,
  winrate2v2: Number,
  victories3v3: Number,
  defeats3v3: Number,
  winrate3v3: Number,
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserModel };
