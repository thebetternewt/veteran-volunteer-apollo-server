const mongoose = require('mongoose')

const { Schema } = mongoose

module.exports = mongoose.model(
  'User',
  new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      middleName: String,
      lastName: {
        type: String,
        required: true,
      },
      age: { type: Number, required: true },
      email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: null,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
)
