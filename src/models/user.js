import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId },
} = mongoose

// const addressSchema = new Schema()

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
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        street1: String,
        street2: String,
        city: String,
        state: String,
        zipcode: String,
      },
      avatar: String,
      admin: {
        type: Boolean,
        default: false,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  )
)
