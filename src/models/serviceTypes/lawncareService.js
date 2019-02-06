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
      default: 'LAWNCARE',
    },
    equipmentNeeded: {
      type: Boolean,
      default: false,
    },
    description: String,
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

export default mongoose.model('LawncareService', schema)
