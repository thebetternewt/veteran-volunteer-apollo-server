import mongoose from 'mongoose'
import 'mongoose-geojson-schema'

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
        address: {
          type: String,
          required: true,
        },
        point: {
          type: Point,
          required: true,
        },
      },
    },
    {
      timestamps: true,
    }
  )
)
