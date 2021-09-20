const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  //link: { type: Schema.Types.ObjectId, ref: 'Link', required: false },
  title: {
    type: String,
    required: true,
  },
  hyperlink: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Link", LinkSchema);
