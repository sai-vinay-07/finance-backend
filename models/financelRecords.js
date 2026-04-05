const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  notes: {
    type: String,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

recordSchema.index({ user: 1, date: -1 });
recordSchema.index({ user: 1, type: 1, category: 1 });

module.exports = mongoose.model("FinancialRecord", recordSchema);