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
      allowPhoneContact: {
        type: Boolean,
        default: false,
      },
      allowEmailContact: {
        type: Boolean,
        default: false,
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
