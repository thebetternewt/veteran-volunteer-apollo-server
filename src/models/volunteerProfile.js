import 'mongoose-geojson-schema'
import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId, Point },
} = mongoose

export default mongoose.model(
  'VolunteerProfile',
  new Schema(
    {
      user: {
        type: ObjectId,
        ref: 'User',
        required: true,
      },
      serviceLocation: {
        type: Point,
        required: true,
      },
      serviceRadius: {
        type: Number,
        required: true,
        default: 10,
      },
    },
    {
      timestamps: true,
    }
  )
)
