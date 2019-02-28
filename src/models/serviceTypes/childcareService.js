import mongoose from 'mongoose'
import 'mongoose-geojson-schema'

const ages = ['INFANT', 'TODDLER', 'CHILD', 'TEENAGER']

const {
  Schema,
  Types: { ObjectId, Point },
} = mongoose

const schema = new Schema(
  {
    serviceType: {
      type: String,
      default: 'CHILDCARE',
    },
    age: {
      type: [String],
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

export default mongoose.model('ChildcareService', schema)
