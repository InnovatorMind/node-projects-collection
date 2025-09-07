import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      tasks: [],
    },
  },
  expires: {
    type: Number,
    default: Math.round(Date.now() / 1000 + 10),
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
