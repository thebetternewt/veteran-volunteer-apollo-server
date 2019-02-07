import 'mongoose-geojson-schema'
import mongoose from 'mongoose'
import serviceTypes from './serviceTypes/types'

const {
  Schema,
  Types: { ObjectId, Point },
} = mongoose

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    recipient: {
      type: ObjectId,
      ref: 'RecipientProfile',
      required: true,
    },
    volunteer: {
      type: ObjectId,
      ref: 'VolunteerProfile',
    },
    location: {
      type: Point,
      required: true,
    },
    notes: String,

    serviceType: {
      type: String,
      required: true,
      enum: serviceTypes,
    },
  },
  {
    timestamps: true,
  }
)

serviceSchema.index({ location: '2dsphere' })

export default mongoose.model('Service', serviceSchema)
