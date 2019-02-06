import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

export default mongoose.model(
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
      phone: {
        type: String,
        required: true,
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
      active: {
        type: Boolean,
        default: true,
      },
      recipientProfile: {
        type: ObjectId,
        ref: 'RecipientProfile',
      },
    },
    {
      timestamps: true,
    }
  )
)
