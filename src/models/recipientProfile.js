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
      branch: String,
      deployed: {
        type: Boolean,
        default: false,
      },
      household: [
        {
          name: { type: String, required: true },
          relationship: { type: String, required: true },
          userId: { type: ObjectId, ref: 'User' },
        },
      ],
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
