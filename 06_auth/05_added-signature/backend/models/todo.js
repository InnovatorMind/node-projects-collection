import { model, Schema } from "mongoose";

const todoSchema = new Schema({
  task: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, {
  strict: "throw"
});

const Todo = model("Todo", todoSchema);
export default Todo;
