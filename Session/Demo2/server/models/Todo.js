import { model, Schema } from "mongoose";

const todoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  task: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
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
