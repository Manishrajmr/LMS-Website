const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  review: {
    type: String,
    trim: true,
    maxlength: 1000,
  },

});

module.exports = mongoose.model("RatingAndReview",RatingAndReviewSchema);