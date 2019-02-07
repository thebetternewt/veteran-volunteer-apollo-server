import 'mongoose-geojson-schema'
import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId, Point },
} = mongoose

export default mongoose.model(
  'RecipientProfile',
  new Schema(
    {
      user: {
        type: ObjectId,
        ref: 'User',
        required: true,
      },
      preferredContact: {
        type: String,
        required: true,
        enum: ['phone', 'email'],
      },
      location: {
        type: Point,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
)
