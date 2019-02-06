import 'mongoose-geojson-schema'
import mongoose from 'mongoose'

const {
  Schema,
  Types: { Point },
} = mongoose

const schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)

schema.index({ fromLocation: '2dsphere' })

export default mongoose.model('TravelService', schema)
