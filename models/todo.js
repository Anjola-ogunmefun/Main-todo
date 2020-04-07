const mongoose = require('mongoose');

const { Schema } = mongoose;

const TodoSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
}, {
  timestamps: true,
}
);

const TodoModel = mongoose.model('todo', TodoSchema);

module.exports = TodoModel;
