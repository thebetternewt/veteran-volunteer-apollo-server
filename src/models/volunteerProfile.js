import mongoose from 'mongoose'
import 'mongoose-geojson-schema'
import serviceTypes from './serviceTypes/types'

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
      bio: String,
      availability: {
        weekdays: {
          type: Boolean,
          default: false,
        },
        weekends: {
          type: Boolean,
          default: false,
        },
        details: String,
      },
      servicesProvided: [
        {
          type: String,
          enum: serviceTypes,
        },
      ],
      skills: [String],
      serviceLocation: {
        address: {
          type: String,
          required: true,
        },
        point: {
          type: Point,
          required: true,
        },
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
