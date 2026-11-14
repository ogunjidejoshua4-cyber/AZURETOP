const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a product category']
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: 0,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);