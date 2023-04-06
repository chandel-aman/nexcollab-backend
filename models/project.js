const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  currentFile: {
    type: String,
    required: true,
  },
  version: [
    {
      time: {
        type: Date,
        require: true,
      },
      fileName: {
        type: String,
        required: true,
      },
    },
  ],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  access: [
    {
      userId: {
        type: String,
        require: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
