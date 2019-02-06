import 'mongoose-geojson-schema'
import mongoose from 'mongoose'

const {
  Schema,
  Types: { ObjectId, Point },
} = mongoose

const schema = new Schema(
  {
    serviceType: {
      type: String,
      default: 'TRAVEL',
    },
    fromName: {
      type: String,
      required: true,
    },
    fromLocation: {
      type: Point,
      required: true,
    },
    toName: {
      type: String,
      required: true,
    },
    toLocation: {
      type: Point,
      required: true,
    },
    service: {
      type: ObjectId,
      ref: 'Service',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('TravelService', schema)
