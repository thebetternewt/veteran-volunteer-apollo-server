import mongoose from 'mongoose'
import 'mongoose-geojson-schema'
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
      address: {
        type: String,
        required: true,
      },
      point: {
        type: Point,
        required: true,
      },
    },
    notes: String,
    date: {
      type: Date,
      required: true,
    },
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

serviceSchema.index({ 'location.point': '2dsphere' })

export default mongoose.model('Service', serviceSchema)
